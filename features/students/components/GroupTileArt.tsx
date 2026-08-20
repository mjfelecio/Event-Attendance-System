import Image from "next/image";

import { GROUP_LOGO_BY_SLUG } from "@/features/students/constants/categories";

type Props = {
  slug: string;
  name: string;
  className?: string;
};

/** Up to two initials from a group's name: "Computer Studies" -> "CS". */
const initialsOf = (name: string) =>
  name
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("") || "?";

/**
 * A selection-board tile's artwork.
 *
 * Seeded departments and houses have a logo file; a group an operator adds in
 * Settings does not, and the `Group` table has no logo column. Rather than
 * render a broken `<Image>`, unknown slugs get an initials medallion.
 */
const GroupTileArt = ({ slug, name, className = "h-40 w-40" }: Props) => {
  const logo = GROUP_LOGO_BY_SLUG[slug];

  if (logo) {
    return (
      <div className={`relative ${className}`}>
        <Image
          src={logo}
          alt={`${name} logo`}
          fill
          sizes="10rem"
          className="object-contain"
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className={`flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 ${className}`}
    >
      <span className="text-4xl font-semibold tracking-tight text-slate-400">
        {initialsOf(name)}
      </span>
    </div>
  );
};

export default GroupTileArt;
