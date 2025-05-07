"use server";

import { UsersImagesSelect } from "@/db/schema";
import { getMyLogo } from "@/services/get-my-logo";
import { Download, ImagePlus } from "lucide-react";
import Image from "next/image";
import { FormLandingPage } from "./forms/form-landing-page";
import { Button } from "./ui/button";
import Link from "next/link";

const LogoItem = ({ logo }: { logo: UsersImagesSelect }) => {
  return (
    <div className="flex flex-col items-center gap-3 p-4 bg-white rounded-xl shadow-lg transition-all hover:scale-105 hover:shadow-xl">
      <Image
        src={logo.image}
        width={224}
        height={224}
        alt={logo.name}
        className="rounded-lg object-cover"
      />
      <h3 className="font-semibold text-lg text-gray-800">{logo.name}</h3>
      <p className="text-center text-sm text-gray-600 line-clamp-2">{logo.description}</p>
      <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
        <a href={logo.image} download={`${logo.name}.png`} className="flex items-center gap-2">
          <Download className="size-5" /> Download
        </a>
      </Button>
    </div>
  );
};

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center mx-auto gap-6 py-24 text-center">
      <h2 className="font-bold text-3xl text-gray-800">You don&apos;t have any generated logo</h2>
      <ImagePlus className="size-24 sm:size-28 lg:size-40 text-gray-400" />
      <div className="space-y-3">
        <p className="text-gray-600">Generate your first logo now!</p>
        <FormLandingPage />
      </div>
    </div>
  );
};

export const LogoList = async () => {
  const logos = await getMyLogo();

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {logos.length !== 0 ? (
        <>
          <div className="flex justify-between items-center w-full mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Your Logos</h2>
            <Button asChild className="bg-gradient-to-r from-purple-500 to-pink-500 over:bg-green-700 text-white">
              <Link href="/create">Generate New Logo</Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6">
            {logos.map((logo) => (
              <LogoItem logo={logo} key={logo.id} />
            ))}
          </div>
        </>
      ) : (
        <EmptyState />
      )}
    </div>
  );
};
