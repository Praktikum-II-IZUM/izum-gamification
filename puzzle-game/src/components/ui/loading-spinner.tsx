import { cn } from "@/lib/utils"

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'
  color?: string
}

export function LoadingSpinner({
  className,
  size = 'md',
  color = 'text-primary',
  ...props
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-4',
  }

  return (
    <div 
      className={cn(
        'flex items-center justify-center',
        className
      )}
      role="status"
      aria-label="Loading..."
      {...props}
    >
      <div 
        className={cn(
          'animate-spin rounded-full border-t-transparent',
          sizeClasses[size],
          color
        )}
      />
    </div>
  )
}
