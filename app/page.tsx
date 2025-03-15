"use client";

//Using the useChat hook to provide and handle user input
import { useChat } from "@ai-sdk/react";
import { useRef, useState } from "react";

/*
messages handles the chat history
input handles what the user is typing
handleInputChange updates the input when the user types
handleSubmit handles sending the message
*/

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  // creates state to hold the files and create a ref to the file input field
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    // Container for the chat input box
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map((m) => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === "user" ? "User: " : "AI: "}
          {m.content}
          <div>
            {m?.experimental_attachments
              ?.filter((attachment) =>
                attachment?.contentType?.startsWith("application/pdf")
              )
              .map((attachment, index) =>
                attachment.contentType?.startsWith("application/pdf") ? (
                  // Render an iframe for each PDF
                  <iframe
                    key={`${m.id}-${index}`}
                    src={attachment.url} // URL of the PDF
                    width={500} // Height of the render
                    height={600} // Width of the render
                    title={attachment.name ?? `attachment-${index}`} // Title of the render
                  />
                ) : null
              )}
          </div>
        </div>
      ))}
      <form
        // Forces the input box to be at the bottom on the page
        className="fixed bottom-0 w-full max-w-md mb-8 border border-gray-300 rounded shadow-xl"
        // Function to run when the form is submmited ( enter is pressed )
        onSubmit={(event) => {
          // Calls handleSubmit to process the data
          handleSubmit(event, {
            // Includes the uploaded PDF files
            experimental_attachments: files,
          });

          // Clears the files state after form is submitted
          setFiles(undefined);
          // If the file input field exitsts then clear the value
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }}
      >
        <input
          // A file input field
          type="file"
          className=" "
          onChange={(event) => {
            if (event.target.files) {
              setFiles(event.target.files);
            }
          }}
          multiple
          ref={fileInputRef}
        />
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
