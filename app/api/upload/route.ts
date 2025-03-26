import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { ingest } from "../../../lib/ingest";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save the uploaded file temporarily
    const filePath = path.join(process.cwd(), "temp-uploaded-file.pdf");
    fs.writeFileSync(filePath, buffer);

    // Process the file using the ingest function
    const result = await ingest(filePath);

    // Clean up the temporary file
    fs.unlinkSync(filePath);

    return NextResponse.json({
      message: "File processed and data ingested successfully",
      result,
    });
  } catch (error) {
    console.error("Error processing file:", error);
    return NextResponse.json(
      { error: "Error processing file" },
      { status: 500 }
    );
  }
}
