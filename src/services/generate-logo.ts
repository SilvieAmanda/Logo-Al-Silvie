import { FormLogoValues } from "@/global.types";
import { serverConfig } from "@/lib/config.server";
import Together from "together-ai";

const together = new Together({
  apiKey: serverConfig.togetherApiKey, // Masukkan API Key dari config
});

const generatePrompt = (values: FormLogoValues): string => {
  const prompts = [
    "You are a logo designer. Your task is to create a logo with these specifications:",
    `logo_name=${values.name}`,
    `logo_description=${values.description}`,
    `logo_style=${values.style}`,
  ];
  if (values.colors.length > 0) {
    prompts.push(`colors=${values.colors.join(", ")}`);
  }
  return prompts.join(" ");
};

const convertToBase64Image = (base64ImageData: string) => 
  `data:image/png;base64,${base64ImageData}`;

const generateLogoWithTogether = async (prompt: string) => {
  try {
    const response = await together.images.create({
      model: "black-forest-labs/FLUX.1-schnell-Free",
      prompt: prompt,
      width: 1024,
      height: 1024,
      steps: 4,
      n: 1,
      response_format: "base64",
    });

    console.log("Response from Together AI:", response);

    if (response?.data?.[0]?.b64_json) {
      return convertToBase64Image(response.data[0].b64_json);
    } else {
      throw new Error("No valid image data received from Together AI.");
    }
  } catch (error) {
    console.error("Error generating logo with Together AI:", error);
    throw error;
  }
};

const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

const generateLogoWithHF = async (prompt: string) => {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
      {
        headers: {
          Authorization: `Bearer ${serverConfig.hfToken}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: prompt, parameters: { num_inference_steps: 4 } }),
      }
    );

    const arrayBuffer = await response.arrayBuffer();

    if (!response.ok) {
      const text = new TextDecoder().decode(arrayBuffer);
      console.error("HF ERROR: ", text);
      throw new Error("Failed to generate logo with HF.");
    }

    const base64Data = arrayBufferToBase64(arrayBuffer);
    return convertToBase64Image(base64Data);
  } catch (error) {
    console.error("Error generating logo with HF:", error);
    throw error;
  }
};

export const generateLogo = async (values: FormLogoValues): Promise<string> => {
  const prompt = generatePrompt(values);
  try {
    return await generateLogoWithTogether(prompt);
  } catch {
    return await generateLogoWithHF(prompt);
  }
};
