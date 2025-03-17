/*
Retriveal function to run a query to get relevant docs 
Uses embedding from query to find similar docs w/ cosine similarity
*/

import { MongoClient } from "mongodb";
import { getEmbedding } from "./get-embeddings.js";

// Function to get vector query results
export async function queryResults(query) {
  // Connecting to atlas cluster
  const client = new MongoClient(process.env.MONGO_URI);

  try {
    // Create query embeddings
    const queryEmbedding = await getEmbedding(query);

    await client.connect();
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
    // Get documents from atlas with vector search query
    const result = collection.aggregate(pipeline);

    const arrayofQueryDocs = [];
    for await (const doc of result) {
      arrayofQueryDocs.push(doc);
    }
    return arrayofQueryDocs;
  } catch (err) {
    console.log(err.stack);
  } finally {
    await client.close();
  }
}
