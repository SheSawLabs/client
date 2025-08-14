import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#0f5fda] text-white hover:bg-[#0f5fda]/90",
        outline:
          "border border-[#0f5fda] bg-[#0f5fda]/10 text-[#0f5fda] hover:bg-[#0f5fda]/20",
        disabled:
          "bg-gray-100 text-gray-400 cursor-not-allowed hover:bg-gray-100",
      },
      size: {
        sm: "h-7 px-2.5 py-2 text-xs",
        md: "h-10 px-3 py-2.5 text-sm",
        lg: "h-12 px-4 py-3 text-base",
        wide: "w-full h-12 px-4 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const effectiveVariant = disabled ? "disabled" : variant;

    return (
      <Comp
        className={cn(
          buttonVariants({ variant: effectiveVariant, size, className }),
        )}
        ref={ref}
        disabled={disabled}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
