import { FormLogoValues } from "@/global.types";
import { serverConfig } from "@/lib/config.server";
import Together from "together-ai";

// Inisialisasi Together AI dengan API key
const together = new Together({
  apiKey: serverConfig.togetherApiKey, // API key dari config
});

// Fungsi untuk memvalidasi warna (dapat diperluas dengan daftar warna yang lebih spesifik)
const isValidColor = (color: string): boolean => {
  const regex = /^#[0-9A-F]{6}$/i; // Menyaring warna dalam format hex (contoh: #FF5733)
  return regex.test(color) || ['red', 'green', 'blue'].includes(color.toLowerCase()); // Menambahkan warna dasar
};

// Fungsi generatePrompt untuk membuat prompt dengan gaya Leonardo AI
const generatePrompt = (values: FormLogoValues): string => {
  const style = values.style.toLowerCase(); // Menurunkan case gaya logo
  const description = values.description.toLowerCase(); // Menurunkan case deskripsi logo
  const category = values.category.toLowerCase(); // Menurunkan case kategori logo
  
  // Validasi warna dan batasi jumlah warna yang dipilih
  const validColors = values.colors.filter(isValidColor).slice(0, 3); // Validasi dan batasi hingga 3 warna

  const colors = validColors.length > 0 ? ` using ${validColors.join(" and ")}` : ""; // Menambahkan warna jika ada

  // Menyusun prompt dengan kategori
  const prompt = `Create a ${style} logo${colors}, designed for ${description}. The logo should be clean, modern, and suitable for branding in the ${category} category.`;
  
  // Menambahkan log untuk melihat hasil prompt di terminal
  console.log("Generated Prompt:", prompt);
  
  return prompt;
};

// Fungsi untuk mengonversi base64 image menjadi format yang bisa digunakan di HTML
const convertToBase64Image = (base64ImageData: string) =>
  `data:image/png;base64,${base64ImageData}`;

// Fungsi untuk menghasilkan logo menggunakan Together AI
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

    // Mengecek apakah ada data gambar yang valid
    if (response?.data?.[0]?.b64_json) {
      return convertToBase64Image(response.data[0].b64_json);
    } else {
      throw new Error("No valid image data received from Together AI.");
    }
  } catch (error) {
    console.error("Error generating logo with Together AI:", error);
    throw error; // Melempar error agar bisa ditangani di tempat lain
  }
};

// Fungsi untuk mengonversi array buffer menjadi base64
const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary); // Mengonversi string binary ke base64
};

// Fungsi untuk menghasilkan logo menggunakan Hugging Face (HF)
const generateLogoWithHF = async (prompt: string) => {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
      {
        headers: {
          Authorization: `Bearer ${serverConfig.hfToken}`, // Menambahkan token untuk autentikasi
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: prompt, parameters: { num_inference_steps: 4 } }), // Mengirim prompt ke HF
      }
    );

    const arrayBuffer = await response.arrayBuffer();

    // Menangani kemungkinan error dari Hugging Face API
    if (!response.ok) {
      const text = new TextDecoder().decode(arrayBuffer);
      console.error("HF ERROR: ", text);
      throw new Error("Failed to generate logo with HF.");
    }

    const base64Data = arrayBufferToBase64(arrayBuffer); // Mengonversi buffer ke base64
    return convertToBase64Image(base64Data); // Mengonversi ke format gambar base64
  } catch (error) {
    console.error("Error generating logo with HF:", error);
    throw error; // Melempar error agar bisa ditangani di tempat lain
  }
};

// Fungsi utama untuk menghasilkan logo, mencoba Together AI terlebih dahulu, jika gagal beralih ke Hugging Face
export const generateLogo = async (values: FormLogoValues): Promise<string> => {
  const prompt = generatePrompt(values); // Menghasilkan prompt berdasarkan input user
  try {
    // Mencoba generate logo dengan Together AI
    return await generateLogoWithTogether(prompt);
  } catch (error) {
    console.log("Trying Hugging Face as fallback due to error:", error);
    // Jika gagal, coba generate logo dengan Hugging Face
    return await generateLogoWithHF(prompt);
  }
};
