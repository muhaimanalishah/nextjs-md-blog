import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] gap-4">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
        404
      </h1>
      <p className="text-xl text-muted-foreground">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Button asChild className="mt-4">
        <Link href="/">Back Home</Link>
      </Button>
    </div>
  );
}
