import { NextRequest, NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: false, // karena kita terima form-data stream
  },
};

const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY;

export async function POST(req: NextRequest) {
  try {
    if (!REMOVE_BG_API_KEY) {
      return NextResponse.json({ error: "API key remove.bg belum diset" }, { status: 500 });
    }

    // Parsing multipart form-data menggunakan formidable atau busboy agak ribet di route handler Next.js,
    // jadi kita baca body langsung sebagai stream dan teruskan ke remove.bg dengan fetch.

    // Kita ambil file (image) dari request body sebagai stream (raw)
    const formData = await req.formData();
    const imageFile = formData.get("image") as Blob | null;

    if (!imageFile) {
      return NextResponse.json({ error: "File image tidak ditemukan" }, { status: 400 });
    }

    // Kirim file ke remove.bg via API mereka
    const removeBgRes = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": REMOVE_BG_API_KEY,
      },
      body: (() => {
        const form = new FormData();
        form.append("image_file", imageFile, "image.png");
        form.append("size", "auto");
        return form;
      })(),
    });

    if (!removeBgRes.ok) {
      const errJson = await removeBgRes.json();
      return NextResponse.json(
        { error: "Gagal remove background: " + (errJson.errors?.[0]?.title || removeBgRes.statusText) },
        { status: 500 }
      );
    }

    // Dapatkan hasil gambar PNG dengan background transparan
    const buffer = await removeBgRes.arrayBuffer();

    return new NextResponse(Buffer.from(buffer), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": "inline; filename=removed-bg.png",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || "Unknown error" }, { status: 500 });
  }
}
