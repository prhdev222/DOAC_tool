import React from 'react'
import { clsx } from 'clsx'

const variants = {
  default: 'border-transparent bg-slate-900 text-slate-50',
  secondary: 'border-transparent bg-slate-100 text-slate-900',
  destructive: 'border-transparent bg-red-500 text-slate-50',
  outline: 'text-slate-950',
}

export function Badge({
  className,
  variant = 'default',
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { variant?: keyof typeof variants }) {
  return (
    <div
      className={clsx(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
