import { cn } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-bold uppercase tracking-widest transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 font-display relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-2 border-primary text-primary hover:bg-primary hover:text-black hover:shadow-[0_0_30px_rgba(255,215,0,0.6)]",
        fill:
          "bg-primary text-black border-2 border-primary hover:bg-white hover:border-white hover:text-black hover:shadow-[0_0_30px_rgba(255,215,0,0.6)]",
        outline:
          "border-2 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/40",
      },
      size: {
        default: "h-14 px-8 py-4",
        sm: "h-10 px-6 text-xs",
        lg: "h-16 px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const PolygonButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, style, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        style={{
          clipPath: "polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)",
          ...style,
        }}
        {...props}
      />
    )
  }
)
PolygonButton.displayName = "PolygonButton"

export { buttonVariants, PolygonButton }

