import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 font-semibold text-foreground"
    >
      <span className="text-lg tracking-tight">Docolab</span>
    </Link>
  );
}
