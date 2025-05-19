import { cn } from "@/utils";
import { HTMLAttributes } from "react";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "line" | "circle" | "rectangle";
}

const Skeleton = ({ className, variant = "line", ...props }: SkeletonProps) => {
  const baseClasses = "animate-pulse bg-gray-200 dark:bg-gray-700";

  const variants = {
    line: "h-4 rounded-full",
    circle: "rounded-full aspect-square",
    rectangle: "rounded-md",
  };

  return (
    <div className={cn(baseClasses, variants[variant], className)} {...props} />
  );
};

// Compound component for different skeleton types
Skeleton.Line = (props: SkeletonProps) => (
  <Skeleton variant="line" {...props} />
);

Skeleton.Circle = (props: SkeletonProps) => (
  <Skeleton variant="circle" {...props} />
);

Skeleton.Rectangle = (props: SkeletonProps) => (
  <Skeleton variant="rectangle" {...props} />
);

export { Skeleton };

// Usage

// Basic line skeleton
{
  /* <Skeleton className="h-4 w-32" />

// Profile card skeleton
<div className="max-w-sm rounded-lg border p-4">
  <div className="flex items-center space-x-4">
    <Skeleton.Circle className="h-12 w-12" />
    <div className="space-y-2 flex-1">
      <Skeleton.Line className="h-4 w-3/4" />
      <Skeleton.Line className="h-4 w-1/2" />
    </div>
  </div>
  <div className="mt-4 space-y-2">
    <Skeleton.Rectangle className="h-20 w-full" />
    <Skeleton.Line className="h-4 w-32" />
  </div>
</div>

// Table row skeleton
<div className="space-y-2">
  {[...Array(5)].map((_, i) => (
    <Skeleton.Rectangle 
      key={i}
      className="h-12 w-full rounded-lg"
    />
  ))}
</div> */
}
