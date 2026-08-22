import {
  SparkleIcon,
  CubeIcon,
  CloudIcon,
  TriangleIcon,
  ArrowsOutSimpleIcon,
} from "@phosphor-icons/react/dist/ssr";

const COMPANIES = [
  { name: "Northstar", icon: SparkleIcon },
  { name: "PixelForge", icon: CubeIcon },
  { name: "CloudLabs", icon: CloudIcon },
  { name: "Vertex", icon: TriangleIcon },
  { name: "Uplift", icon: ArrowsOutSimpleIcon },
];

export function SocialProof() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-8 lg:pb-20">
      <p className="text-center text-xs font-semibold tracking-widest text-muted-foreground">
        TRUSTED BY TEAMS AT
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-60 grayscale">
        {COMPANIES.map(({ name, icon: Icon }) => (
          <div
            key={name}
            className="flex items-center gap-2 text-muted-foreground"
          >
            <Icon size={16} />
            <span className="text-sm font-semibold tracking-wide">
              {name.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
