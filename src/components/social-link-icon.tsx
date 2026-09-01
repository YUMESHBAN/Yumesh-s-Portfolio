import {
  Code2,
  Dribbble,
  Facebook,
  Github,
  Globe2,
  Instagram,
  Linkedin,
  Twitter,
  type LucideIcon,
  Youtube,
} from "lucide-react";

type SocialLinkIconProps = {
  label?: string;
  href?: string;
  size?: number;
  className?: string;
};

const platformIcons: Array<{ pattern: RegExp; icon: LucideIcon }> = [
  { pattern: /github/i, icon: Github },
  { pattern: /linkedin/i, icon: Linkedin },
  { pattern: /twitter|(^|\.)x\.com/i, icon: Twitter },
  { pattern: /instagram/i, icon: Instagram },
  { pattern: /facebook/i, icon: Facebook },
  { pattern: /youtube/i, icon: Youtube },
  { pattern: /dribbble/i, icon: Dribbble },
  { pattern: /dev\.to|stackoverflow|codepen|hashnode/i, icon: Code2 },
];

export function SocialLinkIcon({ label = "", href = "", size = 16, className }: SocialLinkIconProps) {
  const Icon = platformIcons.find((platform) => platform.pattern.test(`${label} ${href}`))?.icon ?? Globe2;

  return <Icon size={size} className={className} aria-hidden="true" />;
}
