'use client';

import { useEffect, useState, useRef } from 'react';
import Lottie from 'lottie-react';
import uploadAnim from '@/animations/Upload.json';
import { Download, RefreshCw, Sparkles, Info } from 'lucide-react';

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
  const [interval, setInterval] = useState(0.15);
  const [selectedAnimations, setSelectedAnimations] = useState<string[]>(['rotate']);
  const [scale, setScale] = useState(1);
  const [loopCount, setLoopCount] = useState(0);

  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    import('gifshot').then((mod) => {
      const library = mod.default || mod;
      setGifshot(library);
    });
  }, []);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (ev) => setLogo(ev.target?.result as string);
        reader.readAsDataURL(file);
      }
    }
  };

  const toggleAnimation = (anim: string) => {
    setSelectedAnimations((prev) =>
      prev.includes(anim) ? prev.filter((a) => a !== anim) : [...prev, anim]
    );
  };

  const createFrames = async (
    imageSrc: string,
    type: string,
    count: number,
    scale: number
  ): Promise<string[]> => {
    return new Promise((resolve) => {
      const image = new Image();
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

          const t = i / (count - 1);
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.scale(scale, scale);

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
              break;
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

          ctx.drawImage(image, -image.width / 2, -image.height / 2);
          ctx.restore();

          ctx.save();
          ctx.font = 'bold 16px sans-serif';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.fillText('LogoGen AI', 10, canvas.height - 10);
          ctx.restore();

          frames.push(canvas.toDataURL());
        }
        resolve(frames);
      };
    });
  };

  const generateGIF = async () => {
    if (!logo || !gifshot) return alert('Logo belum diunggah atau gifshot belum siap.');
    if (selectedAnimations.length === 0)
      return alert('Minimal pilih satu animasi untuk dibuat GIF.');

    setIsGenerating(true);
    setGifs([]);

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
        interval: interval,
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
  };

  const resetAll = () => {
    setLogo(null);
    setGifs([]);
    setFrameCount(12);
    setInterval(0.15);
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
                reader.onload = (ev) => setLogo(ev.target?.result as string);
                reader.readAsDataURL(file);
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
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {isGenerating ? 'Menghasilkan...' : 'Generate GIF'}
          </button>
          <button
            onClick={resetAll}
            className="bg-gray-200 px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-300"
          >
            <RefreshCw size={16} /> Reset
          </button>
        </div>

        {/* Preview GIF */}
        {gifs.length > 0 && (
          <div className="text-center space-y-4">
            <h4 className="font-semibold">Hasil GIF:</h4>
            {gifs.map((gif, i) => (
              <div key={i}>
                <img src={gif.url} alt={`GIF ${i}`} className="mx-auto" />
                <a
                  href={gif.url}
                  download={`animated-logo-${i + 1}.gif`}
                  className="mt-2 inline-flex items-center gap-1 text-blue-600 hover:underline"
                >
                  <Download size={16} />
                  Download GIF
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
