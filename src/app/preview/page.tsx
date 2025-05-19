"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import { RgbaColorPicker } from "react-colorful";
import html2canvas from "html2canvas";
import { motion } from "framer-motion";

const mockupOptions: Record<string, string> = {
  tshirt: "/mockups/t-shirt-white.png",
  tshirtBlack: "/mockups/t-shirt-black.png",
  cup: "/mockups/cup.png",
  toteBag: "/mockups/tote-bag.png",
  businessCard: "/mockups/business-card.png",
  wall: "/mockups/wall.png",
};

const mockupAspect: Record<string, string> = {
  tshirt: "4 / 5",
  tshirtBlack: "4 / 5",
  cup: "1 / 1.3",
  toteBag: "4 / 5",
  businessCard: "7 / 4",
  wall: "2 / 3",
};

const mockupSupportsColor: Record<string, boolean> = {
  tshirt: true,
  tshirtBlack: true,
  cup: true,
  toteBag: true,
  businessCard: true,
  wall: true,
};

export default function MockupPreview() {
  const [logo, setLogo] = useState<string | null>(null);
  const [logoPos, setLogoPos] = useState({ x: 50, y: 50 });
  const [logoSize, setLogoSize] = useState(25); // percentage
  const [mockupType, setMockupType] = useState("tshirt");
  const [shirtColor, setShirtColor] = useState({ r: 255, g: 255, b: 255, a: 1 });
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [loading, setLoading] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  const handleLogoChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/remove-background", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Gagal menghapus background");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setLogo(url);
      setLogoPos({ x: 50, y: 50 });
      setLogoSize(25);
    } catch (err) {
      console.error("Error:", err);
      alert("Terjadi kesalahan saat menghapus background");
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e: MouseEvent) => {
    if (!dragging || !previewRef.current || !logoRef.current) return;
    const rect = previewRef.current.getBoundingClientRect();

    let x = ((e.clientX - rect.left) / rect.width) * 100;
    let y = ((e.clientY - rect.top) / rect.height) * 100;

    const halfWidth = logoSize / 2;
    const halfHeight = (logoSize / 2) * (logoRef.current.naturalHeight / logoRef.current.naturalWidth);

    x = Math.max(halfWidth, Math.min(100 - halfWidth, x));
    y = Math.max(halfHeight, Math.min(100 - halfHeight, y));

    setLogoPos({ x, y });
  };

  const handleResize = (e: MouseEvent) => {
    if (!resizing || !previewRef.current || !logoRef.current) return;

    const rect = previewRef.current.getBoundingClientRect();
    const centerX = (logoPos.x / 100) * rect.width;
    const centerY = (logoPos.y / 100) * rect.height;

    const dx = Math.abs(e.clientX - centerX);
    const dy = Math.abs(e.clientY - centerY);
    const newSizePx = Math.min(dx * 2, dy * 2);
    const newSizePercent = (newSizePx / rect.width) * 100;

    if (newSizePercent >= 5 && newSizePercent <= 80) {
      setLogoSize(newSizePercent);
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
    setResizing(false);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleDrag);
    window.addEventListener("mousemove", handleResize);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleDrag);
      window.removeEventListener("mousemove", handleResize);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, resizing, logoSize, logoPos]);

  const handleDownload = async () => {
    if (!exportRef.current) return;
    const canvas = await html2canvas(exportRef.current, {
      backgroundColor: null,
      useCORS: true,
      scale: 3,
    });
    const link = document.createElement("a");
    link.download = `mockup-logo.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const shirtRGBA = `rgba(${shirtColor.r}, ${shirtColor.g}, ${shirtColor.b}, ${shirtColor.a})`;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-100 to-white p-6 font-sans">
      <motion.h1
        className="text-3xl font-bold mb-10 text-center text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🖼️ Preview Mockup Logo Otomatis
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Sidebar */}
        <div>
          <label className="inline-block mb-6 cursor-pointer">
            <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
            <div className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-indigo-700 transition">
              📤 {loading ? "Memproses..." : "Unggah Logo Anda"}
            </div>
          </label>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Pilih Jenis Mockup</label>
            <select
              value={mockupType}
              onChange={(e) => setMockupType(e.target.value)}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="tshirt">Kaos Putih</option>
              <option value="tshirtBlack">Kaos Hitam</option>
              <option value="cup">Cangkir</option>
              <option value="toteBag">Tote Bag</option>
              <option value="businessCard">Kartu Nama</option>
              <option value="wall">Penant</option>
            </select>
          </div>

          {mockupSupportsColor[mockupType] && (
            <div className="mt-6 max-w-xs">
              <label className="block mb-2 text-gray-700 font-medium">Background</label>
              <RgbaColorPicker color={shirtColor} onChange={setShirtColor} />
            </div>
          )}

          {logo && !loading && (
            <div className="mt-8">
              <button
                onClick={handleDownload}
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold shadow hover:bg-green-700 transition w-full"
              >
                ⬇️ Download Mockup
              </button>
            </div>
          )}
        </div>

        {/* Preview Area */}
        <motion.div
          ref={previewRef}
          className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-gray-300 bg-white"
          style={{
            aspectRatio: mockupAspect[mockupType],
            backgroundColor: mockupSupportsColor[mockupType] ? shirtRGBA : "transparent",
          }}
        >
          <img
            src={mockupOptions[mockupType]}
            alt={`Mockup ${mockupType}`}
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
            draggable={false}
          />

          {logo && (
            <div
              style={{
                position: "absolute",
                top: `${logoPos.y}%`,
                left: `${logoPos.x}%`,
                width: `${logoSize}%`,
                transform: "translate(-50%, -50%)",
                cursor: dragging ? "grabbing" : "grab",
                userSelect: "none",
              }}
              onMouseDown={(e) => {
                if ((e.target as HTMLElement).id !== "resize-handle") {
                  setDragging(true);
                }
              }}
            >
              <img
                ref={logoRef}
                src={logo}
                alt="Logo Preview"
                style={{ width: "100%", height: "auto", pointerEvents: "auto" }}
                draggable={false}
              />
              <div
                id="resize-handle"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setResizing(true);
                }}
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: 20,
                  height: 20,
                  backgroundColor: "rgba(0,0,0,0.4)",
                  borderRadius: 4,
                  cursor: "nwse-resize",
                }}
              />
            </div>
          )}
        </motion.div>

        {/* Hidden Export Area (no resize handle) */}
        <div
          ref={exportRef}
          style={{
            position: "fixed",
            top: -9999,
            left: -9999,
            width: "400px",
            aspectRatio: mockupAspect[mockupType],
            backgroundColor: mockupSupportsColor[mockupType] ? shirtRGBA : "transparent",
            overflow: "hidden",
            pointerEvents: "none",
            userSelect: "none",
            zIndex: -1,
          }}
        >
          <img
            src={mockupOptions[mockupType]}
            alt={`Mockup ${mockupType}`}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            draggable={false}
          />
          {logo && (
            <img
              src={logo}
              alt="Logo Export"
              style={{
                position: "absolute",
                top: `${logoPos.y}%`,
                left: `${logoPos.x}%`,
                width: `${logoSize}%`,
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
                userSelect: "none",
                height: "auto",
                maxWidth: "100%",
                maxHeight: "100%",
              }}
              draggable={false}
            />
          )}
        </div>
      </div>
    </main>
  );
}
