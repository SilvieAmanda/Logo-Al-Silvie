"use client";

import { FormLandingPage } from "@/components/forms/form-landing-page";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Home() {
  // Daftar nama file gambar logo
  const imageList = [
    "0.png", "1.png", "2.png", "3.png", "4.png", "5.png", "6.png",
    "7.png", "8.png", "9.png", "10.png", "11.png", "12.png", "13.png", "14.png",
  ];

  // Fungsi untuk gerakan acak logo
  const getRandom = (min: number, max: number) =>
    Math.random() * (max - min) + min;

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-20 flex flex-col items-center text-center gap-12">
      
      {/* ================= Judul & Deskripsi ================= */}
      <section>
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-pink-500 to-red-500 pb-2"
        >
          AI Logo Generator
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-5 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto"
        >
          Buat logo profesional hanya dalam beberapa klik. Ditenagai oleh teknologi AI, gratis & cepat!
        </motion.p>
      </section>

      {/* ================= Form Input ================= */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="w-full max-w-md"
      >
        <FormLandingPage />
      </motion.div>

      {/* ================= Penjelasan Galeri ================= */}
      <motion.p
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.8, duration: 0.6 }}
  className="text-3xl sm:text-4xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600"
>
  Berikut ini contoh logo keren yang bisa dihasilkan AI kami:
</motion.p>


      {/* ================= Galeri Logo ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
        {imageList.map((imgName, i) => {
          const floatX = getRandom(-10, 10);
          const floatY = getRandom(-10, 10);
          const duration = getRandom(3, 6);

          return (
            <motion.div
              key={i}
              animate={{ x: [0, floatX, 0], y: [0, floatY, 0] }}
              transition={{
                duration,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }}
              className="group relative"
            >
              <div className="rounded-xl overflow-hidden shadow-lg border border-gray-300 hover:shadow-2xl transition-transform transform group-hover:scale-105 group-hover:rotate-1">
                <Image
                  src={`/images/${imgName}`}
                  width={512}
                  height={512}
                  alt={`Contoh Logo ${i + 1}`}
                  className="size-36 sm:size-52 xl:size-64 object-cover rounded-xl"
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </main>
  );
}
