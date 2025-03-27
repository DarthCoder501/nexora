"use client";

//Using the useChat hook to provide and handle user input
import { useChat } from "@ai-sdk/react";
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";

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

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("File upload failed");
      }

      const result = await response.json();
      console.log("File uploaded successfully:", result);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    // Container for the chat input box
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="w-full max-w-xl bg-white shadow-md rounded-2xl p-6">
        <div className="mb-4 max-h-[400px] overflow-y-auto">
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
        </div>
        <form
          // Forces the input box to be at the bottom on the page
          className="flex flex-col"
          // Function to run when the form is submmited ( enter is pressed )
          onSubmit={async (event) => {
            event.preventDefault(); // Prevents default form submission

            if (files && files.length > 0) {
              handleFileUpload(files[0]);
            }
            // Calls handleSubmit to process the data
            handleSubmit(event, {
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
          {/* Upload Button */}
          <label htmlFor="file-upload" className="cursor-pointer p-2">
            <Upload className="w-6 h-6 text-gray-500 hover:text-blue-500" />
          </label>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={(event) => setFiles(event.target.files ?? undefined)}
            multiple
            ref={fileInputRef}
          />
          {/* Input Field */}
          <div className="relative w-full">
            <Input
              className="w-full px-4 py-3 pr-12 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={input}
              placeholder="Ask your questions here..."
              onChange={handleInputChange}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
