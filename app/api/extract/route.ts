import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { base64Image, imagePath } = body;

    let finalBase64Image = base64Image;

    // If imagePath is provided instead of base64, read the file
    if (imagePath && !base64Image) {
      try {
        // Remove leading slash if present and construct full path
        const relativePath = imagePath.startsWith("/")
          ? imagePath.slice(1)
          : imagePath;
        const fullPath = path.join(process.cwd(), "public", relativePath);

        // Check if file exists
        try {
          await fs.access(fullPath);
        } catch {
          return NextResponse.json(
            { error: "Image file not found", path: fullPath },
            { status: 404 }
          );
        }

        // Read file and convert to base64
        const fileBuffer = await fs.readFile(fullPath);
        finalBase64Image = fileBuffer.toString("base64");
      } catch (fsError) {
        console.error("File system error:", fsError);
        return NextResponse.json(
          {
            error: "Failed to read image file",
            details: (fsError as Error).message,
          },
          { status: 500 }
        );
      }
    }

    if (!finalBase64Image) {
      return NextResponse.json(
        {
          error:
            "No image provided. Please provide either base64Image or imagePath",
        },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3001",
          "X-Title": "Birth Certificate Extraction",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          temperature: 0.1,
          max_tokens: 1500,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `You are an expert at extracting data from birth certificates. Extract ALL information from this birth certificate image.

CRITICAL INSTRUCTIONS FOR REMARKS SECTION:
1. Look for a section titled "REMARKS" (all caps, possibly with space after it)
2. The "REMARKS" section might be at the bottom of the document
3. Extract ALL text that comes after "REMARKS" until the end of that section
4. Include any text, codes, numbers, or notes in the remarks
5. Common remark content: "ASDASDASD ASDA S" or similar text
6. If there's no remarks section, leave it as empty string ""

Return ONLY valid JSON with this exact structure:
{
  "registryNo": "",
  "dateOfRegistration": "",
  "childLastName": "",
  "childFirstName": "",
  "childMiddleName": "",
  "sex": "",
  "dateOfBirth": "",
  "birthOrder": "",
  "placeOfBirth": "",
  "motherLastName": "",
  "motherFirstName": "",
  "motherMiddleName": "",
  "motherCitizenship": "",
  "fatherLastName": "",
  "fatherFirstName": "",
  "fatherMiddleName": "",
  "fatherCitizenship": "",
  "dateOfMarriage": "",
  "placeOfMarriage": "",
  "remarks": "",
  "registrarName: "",
}

ADDITIONAL RULES:
1. Extract ALL visible text including small print
2. For "REMARKS": Look for the exact word "REMARKS" in any format
3. Extract everything that follows "REMARKS"
4. Preserve exact text formatting of remarks
5. Format dates as "Month Day, Year"
6. Leave fields as "" if not found
7. Return ONLY the JSON object`,
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${finalBase64Image}`,
                    detail: "high",
                  },
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", errorText);
      throw new Error(`OpenRouter API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const outputText = data?.choices?.[0]?.message?.content || "";

    console.log("OpenRouter response:", outputText);

    let extractedData;

    try {
      const jsonMatch = outputText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        extractedData = JSON.parse(jsonMatch[0]);
      } else {
        extractedData = JSON.parse(outputText);
      }
    } catch (error) {
      console.error("Failed to parse JSON from OpenRouter:", outputText);
      console.error("Parse error:", error);

      // Return a default structure with empty values
      extractedData = {
        registryNo: "",
        dateOfRegistration: "",
        childLastName: "",
        childFirstName: "",
        childMiddleName: "",
        sex: "",
        dateOfBirth: "",
        birthOrder: "",
        placeOfBirth: "",
        motherLastName: "",
        motherFirstName: "",
        motherMiddleName: "",
        motherCitizenship: "",
        fatherLastName: "",
        fatherFirstName: "",
        fatherMiddleName: "",
        fatherCitizenship: "",
        dateOfMarriage: "",
        placeOfMarriage: "",
        remarks: "",
        registrarName: "",
      };
    }

    // Ensure all fields are present even if OpenRouter missed some
    const fullExtractedData = {
      registryNo: extractedData.registryNo || "",
      dateOfRegistration: extractedData.dateOfRegistration || "",
      childLastName: extractedData.childLastName || "",
      childFirstName: extractedData.childFirstName || "",
      childMiddleName: extractedData.childMiddleName || "",
      sex: extractedData.sex || "",
      dateOfBirth: extractedData.dateOfBirth || "",
      birthOrder: extractedData.birthOrder || "",
      placeOfBirth: extractedData.placeOfBirth || "",
      motherLastName: extractedData.motherLastName || "",
      motherFirstName: extractedData.motherFirstName || "",
      motherMiddleName: extractedData.motherMiddleName || "",
      motherCitizenship: extractedData.motherCitizenship || "",
      fatherLastName: extractedData.fatherLastName || "",
      fatherFirstName: extractedData.fatherFirstName || "",
      fatherMiddleName: extractedData.fatherMiddleName || "",
      fatherCitizenship: extractedData.fatherCitizenship || "",
      dateOfMarriage: extractedData.dateOfMarriage || "",
      placeOfMarriage: extractedData.placeOfMarriage || "",
      remarks: extractedData.remarks || "",
      registrarName: extractedData.registrarName || "",
    };

    return NextResponse.json(fullExtractedData);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error in extraction:", err.message);
      console.error("Error stack:", err.stack);
      return NextResponse.json(
        {
          error: "Failed to extract data from image",
          details: err.message,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST." },
    { status: 405 }
  );
}
