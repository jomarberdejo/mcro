import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { base64Image } = await req.json();

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
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
  "remarks": ""
}

ADDITIONAL RULES:
1. Extract ALL visible text including small print
2. For "REMARKS": Look for the exact word "REMARKS" in any format (REMARKS, Remarks, remarks)
3. Extract everything that follows "REMARKS" in that section
4. Preserve the exact text formatting of remarks
5. Format dates as "Month Day, Year" (e.g., "January 15, 2024")
6. Leave fields as "" if not found
7. Return ONLY the JSON object, no additional text`,
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
    });

    const outputText = response.choices?.[0]?.message?.content || "";

    let extractedData;
    try {
      const jsonMatch = outputText.match(/\{[\s\S]*\}/);
      extractedData = jsonMatch
        ? JSON.parse(jsonMatch[0])
        : JSON.parse(outputText);
    } catch (error) {
      console.error("Failed to parse JSON:", outputText);
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
      };
    }

    return NextResponse.json(extractedData);
  } catch (err: any) {
    console.error("Error in extraction:", err.message);
    return NextResponse.json(
      {
        error: "Failed to extract data from image",
        details: err.message,
      },
      { status: 500 }
    );
  }
}
