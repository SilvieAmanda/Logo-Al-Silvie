import { getMyLogo } from "@/services/get-my-logo";
import { notFound } from "next/navigation";
import { Download, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Props {
  params: Promise<{ id: string }>;  // params harus Promise
}

export default async function LogoDetailPage(props: Props) {
  const params = await props.params;  // await dulu
  const logoId = Number(params.id);

  if (isNaN(logoId)) return notFound();

  const logos = await getMyLogo();
  const logo = logos.find((l) => l.id === logoId);

  if (!logo) return notFound();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Link href="/dashboard" className="flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to My Logos
      </Link>

      <div className="bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col sm:flex-row gap-8 p-6">
        <div className="flex-1">
          <Image
            src={logo.image}
            alt={logo.name}
            width={600}
            height={600}
            className="rounded-lg object-contain w-full h-auto"
          />
        </div>

        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">{logo.name}</h1>
          <p className="text-gray-600">{logo.description || "No description provided."}</p>

          <Button asChild className="mt-4 bg-blue-600 text-white hover:bg-blue-700">
            <a href={logo.image} download={`${logo.name}.png`} className="flex items-center gap-2">
              <Download className="size-5" />
              Download Logo
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
