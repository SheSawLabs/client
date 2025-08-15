import { cn } from "@/utils/cn";
import { COLORS } from "@/constants";

interface TypographyProps {
  variant?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "p"
    | "blockquote"
    | "list"
    | "lead"
    | "large"
    | "small"
    | "muted"
    | "label";
  className?: string;
  children: React.ReactNode;
}

export function Typography({
  variant = "p",
  className,
  children,
  ...props
}: TypographyProps) {
  const variants = {
    h1: "font-bold leading-tight",
    h2: "text-xl font-semibold tracking-tight text-gray-900 leading-tight",
    h3: "text-lg font-semibold tracking-tight text-gray-900 leading-tight",
    h4: "text-base font-semibold tracking-tight text-gray-900 leading-tight",
    p: "text-base leading-relaxed text-gray-700 [&:not(:first-child)]:mt-4",
    blockquote: "mt-4 border-l-2 border-gray-300 pl-4 italic text-gray-600",
    list: "my-4 ml-4 list-disc text-gray-700 [&>li]:mt-1",
    lead: "text-lg text-gray-600 leading-relaxed",
    large: "text-lg font-medium text-gray-900",
    small: "text-sm font-medium leading-tight text-gray-600",
    muted: "text-sm text-gray-500 leading-tight",
    label: "text-xs font-normal",
  };

  const variantStyles = {
    h1: {
      fontSize: "32px",
      lineHeight: "36px",
      color: COLORS.GRAY_800,
      fontFamily: "Min Sans, -apple-system, BlinkMacSystemFont, sans-serif",
    },
    label: {
      fontSize: "12px",
      lineHeight: "140%",
      color: COLORS.GRAY_800,
    },
  };

  const Component =
    variant === "blockquote"
      ? "blockquote"
      : variant === "list"
        ? "ul"
        : variant === "label"
          ? "label"
          : variant.startsWith("h")
            ? (variant as keyof JSX.IntrinsicElements)
            : "p";

  const inlineStyle = variantStyles[variant as keyof typeof variantStyles];

  return (
    <Component
      className={cn(variants[variant], className)}
      style={inlineStyle}
      {...props}
    >
      {children}
    </Component>
  );
}
