import { MessageCircle } from 'lucide-react'

const VARIANTS = {
  primary: 'bg-charcoal-deep text-white hover:bg-charcoal-text',
  secondary: 'bg-white border border-charcoal-deep text-charcoal-deep hover:bg-cream-soft',
  ghost: 'bg-transparent text-charcoal-deep hover:bg-cream-light',
  whatsapp: 'bg-whatsapp text-white hover:brightness-95',
}

export default function Button({
  as = 'button',
  variant = 'primary',
  size = 'md',
  icon = false,
  className = '',
  children,
  ...props
}) {
  const Component = as
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  }

  return (
    <Component
      className={`focus-ring inline-flex items-center justify-center gap-2 rounded font-body font-medium tracking-wide transition-colors duration-200 ${VARIANTS[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && <MessageCircle size={18} strokeWidth={2} />}
      {children}
    </Component>
  )
}
