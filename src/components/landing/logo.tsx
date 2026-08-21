import Link from "next/link";
import { NotebookIcon } from "@phosphor-icons/react/dist/ssr";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 font-semibold text-foreground"
    >
      <NotebookIcon size={22} weight="fill" className="text-primary" />
      <span className="text-lg tracking-tight">Docolab</span>
    </Link>
  );
}
