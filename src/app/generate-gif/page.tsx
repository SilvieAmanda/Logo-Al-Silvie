'use client';

import { useEffect, useState, useRef } from 'react';
import Lottie from 'lottie-react';
import uploadAnim from '@/animations/Upload.json';
import { Download, Sparkles, Info } from 'lucide-react';

const ALL_ANIMATIONS = [
  'rotate', 'zoom', 'shine', 'bounce', 'fade', 'swing', 'slide', 'zoomRotate',
];

function AnimationTooltip({ text }: { text: string }) {
  return (
    <span className="ml-1 cursor-help text-gray-400" title={text}>
      <Info size={14} />
    </span>
  );
}

export default function GenerateGif() {
  const [logo, setLogo] = useState<string | null>(null);
  const [gifs, setGifs] = useState<{ url: string; type: string }[]>([]);
  const [gifshot, setGifshot] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const [frameCount, setFrameCount] = useState(12);
  const [intervalSec, setIntervalSec] = useState(0.15);
  const [selectedAnimations, setSelectedAnimations] = useState<string[]>(['rotate']);
  const [scale, setScale] = useState(1);
  const [loopCount, setLoopCount] = useState(0);

  // Import gifshot library secara dinamis di client side
  useEffect(() => {
    async function loadGifshot() {
      try {
        const mod = await import('gifshot');
        const library = mod.default || mod;
        setGifshot(library);
      } catch (error) {
        console.error('Failed to load gifshot library:', error);
      }
    }
    loadGifshot();
  }, []);

  // Drag & drop handler untuk upload logo image
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target?.result) setLogo(ev.target.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        alert('File harus berupa gambar!');
      }
    }
  };

  // Toggle animasi yang dipilih
  const toggleAnimation = (anim: string) => {
    setSelectedAnimations((prev) =>
      prev.includes(anim) ? prev.filter((a) => a !== anim) : [...prev, anim]
    );
  };

  // Fungsi create frames dari image dengan animasi tertentu
  const createFrames = (
    imageSrc: string,
    type: string,
    count: number,
    scale: number
  ): Promise<string[]> => {
    return new Promise((resolve) => {
      const image = new Image();
      image.crossOrigin = 'anonymous'; // Menghindari CORS error jika perlu
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = image.width;
        canvas.height = image.height;

        const frames: string[] = [];

        for (let i = 0; i < count; i++) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.save();

          const t = count === 1 ? 0 : i / (count - 1);

          // Pusatkan transformasi
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.scale(scale, scale);

          // Pilih animasi
          switch (type) {
            case 'rotate': {
              const angle = t * 2 * Math.PI;
              ctx.rotate(angle);
              break;
            }
            case 'zoom': {
              const zoomScale = 1 + 0.3 * Math.sin(t * 2 * Math.PI);
              ctx.scale(zoomScale, zoomScale);
              break;
            }
            case 'shine': {
              ctx.drawImage(image, -image.width / 2, -image.height / 2);
              const grad = ctx.createLinearGradient(
                -canvas.width / 2 + i * (canvas.width / count),
                -canvas.height / 2,
                -canvas.width / 2 + i * (canvas.width / count) + 60,
                canvas.height / 2
              );
              grad.addColorStop(0, 'rgba(255,255,255,0)');
              grad.addColorStop(0.5, 'rgba(255,255,255,0.6)');
              grad.addColorStop(1, 'rgba(255,255,255,0)');
              ctx.fillStyle = grad;
              ctx.fillRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
              ctx.restore();
              frames.push(canvas.toDataURL());
              return;
            }
            case 'bounce': {
              const bounceY = 30 * Math.abs(Math.sin(t * Math.PI * 2));
              ctx.translate(0, bounceY);
              break;
            }
            case 'fade': {
              ctx.globalAlpha = t;
              break;
            }
            case 'swing': {
              const angle = 0.2 * Math.sin(t * Math.PI * 4);
              ctx.rotate(angle);
              break;
            }
            case 'slide': {
              const slideX = (t - 0.5) * canvas.width * 0.8;
              ctx.translate(slideX, 0);
              break;
            }
            case 'zoomRotate': {
              const zoomScale = 1 + 0.2 * Math.sin(t * 2 * Math.PI);
              const angle = t * 2 * Math.PI;
              ctx.rotate(angle);
              ctx.scale(zoomScale, zoomScale);
              break;
            }
          }

          // Gambar logo di tengah setelah transformasi
          ctx.drawImage(image, -image.width / 2, -image.height / 2);
          ctx.restore();

          // Tambahkan watermark teks kecil di pojok bawah
          ctx.save();
          ctx.font = 'bold 16px sans-serif';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.fillText('LogoGen AI', 10, canvas.height - 10);
          ctx.restore();

          frames.push(canvas.toDataURL());
        }
        resolve(frames);
      };

      image.onerror = () => {
        alert('Gagal memuat gambar. Pastikan file gambar valid.');
        resolve([]);
      };
    });
  };

  // Fungsi generate GIF dengan gifshot
  const generateGIF = async () => {
    if (!logo) return alert('Logo belum diunggah.');
    if (!gifshot) return alert('Library gifshot belum siap.');
    if (selectedAnimations.length === 0) return alert('Pilih minimal satu animasi.');

    setIsGenerating(true);
    setGifs([]);

    try {
      const allFrames: string[] = [];
      for (const anim of selectedAnimations) {
        const frames = await createFrames(logo, anim, frameCount, scale);
        allFrames.push(...frames);
      }

      gifshot.createGIF(
        {
          images: allFrames,
          gifWidth: 300,
          gifHeight: 300,
          interval: intervalSec,
          numFrames: allFrames.length,
          repeat: loopCount,
        },
        (obj: any) => {
          if (!obj.error) {
            setGifs([{ url: obj.image, type: 'combined' }]);
          } else {
            alert('Gagal generate GIF: ' + obj.errorMsg);
          }
          setIsGenerating(false);
        }
      );
    } catch (error) {
      alert('Terjadi kesalahan saat generate GIF.');
      setIsGenerating(false);
    }
  };

  const resetAll = () => {
    setLogo(null);
    setGifs([]);
    setFrameCount(12);
    setIntervalSec(0.15);
    setSelectedAnimations(['rotate']);
    setScale(1);
    setLoopCount(0);
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white overflow-auto p-4">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="w-full max-w-3xl p-6 bg-white shadow-2xl rounded-xl space-y-6"
      >
        <h2 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
          <Sparkles className="text-yellow-500" size={24} />
          Generate GIF Logo
        </h2>

        {/* Upload */}
        <div className="border border-dashed border-gray-400 rounded-md p-4 text-center cursor-pointer hover:border-blue-500 transition relative">
          {logo ? (
            <img src={logo} alt="Preview" className="mx-auto max-h-48 object-contain" />
          ) : (
            <>
              <Lottie animationData={uploadAnim} loop style={{ height: 120 }} />
              <p className="text-gray-500 mt-2">Drag & drop logo atau klik untuk upload</p>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                  if (ev.target?.result) setLogo(ev.target.result as string);
                };
                reader.readAsDataURL(file);
              } else {
                alert('File harus berupa gambar!');
              }
            }}
          />
        </div>

        {/* Pilih Animasi */}
        <div>
          <h3 className="font-semibold mb-2 flex items-center">
            Pilih Animasi
            <AnimationTooltip text="Pilih satu atau lebih animasi yang akan digunakan untuk membuat GIF." />
          </h3>
          <div className="flex flex-wrap gap-2">
            {ALL_ANIMATIONS.map((anim) => (
              <button
                key={anim}
                onClick={() => toggleAnimation(anim)}
                className={`px-3 py-1 rounded-full border text-sm ${
                  selectedAnimations.includes(anim)
                    ? 'bg-blue-500 text-white'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
                type="button"
              >
                {anim}
              </button>
            ))}
          </div>
        </div>

        {/* Kontrol */}
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <button
            onClick={generateGIF}
            disabled={isGenerating}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            type="button"
          >
            {isGenerating ? 'Generating...' : 'Generate GIF'}
          </button>
          <button
            onClick={resetAll}
            className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            type="button"
          >
            Reset
          </button>

          <div className="flex flex-col gap-2 max-w-xs w-full">
            <label className="flex items-center gap-2">
              Frame Count
              <input
                type="number"
                min={1}
                max={50}
                value={frameCount}
                onChange={(e) => setFrameCount(Math.min(50, Math.max(1, +e.target.value)))}
                className="border rounded px-2 py-1 w-20"
              />
            </label>
            <label className="flex items-center gap-2">
              Interval (detik)
              <input
                type="number"
                min={0.05}
                max={1}
                step={0.01}
                value={intervalSec}
                onChange={(e) => setIntervalSec(Math.min(1, Math.max(0.05, +e.target.value)))}
                className="border rounded px-2 py-1 w-20"
              />
            </label>
            <label className="flex items-center gap-2">
              Scale
              <input
                type="number"
                min={0.1}
                max={3}
                step={0.1}
                value={scale}
                onChange={(e) => setScale(Math.min(3, Math.max(0.1, +e.target.value)))}
                className="border rounded px-2 py-1 w-20"
              />
            </label>
            <label className="flex items-center gap-2">
              Loop Count
              <input
                type="number"
                min={0}
                max={10}
                value={loopCount}
                onChange={(e) => setLoopCount(Math.max(0, +e.target.value))}
                className="border rounded px-2 py-1 w-20"
              />
              <span className="text-xs text-gray-500">(0 = infinite)</span>
            </label>
          </div>
        </div>

        {/* Hasil GIF */}
        <div className="flex flex-wrap gap-4 justify-center">
          {gifs.length === 0 && !isGenerating && (
            <p className="text-center text-gray-400 italic w-full">Hasil GIF akan muncul di sini</p>
          )}
          {gifs.map(({ url, type }, i) => (
            <div key={i} className="text-center">
              <p className="mb-2 font-medium capitalize">{type} GIF</p>
              <img src={url} alt={`GIF hasil ${type}`} className="max-w-xs rounded-md shadow-md" />
              <a
                href={url}
                download={`logo-gen-${type}.gif`}
                className="inline-block mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <Download size={16} className="inline-block mr-1" />
                Download
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
