import { NextRequest, NextResponse } from "next/server";



function getEmptyStructure() {
  return {
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


export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
          "X-Title": "Birth Certificate Extraction",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          temperature: 0.1,
          max_tokens: 2000,
          response_format: { type: "json_object" },
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `You are an expert at extracting data from birth certificates. Extract ALL information from this birth certificate image and return ONLY a valid JSON object.

CRITICAL INSTRUCTIONS:
1. You MUST return ONLY valid JSON, no markdown, no backticks, no explanations
2. Start your response with { and end with }
3. For the REMARKS section: Look for "REMARKS" and extract ALL text after it
4. Format dates as "Month Day, Year" (e.g., "January 15, 2024")
5. Leave fields as "" (empty string) if not found
6. DO NOT include any text before or after the JSON object

Return this exact JSON structure:
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
  "registrarName": ""
}`,
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${base64Image}`,
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
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const outputText = data?.choices?.[0]?.message?.content || "{}";

    console.log("Raw OpenRouter response:", outputText);

    let extractedData;

    try {
      let cleanedText = outputText.trim();
      cleanedText = cleanedText.replace(/```json\s*/g, "");
      cleanedText = cleanedText.replace(/```\s*/g, "");
      cleanedText = cleanedText.trim();

      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        extractedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON object found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse JSON from OpenRouter:", outputText);
      console.error("Parse error:", parseError);

      extractedData = getEmptyStructure();
    }

    const fullExtractedData = {
      registryNo: String(extractedData.registryNo || ""),
      dateOfRegistration: String(extractedData.dateOfRegistration || ""),
      childLastName: String(extractedData.childLastName || ""),
      childFirstName: String(extractedData.childFirstName || ""),
      childMiddleName: String(extractedData.childMiddleName || ""),
      sex: String(extractedData.sex || ""),
      dateOfBirth: String(extractedData.dateOfBirth || ""),
      birthOrder: String(extractedData.birthOrder || ""),
      placeOfBirth: String(extractedData.placeOfBirth || ""),
      motherLastName: String(extractedData.motherLastName || ""),
      motherFirstName: String(extractedData.motherFirstName || ""),
      motherMiddleName: String(extractedData.motherMiddleName || ""),
      motherCitizenship: String(extractedData.motherCitizenship || ""),
      fatherLastName: String(extractedData.fatherLastName || ""),
      fatherFirstName: String(extractedData.fatherFirstName || ""),
      fatherMiddleName: String(extractedData.fatherMiddleName || ""),
      fatherCitizenship: String(extractedData.fatherCitizenship || ""),
      dateOfMarriage: String(extractedData.dateOfMarriage || ""),
      placeOfMarriage: String(extractedData.placeOfMarriage || ""),
      remarks: String(extractedData.remarks || ""),
      registrarName: String(extractedData.registrarName || ""),
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

    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST." },
    { status: 405 }
  );
}