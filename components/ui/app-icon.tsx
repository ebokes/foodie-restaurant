import React from "react";
import * as LucideIcons from "lucide-react";
import { HelpCircle } from "lucide-react";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: keyof typeof LucideIcons;
  size?: number;
  color?: string;
  className?: string;
  strokeWidth?: number;
}

function Icon({
  name,
  size = 24,
  color = "currentColor",
  className = "",
  strokeWidth = 2,
  ...props
}: IconProps) {
  const IconComponent = (
    LucideIcons as unknown as Record<
      string,
      React.ComponentType<React.SVGProps<SVGSVGElement>>
    >
  )[name];

  if (!IconComponent) {
    return (
      <HelpCircle
        width={size}
        height={size}
        color="gray"
        strokeWidth={strokeWidth}
        className={className}
        {...props}
      />
    );
  }
  return (
    <IconComponent
      width={size}
      height={size}
      color={color}
      strokeWidth={strokeWidth}
      className={className}
      {...props}
    />
  );
}
export default Icon;
