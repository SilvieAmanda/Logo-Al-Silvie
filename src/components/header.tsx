import Link from "next/link";
import Image from "next/image"; // Menggunakan next/image untuk gambar
import { Home, Image as ImageIcon } from "lucide-react"; // Ganti nama Image dari lucide-react agar tidak bentrok
import { ThemeToggle } from "./theme-toggle";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
export const Header = () => {
  return (
    <header className="sticky top-0 border-b border-foreground/10 bg-white shadow-md z-30">
      <nav className="flex max-w-7xl w-full mx-auto items-center justify-between h-16 px-6">
        {/* Riwayat Logo (Kiri) */}
        <SignedIn>
          <Button asChild variant="outline" className="flex items-center gap-2">
            <Link href="/dashboard" className="px-4 py-2 flex items-center gap-2">
              {/* Gunakan Image dari next/image untuk gambar logo */}
              <Image src="/logo.png" alt="Riwayat Logo" width={20} height={20} />
              <span>Riwayat Logo</span>
            </Link>
          </Button>
        </SignedIn>

        {/* Tengah (Kosong agar Home bisa ke kanan) */}
        <div className="flex-1" />

        {/* Home (Kanan) */}
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
              <Home className="h-5 w-5" />
              <span className="font-semibold">Home</span>
            </Button>
          </Link>

          {/* User Signed In */}
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>

          {/* User Signed Out */}
          <SignedOut>
            <Button asChild className="px-4 py-2 bg-blue-600 hover:bg-blue-800 text-white">
              <Link href="/auth/sign-in">Sign In</Link>
            </Button>
          </SignedOut>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
};
