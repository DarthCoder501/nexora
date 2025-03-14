"use client";

/*
Using the useChat hook to provide and handle user input
*/

import { useChat } from "@ai-sdk/react";
/*
messages handles the chat history
input handles what the user is typing
handleInputChange updates the input when the user types
handleSubmit handles sending the message
*/

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  return (
    // Container for the chat input box
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map((m) => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === "user" ? "User: " : "AI: "}
          {m.content}
        </div>
      ))}
      <form
        onSubmit={handleSubmit}
        // Forces the input box to be at the bottom on the page
        className="fixed bottom-0 w-full max-w-md mb-8 border border-gray-300 rounded shadow-xl"
      >
        <input
          // Styles the input field
          className="w-full p-2"
          value={input}
          // Displays placeholder message
          placeholder="Ask your questions here..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
