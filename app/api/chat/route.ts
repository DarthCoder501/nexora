import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText, Message } from "ai";
import { queryResults } from "@/lib/retrieve-docments.js";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Asynchronous POST request handler & extract messages from the body of the request.

export async function POST(req: Request) {
  console.log("POST request received");
  const { messages }: { messages: Message[] } = await req.json();
  console.log("Received messages:", messages);

  // Check for PDF attachments
  const messageWithPDF = messages.find((message) =>
    message.experimental_attachments?.some(
      (a) => a.contentType === "application/pdf"
    )
  );
  console.log("PDF message found:", messageWithPDF ? "yes" : "no");

  // If there's a PDF, get its content using queryResults
  let pdfContent = "";
  if (messageWithPDF?.experimental_attachments?.[0]) {
    try {
      console.log("Processing PDF attachment...");
      const results = await queryResults(messageWithPDF.content);
      console.log("Query results:", results);

      // Extract document content from results
      pdfContent = results
        ?.map((doc) => doc.document || "")
        .filter(Boolean)
        .join("\n");

      console.log("PDF content extracted:", pdfContent ? "success" : "empty");
    } catch (error) {
      console.error("Error processing PDF:", error);
      pdfContent = ""; // Reset to empty string on error
    }
  }

  // Creates model
  const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_KEY,
  });
  console.log("OpenRouter initialized");

  // Get the last user message
  const lastUserMessage = messages[messages.length - 1];
  console.log("Last user message:", lastUserMessage.content);

  // Combine PDF content with user's question
  const enhancedPrompt = pdfContent
    ? `Context from PDF:\n${pdfContent}\n\nUser's question: ${lastUserMessage.content}`
    : lastUserMessage.content;
  console.log(
    "Enhanced prompt created with PDF content:",
    pdfContent ? "yes" : "no"
  );

  console.log("Sending request to OpenRouter...");
  try {
    const result = streamText({
      model: openrouter("google/gemini-2.0-pro-exp-02-05:free"),
      system: `You are an AI academic assistant designed to help users complete homework and assignments strictly using the documents, files, or information they provide.
      Your role is to guide learning by clarifying concepts, breaking down problems, and highlighting relevant sections from their materials to ensure the user understands
      why the direct answer is the answer. If their materials lack necessary information, respond,
      "This is not covered in your resources. Can you clarify or share more context?"
      
      Format your responses using markdown:
      - Use ## for section headings
      - Use bullet points for lists
      - Use \`backticks\` for code or technical terms
      - Use > for important quotes or highlights
      - Use **bold** for emphasis
      `,
      messages: [
        ...messages.slice(0, -1),
        { role: "user", content: enhancedPrompt },
      ],
    });
    console.log("Response stream created");
    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error creating response stream:", error);
    return new Response("Error processing request", { status: 500 });
  }
}
