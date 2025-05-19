'use client';

import { useEffect, useState } from 'react';

export default function GenerateGifPage() {
  const [gifshot, setGifshot] = useState<any>(null);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadGifshot = async () => {
      try {
        const mod = await import('gifshot');
        setGifshot(mod.default || mod); // handle default export
      } catch (error) {
        console.error('Gagal memuat gifshot:', error);
      }
    };

    loadGifshot();
  }, []);

  const generateGif = () => {
    if (!gifshot) return;

    setLoading(true);

    gifshot.createGIF(
      {
        images: [
          '/logo1.png',
          '/logo2.png',
          '/logo3.png',
        ],
        interval: 0.5,
        gifWidth: 300,
        gifHeight: 300,
        numFrames: 10,
        frameDuration: 1,
      },
      (obj: any) => {
        setLoading(false);
        if (!obj.error) {
          setGifUrl(obj.image);
        } else {
          console.error('Gagal membuat GIF:', obj.errorMsg);
        }
      }
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Generate Logo GIF</h1>

      <button
        onClick={generateGif}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        disabled={loading || !gifshot}
      >
        {loading ? 'Loading...' : 'Buat GIF'}
      </button>

      {gifUrl && (
        <div className="mt-6 text-center">
          <h2 className="mb-2 text-lg font-semibold">Preview GIF:</h2>
          <img src={gifUrl} alt="Generated GIF" className="rounded shadow-md" />
          <a
            href={gifUrl}
            download="logo.gif"
            className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Download GIF
          </a>
        </div>
      )}
    </div>
  );
}
