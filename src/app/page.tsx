import { FormLandingPage } from "@/components/forms/form-landing-page";
import Image from "next/image";

export default function Home() {
  const arr = new Array(8).fill("");

  return (
    <main className="mx-auto w-full px-4 max-w-7xl py-16 flex flex-col items-center gap-4 text-center">
      <h1 className="text-5xl font-black text-primary drop-shadow-lg">AI Logo Generator</h1>
      <h3 className="text-3xl font-bold text-primary drop-shadow-md">Create your logo in minutes with AI!</h3>
      
      <div className="w-full max-w-md">
        <FormLandingPage />
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
        {arr.map((_, i) => (
          <div key={i} className="relative group">
            <div className="rounded-xl overflow-hidden shadow-lg transition-transform transform group-hover:scale-110 group-hover:rotate-2 group-hover:shadow-2xl border-4 border-white/30 animate-fade-in">
              <Image
                width={512}
                height={512}
                src={`/images/${i}.png`}
                className="size-40 sm:size-60 xl:size-72 rounded-xl object-cover"
                alt={`Logo ${i}`}
              />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
