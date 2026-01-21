import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-spotify-green text-black hover:bg-spotify-green/90 hover:scale-105",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        outline: "border-2 border-white/20 bg-transparent hover:bg-white/10 text-white backdrop-blur-sm",
        secondary: "bg-spotify-dark-gray text-white hover:bg-spotify-dark-gray/80",
        ghost: "hover:bg-white/10 text-white",
        link: "text-spotify-green underline-offset-4 hover:underline",
        play: "bg-spotify-green text-black hover:bg-spotify-green hover:scale-110 shadow-lg shadow-spotify-green/50",
      },
      size: {
        default: "h-11 px-6 py-3",
        sm: "h-9 rounded-full px-4",
        lg: "h-12 rounded-full px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }
