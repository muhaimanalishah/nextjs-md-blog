import { Info, AlertTriangle, XCircle, Lightbulb } from "lucide-react";

type CalloutVariant = "info" | "warning" | "danger" | "tip";

interface CalloutProps {
  variant?: CalloutVariant;
  title?: string;
  children: React.ReactNode;
}

const config: Record<
  CalloutVariant,
  {
    icon: React.ComponentType<{ className?: string }>;
    iconClass: string;
    titleClass: string;
  }
> = {
  info: { icon: Info, iconClass: "text-blue-500", titleClass: "text-blue-500" },
  warning: {
    icon: AlertTriangle,
    iconClass: "text-amber-500",
    titleClass: "text-amber-500",
  },
  danger: {
    icon: XCircle,
    iconClass: "text-red-500",
    titleClass: "text-red-500",
  },
  tip: {
    icon: Lightbulb,
    iconClass: "text-green-500",
    titleClass: "text-green-500",
  },
};

export function Callout({ variant = "info", title, children }: CalloutProps) {
  const { icon: Icon, iconClass, titleClass } = config[variant];

  return (
    <div className="border-border bg-muted/40 my-6 border px-5 pb-2">
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 shrink-0 ${iconClass}`} />
        {title && (
          <p
            className={`font-sans text-[11px] font-bold tracking-widest uppercase ${titleClass}`}
          >
            {title}
          </p>
        )}
      </div>
      <div className="text-muted-foreground text-sm leading-relaxed [&>p]:m-0">
        {children}
      </div>
    </div>
  );
}
