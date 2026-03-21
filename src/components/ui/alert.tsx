import React from 'react'
import { clsx } from 'clsx'

export function Alert({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="alert"
      className={clsx(
        'relative w-full rounded-lg border border-slate-200 p-4',
        '[&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-slate-950',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function AlertTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h5 className={clsx('mb-1 font-medium leading-none tracking-tight', className)} {...props}>
      {children}
    </h5>
  )
}

export function AlertDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <div className={clsx('text-sm [&_p]:leading-relaxed', className)} {...props}>
      {children}
    </div>
  )
}
