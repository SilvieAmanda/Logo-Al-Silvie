import Link from "next/link";
import { Home } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

export const Header = () => {
  return (
    <header className="sticky top-0 border-b bg-white shadow-md z-30">
      <nav className="flex max-w-7xl w-full mx-auto items-center justify-between h-16 px-6">
        <SignedIn>
          <Button asChild variant="outline">
            <Link href="/dashboard" className="flex items-center gap-2">
              <span>Riwayat Logo</span>
            </Link>
          </Button>
        </SignedIn>

        <div className="flex-1" />

        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" className="text-blue-600 hover:text-blue-800">
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Button>
          </Link>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>

          <SignedOut>
            <Button asChild className="bg-blue-600 hover:bg-blue-800 text-white">
              <Link href="/auth/sign-in">Sign In</Link>
            </Button>
          </SignedOut>

          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
};
