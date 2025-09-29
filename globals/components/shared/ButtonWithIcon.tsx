"use client";

import { Button, buttonVariants } from "@/globals/components/shad-cn/button";
import { VariantProps } from "class-variance-authority";
import { IconType } from "react-icons/lib";
import { cn } from "@/globals/libs/shad-cn";

type Props = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    icon: IconType;
    iconPosition?: "left" | "right";
    iconSize?: number;
  };

const ButtonWithIcon = ({
  icon: Icon,
  children,
  iconPosition = "left",
  iconSize = 18,
  className,
  ...props
}: Props) => {
  return (
    <Button
      {...props}
      className={cn("flex items-center gap-2", className)}
    >
      {iconPosition === "left" && <Icon size={iconSize} />}
      {children}
      {iconPosition === "right" && <Icon size={iconSize} />}
    </Button>
  );
};

export default ButtonWithIcon;
