import { pipeline } from "@huggingface/transformers";

// Function to generate embeddings for a given data source
export async function getEmbedding(data) {
  const embedder = await pipeline(
    "feature-extraction",
    "Linq-AI-Research/Linq-Embed-Mistral"
  );
  const results = await embedder(data, { pooling: "mean", normalize: true });
  return Array.from(results.data);
}
