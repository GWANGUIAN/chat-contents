import type { ButtonHTMLAttributes } from 'react'
import './Button.css'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
}

export function Button({ variant = 'primary', className, ...rest }: ButtonProps) {
  const classes = ['cc-button', `cc-button--${variant}`, className].filter(Boolean).join(' ')
  return <button type="button" className={classes} {...rest} />
}
