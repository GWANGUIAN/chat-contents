import type { InputHTMLAttributes } from 'react'
import './TextInput.css'

export type TextInputProps = InputHTMLAttributes<HTMLInputElement>

export function TextInput({ className, ...rest }: TextInputProps) {
  const classes = ['cc-text-input', className].filter(Boolean).join(' ')
  return <input className={classes} {...rest} />
}
