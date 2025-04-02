/*
Retriveal function to run a query to get relevant docs 
Uses embedding from query to find similar docs w/ cosine similarity
*/

import { MongoClient } from "mongodb";
import { getEmbedding } from "./get-embeddings.js";

// Function to get vector query results
export async function queryResults(query) {
  const client = new MongoClient(process.env.MONGO_URI, {
    ssl: true,
    tlsAllowInvalidCertificates: false,
    //tlsCAFile: "<path-to-ca-file>", // If using custom CA
    serverApi: {
      version: "1",
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    console.log("Getting embedding for query:", query);
    const queryEmbedding = await getEmbedding(query);
    console.log("Embedding generated successfully");

    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("Nexora");
    const collection = db.collection("test");

    const pipeline = [
      {
        $vectorSearch: {
          index: "vector_index",
          queryVector: queryEmbedding,
          path: "embedding",
          exact: true,
          limit: 5,
        },
      },
      {
        $project: {
          _id: 0,
          document: 1,
        },
      },
    ];

    console.log("Executing vector search...");
    const result = collection.aggregate(pipeline);

    const arrayofQueryDocs = [];
    for await (const doc of result) {
      arrayofQueryDocs.push(doc);
    }
    console.log(`Found ${arrayofQueryDocs.length} documents`);

    return arrayofQueryDocs;
  } catch (err) {
    console.error("Error in queryResults:", err);
    throw err; // Re-throw the error to be handled by the caller
  } finally {
    await client.close();
    console.log("MongoDB connection closed");
  }
}
