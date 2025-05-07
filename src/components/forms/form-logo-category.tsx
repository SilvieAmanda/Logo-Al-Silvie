import { useContext, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormLogoContext } from "./context/form-logo-context"; // Pastikan context ini tersedia
import { ArrowRight, Sparkles } from "lucide-react"; // Import ikon Sparkles

const FormLogoCategory = () => {
  const formLogoCtx = useContext(FormLogoContext);

  // Inisialisasi dengan nilai default jika context kosong
  const [logoName, setLogoName] = useState(formLogoCtx?.values?.name || "");
  const [category, setCategory] = useState(formLogoCtx?.values?.category || "");

  // Jika context berubah, update state
  useEffect(() => {
    if (formLogoCtx?.values) {
      setLogoName(formLogoCtx?.values?.name || "");
      setCategory(formLogoCtx?.values?.category || "");
    }
  }, [formLogoCtx?.values]);

  const handleSubmit = () => {
    if (!logoName || !category) {
      alert("Nama logo dan kategori harus diisi.");
      return;
    }

    // Simpan ke context dan lanjut ke step berikutnya
    formLogoCtx?.setState({
      name: "description", // menuju ke langkah selanjutnya, misalnya "description"
      values: {
        ...formLogoCtx?.values,
        name: logoName,
        category: category,
      },
    });
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gradient-to-r from-blue-500 to-purple-600">
      <Card className="w-[90%] max-w-2xl max-h-screen shadow-2xl rounded-2xl border-none bg-white/90 backdrop-blur-lg p-6">
        <CardHeader className="text-center">
          <CardTitle className="font-black text-4xl flex items-center justify-center gap-2 text-gray-900">
            <Sparkles className="text-yellow-400 animate-pulse" /> {/* Ikon Bintang */}
            <span className="drop-shadow-lg">Logo Kategori</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Input Nama Logo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Logo
              </label>
              <input
                type="text"
                placeholder="Contoh: Warung Kopi"
                value={logoName}
                onChange={(e) => setLogoName(e.target.value)}
                className="w-full border-2 border-blue-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 rounded-xl p-2 bg-white shadow-md transition text-lg"
              />
            </div>

            {/* Input Kategori */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border-2 border-blue-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 rounded-xl p-3 bg-white shadow-md transition text-lg"
              >
                <option value="">Pilih Kategori</option>
                <option value="Teknologi">Teknologi</option>
                <option value="Makanan & Minuman">Makanan & Minuman</option>
                <option value="Fashion">Fashion</option>
                <option value="Kesehatan">Kesehatan</option>
                <option value="Pendidikan">Pendidikan</option>
                <option value="Olahraga">Olahraga</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            {/* Tombol Lanjut */}
            <div className="flex justify-center pt-4">
              <Button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg text-white flex items-center gap-2 py-3 px-8 rounded-xl text-lg"
              >
                Selanjutnya <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormLogoCategory;
