import type { ButtonHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import './IconButton.css'

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label': string
  variant?: 'primary' | 'secondary' | 'ghost'
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { variant = 'secondary', className, ...rest },
  ref,
) {
  const classes = ['cc-icon-button', `cc-icon-button--${variant}`, className]
    .filter(Boolean)
    .join(' ')
  return <button ref={ref} type="button" className={classes} {...rest} />
})
