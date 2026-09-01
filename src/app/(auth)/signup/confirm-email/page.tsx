import { EnvelopeSimpleIcon } from "@phosphor-icons/react/dist/ssr";

export default function ConfirmEmailPage() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent">
        <EnvelopeSimpleIcon size={26} className="text-primary" />
      </div>
      <div>
        <h1 className="text-lg font-semibold text-foreground">
          Check your email
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          We&apos;ve sent a confirmation link to your email address. Click it to
          activate your account and log in.
        </p>
      </div>
    </div>
  );
}
