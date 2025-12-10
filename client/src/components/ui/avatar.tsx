import * as React from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

const sizeMap: Record<NonNullable<AvatarProps["size"]>, string> = {
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-12 h-12 text-lg"
};

export function Avatar({
  className,
  children,
  size = "md",
  ...props
}: AvatarProps) {
  return (
    <div
      className={cn(
        "rounded-full bg-slate-200 text-slate-700 font-semibold flex items-center justify-center overflow-hidden",
        sizeMap[size],
        className
      )}
      {...props}>
      {children}
    </div>
  );
}

