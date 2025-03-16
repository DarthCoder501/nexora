import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MongoClient } from "mongodb";
import { getEmbedding } from "./get-embeddings";
import * as fs from "fs";

export async function ingest(filePath) {
  const clinet = new MongoClient(process.env.MONGO_URI);

  try {
    // Load the PDF
    const loader = new PDFLoader(filePath);
    const data = await loader.load();

    // Chunk the text from the PDF
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const docs = await textSplitter.splitDocuments(data);
    console.log(`Successfully chunked the PDF into ${docs.length} documents.`);

    // Connect to your Atlas cluster
    await client.connect();
    const db = client.db("Nexora");
    const collection = db.collection("test");

    console.log("Generating embeddings and inserting documents...");
    const insertDocuments = [];
    await Promise.all(
      docs.map(async (doc) => {
        const embedding = await getEmbedding(doc.pageContent);
        insertDocuments.push({
          document: doc,
          embedding: embedding,
        });
      })
    );

    // Insert documents with embeddings into Atlas
    const options = { ordered: false };
    const result = await collection.insertMany(insertDocuments, options);
    console.log("Count of documents inserted: " + result.insertedCount);

    return result;
  } catch (err) {
    console.error(err.stack);
    throw err;
  } finally {
    await client.close();
  }
}
