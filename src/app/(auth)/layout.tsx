import { Logo } from "@/components/landing/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-8 bg-background p-6">
      <Logo />
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
