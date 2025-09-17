import { cn } from '../../utils/cn'

export const CardDescription = ({ children, className = '', ...rest }) => {
  return (
    <p className={cn('text-text-muted text-sm', className)} {...rest}>
      {children}
    </p>
  )
}
