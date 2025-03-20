import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText, Message } from "ai";
import { queryResults } from "@/lib/retrieve-docments.js";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Asynchronous POST request handler & extract messages from the body of the request.
export async function POST(req: Request) {
  const { messages }: { messages: Message[] } = await req.json();

  // Checks if the user has sent a PDF file
  const messagehasPDF = messages.some((message) =>
    message.experimental_attachments?.some(
      (a) => a.contentType === "application/pdf"
    )
  );

  // Creates model
  const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_KEY,
  });

  // Results of the message
  const result = streamText({
    model: openrouter("google/gemini-2.0-pro-exp-02-05:free"),
    // Prompt to make the LLM act in a certain way
    system: `You are an AI academic assistant designed to help users complete homework and assignments strictly using the documents, files, or information they provide.
     Your role is to guide learning by clarifying concepts, breaking down problems, and highlighting relevant sections from their materials to ensure the user understands
    why the direct answer is the answer. If their materials lack necessary information, respond,
     “This is not covered in your resources. Can you clarify or share more context?”`,
    messages,
  });

  return result.toDataStreamResponse();
}
