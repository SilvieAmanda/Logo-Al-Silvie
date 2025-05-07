import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type Body = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

export async function POST(request: Request) {
  const body: Body = await request.json();

  // Konfigurasi transporter SMTP
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Siapkan email
  const mailOptions = {
    from: `"AI Logo Generator" <${process.env.SMTP_USER}>`,
    to: process.env.CONTACT_TO_EMAIL,
    subject: `Pesan Baru dari ${body.name}`,
    html: `
      <h2>Pesan dari Contact Form</h2>
      <p><strong>Nama:</strong> ${body.name}</p>
      <p><strong>Email:</strong> ${body.email}</p>
      <p><strong>Nomor HP:</strong> ${body.phone}</p>
      <p><strong>Pesan:</strong><br/>${body.message}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Email send error:", error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
    console.error("Unknown error:", error);
    return NextResponse.json({ ok: false, error: "Unknown error occurred" }, { status: 500 });
  }
}
