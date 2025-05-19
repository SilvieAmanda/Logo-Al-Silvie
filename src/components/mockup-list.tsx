"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Download } from "lucide-react";
import { Button } from "./ui/button";

interface Mockup {
  id: string;
  image: string;
  name: string;
}

export const MockupList = () => {
  const [mockups, setMockups] = useState<Mockup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/mockups")
      .then((res) => res.json())
      .then((data) => {
        setMockups(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!mockups.length) return <p className="text-center">No Mockup history yet.</p>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6">
      {mockups.map((mockup) => (
        <div key={mockup.id} className="bg-white rounded-lg p-4 shadow-md">
          <Image src={mockup.image} alt={mockup.name} width={224} height={224} className="rounded-md" />
          <p className="text-center font-semibold mt-2">{mockup.name}</p>
          <Button asChild className="w-full mt-2">
            <a href={mockup.image} download>
              <Download className="mr-2 size-5" />
              Download
            </a>
          </Button>
        </div>
      ))}
    </div>
  );
};
