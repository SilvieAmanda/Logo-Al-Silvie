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
        className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-md text-lg shadow-md transition-all"
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        Create Logo
      </motion.button>
    </motion.div>
  );
};
