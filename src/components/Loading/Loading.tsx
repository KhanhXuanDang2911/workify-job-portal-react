import { cn } from "@/lib/utils";

export type LoadingVariant = "spinner" | "dots" | "bars" | "pulse";
export type LoadingSize = "sm" | "md" | "lg";

interface LoadingProps {
  variant?: LoadingVariant;
  size?: LoadingSize;
  className?: string;
  overlay?: boolean;
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-8 h-8",
  lg: "w-12 h-12",
};

const dotSizeClasses = {
  sm: "w-2 h-2",
  md: "w-3 h-3",
  lg: "w-4 h-4",
};

const barSizeClasses = {
  sm: "w-1 h-4",
  md: "w-1.5 h-8",
  lg: "w-2 h-12",
};

const Spinner = ({ size = "md" }: { size: LoadingSize }) => (
  <div className={cn("relative", sizeClasses[size])}>
    <div className="absolute inset-0 rounded-full border-2 border-muted"></div>
    <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
  </div>
);

const Dots = ({ size = "md" }: { size: LoadingSize }) => (
  <div className="flex gap-1.5">
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className={cn(
          "rounded-full bg-primary animate-bounce",
          dotSizeClasses[size]
        )}
        style={{
          animationDelay: `${i * 0.15}s`,
        }}
      />
    ))}
  </div>
);

const Bars = ({ size = "md" }: { size: LoadingSize }) => (
  <div className="flex items-center gap-1">
    {[0, 1, 2, 3].map((i) => (
      <div
        key={i}
        className={cn(
          "rounded-full bg-primary animate-pulse",
          barSizeClasses[size]
        )}
        style={{
          animationDelay: `${i * 0.15}s`,
        }}
      />
    ))}
  </div>
);

const Pulse = ({ size = "md" }: { size: LoadingSize }) => (
  <div className={cn("relative", sizeClasses[size])}>
    <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75"></div>
    <div className="absolute inset-0 rounded-full bg-primary"></div>
  </div>
);

export const Loading = ({
  variant = "spinner",
  size = "md",
  className,
  overlay = false,
}: LoadingProps) => {
  const variantComponents = {
    spinner: <Spinner size={size} />,
    dots: <Dots size={size} />,
    bars: <Bars size={size} />,
    pulse: <Pulse size={size} />,
  };

  const content = (
    <div className={cn("flex items-center justify-center", className)}>
      {variantComponents[variant]}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
};

export default Loading;
