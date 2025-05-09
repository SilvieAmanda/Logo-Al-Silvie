import { FormLogoValues } from "@/global.types";
import { serverConfig } from "@/lib/config.server";
import Together from "together-ai";

// Validasi API Key
if (!serverConfig.togetherApiKey) {
  throw new Error("TOGETHER_API_KEY is missing in serverConfig");
}
if (!serverConfig.hfToken) {
  throw new Error("HF_TOKEN is missing in serverConfig");
}

// Inisialisasi Together AI
const together = new Together({
  apiKey: serverConfig.togetherApiKey,
});

// Validasi warna hex atau warna dasar
const isValidColor = (color: string): boolean => {
  const regex = /^#[0-9A-F]{6}$/i;
  return regex.test(color) || ['red', 'green', 'blue'].includes(color.toLowerCase());
};

// Bangun prompt berdasarkan input user
const generatePrompt = (values: FormLogoValues): string => {
  const style = values.style.toLowerCase();
  const description = values.description.toLowerCase();
  const category = values.category.toLowerCase();

  const validColors = values.colors.filter(isValidColor).slice(0, 3);
  const colorText = validColors.length > 0 ? ` using ${validColors.join(" and ")}` : "";

  const prompt = `Create a ${style} logo${colorText}, designed for ${description}. The logo should be clean, modern, and suitable for branding in the ${category} category.`;

  console.log("Generated Prompt:", prompt);
  return prompt;
};

// Konversi base64 string ke format img src
const convertToBase64Image = (base64: string): string => `data:image/png;base64,${base64}`;

// Fungsi untuk generate logo via Together AI
const generateLogoWithTogether = async (prompt: string): Promise<string> => {
  try {
    const response = await together.images.create({
      model: "black-forest-labs/FLUX.1-schnell-Free",
      prompt,
      width: 1024,
      height: 1024,
      steps: 4,
      n: 1,
      response_format: "base64",
    });

    console.log("Together AI response:", response);

    if (response?.data?.[0]?.b64_json) {
      return convertToBase64Image(response.data[0].b64_json);
    }

    throw new Error("No valid image data received from Together AI.");
  } catch (error) {
    console.error("Error in Together AI:", error);
    throw error;
  }
};

// Buffer to base64 converter (untuk HuggingFace)
const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

// Generate logo fallback ke HuggingFace
const generateLogoWithHF = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch("https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serverConfig.hfToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { num_inference_steps: 4 },
      }),
    });

    const arrayBuffer = await response.arrayBuffer();

    if (!response.ok) {
      const errorText = new TextDecoder().decode(arrayBuffer);
      console.error("HF API Error:", errorText);
      throw new Error("Failed to generate logo with Hugging Face.");
    }

    const base64 = arrayBufferToBase64(arrayBuffer);
    return convertToBase64Image(base64);
  } catch (error) {
    console.error("Error in Hugging Face:", error);
    throw error;
  }
};

// Fungsi utama: mencoba Together AI lalu fallback ke HF
export const generateLogo = async (values: FormLogoValues): Promise<string> => {
  const prompt = generatePrompt(values);

  try {
    return await generateLogoWithTogether(prompt);
  } catch (error) {
    console.log("Fallback to Hugging Face due to error:", error);
    return await generateLogoWithHF(prompt);
  }
};
