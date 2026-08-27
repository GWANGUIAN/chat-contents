import type { ButtonHTMLAttributes } from 'react'
import './IconButton.css'

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label': string
}

export function IconButton({ className, ...rest }: IconButtonProps) {
  const classes = ['cc-icon-button', className].filter(Boolean).join(' ')
  return <button type="button" className={classes} {...rest} />
}
