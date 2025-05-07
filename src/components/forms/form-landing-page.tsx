"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export const FormLandingPage = () => {
  const router = useRouter();
  const handleCreate = () => router.push("/create");

  return (
    <motion.div className="flex flex-col items-center justify-center gap-4"
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <motion.button onClick={handleCreate}
        className="mt-4 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform duration-300"
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        Create Logo
      </motion.button>
    </motion.div>
  );
};
