import { MongoClient } from "mongodb";

// Conecting to Atlas cluster
const client = new MongoClient(process.env.MONGO_URI);

async function vectorIndex() {
  try {
    const database = client.db("Nexora");
    const collection = database.collection("test");

    // Defining Atlas vector search index
    const index = {
      name: "vector_index",
      type: "vectorSearch",
      definition: {
        fields: [
          {
            type: "vector",
            numDemensions: 768, // need to change for HF model
            path: "embedding",
            similarity: "cosine",
          },
        ],
      },
    };
    // calling method to create the index
    const result = await collection.createSearchIndex(index);
  } finally {
    await client.close();
  }
}
vectorIndex().catch(console.dir);
