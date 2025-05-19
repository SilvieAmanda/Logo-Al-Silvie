"use server";

import { UsersImagesSelect } from "@/db/schema";
import { getMyLogo } from "@/services/get-my-logo";
import { Download, ImagePlus, Eye } from "lucide-react";
import Image from "next/image";
import { FormLandingPage } from "./forms/form-landing-page";
import { Button } from "./ui/button";
import Link from "next/link";

const LogoItem = ({ logo }: { logo: UsersImagesSelect }) => {
  return (
    <div className="relative group bg-white rounded-2xl shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer">
      <div className="relative h-56 w-full">
        <Image
          src={logo.image}
          alt={logo.name}
          fill
          className="object-cover rounded-t-2xl"
          sizes="(max-width: 768px) 100vw, 33vw"
          priority={false}
        />
        <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full opacity-90">
          Logo
        </div>
      </div>

      <div className="p-5 flex flex-col gap-2">
        <h3 className="text-xl font-semibold text-gray-900 truncate">{logo.name}</h3>
        <p className="text-gray-600 text-sm line-clamp-3">{logo.description || "No description available."}</p>
        <div className="mt-4 flex justify-between items-center gap-3">
          <Button asChild variant="outline" className="flex-1 flex justify-center gap-2">
            <a href={logo.image} download={`${logo.name}.png`} className="flex items-center">
              <Download className="w-5 h-5" /> Download
            </a>
          </Button>
          <Link
            href={`/logo/${logo.id}`}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
            aria-label={`View details for ${logo.name}`}
          >
            <Eye className="w-5 h-5" />
            Preview
          </Link>
        </div>
      </div>
    </div>
  );
};

const EmptyState = () => {
  return (
    <section className="flex flex-col items-center justify-center py-20 gap-8 text-center max-w-xl mx-auto">
      <ImagePlus className="w-24 h-24 text-gray-300" />
      <h2 className="text-3xl font-bold text-gray-800">No Logos Found</h2>
      <p className="text-gray-600 max-w-md">
        You haven&apos;t generated any logos yet. Start by creating your first logo below!
      </p>
      <FormLandingPage />
    </section>
  );
};

export const LogoList = async () => {
  const logos = await getMyLogo();

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      {logos.length > 0 ? (
        <>
          <header className="flex justify-between items-center mb-12">
            <h1 className="text-3xl font-extrabold text-gray-900">Your Logo Collection</h1>
            <Button asChild className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white shadow-lg hover:shadow-xl">
              <Link href="/create">Generate New Logo</Link>
            </Button>
          </header>

          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
            {logos.map((logo) => (
              <LogoItem key={logo.id} logo={logo} />
            ))}
          </section>
        </>
      ) : (
        <EmptyState />
      )}
    </main>
  );
};
