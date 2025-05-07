"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok && data.ok) {
        alert("✅ Pesan berhasil dikirim!");
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        alert("❌ Gagal mengirim: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("❌ Terjadi kesalahan jaringan. Coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-pink-100 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-4xl font-extrabold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
          Hubungi Kami
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Kami dengan senang hati menerima pertanyaan, masukan, atau saran dari Anda.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm text-gray-600 font-medium mb-1 block">
              Nama Lengkap
            </label>
            <Input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Masukkan nama Anda"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 font-medium mb-1 block">
              Email
            </label>
            <Input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="nama@email.com"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 font-medium mb-1 block">
              Nomor HP
            </label>
            <Input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+62 812 3456 7890"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 font-medium mb-1 block">
              Pesan
            </label>
            <Textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={5}
              placeholder="Tulis pesan Anda..."
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-90"
            disabled={loading}
          >
            {loading ? "Mengirim..." : "Kirim Pesan"}
          </Button>
        </form>
      </div>
    </main>
  );
}
