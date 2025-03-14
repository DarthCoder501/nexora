import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText, Message } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Asynchronous POST request handler & extract messages from the body of the request.
export async function POST(req: Request) {
  const { messages }: { messages: Message[] } = await req.json();

  // Creates model
  const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_KEY,
  });

  // Results of the message
  const result = streamText({
    model: openrouter("google/gemini-2.0-pro-exp-02-05:free"),
    messages,
  });

  return result.toDataStreamResponse();
}
