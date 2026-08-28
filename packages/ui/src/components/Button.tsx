import type { ButtonHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import './Button.css'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', className, ...rest },
  ref,
) {
  const classes = ['cc-button', `cc-button--${variant}`, className].filter(Boolean).join(' ')
  return <button ref={ref} type="button" className={classes} {...rest} />
})
