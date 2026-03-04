import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[70vh] flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
        404
      </h1>
      <p className="text-muted-foreground text-xl">
        Oops! The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Button asChild className="mt-4">
        <Link href="/">Back Home</Link>
      </Button>
    </div>
  );
}
