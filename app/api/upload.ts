// pages/api/upload.ts
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { ingest } from "../../lib/ingest";

export const config = {
  api: {
    bodyParser: false, // Disable default body parsing to handle file uploads
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  const chunks: Uint8Array[] = [];
  req.on("data", (chunk) => {
    chunks.push(chunk);
  });

  req.on("end", async () => {
    try {
      // Save the uploaded file temporarily
      const buffer = Buffer.concat(chunks);
      const filePath = path.join(process.cwd(), "temp-uploaded-file.pdf");
      fs.writeFileSync(filePath, buffer);

      // Process the file using the ingestPDF function
      const result = await ingest(filePath);

      // Clean up the temporary file
      fs.unlinkSync(filePath);

      // Respond with success
      res
        .status(200)
        .json({
          message: "File processed and data ingested successfully",
          result,
        });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error processing file", error: err });
    }
  });
}
