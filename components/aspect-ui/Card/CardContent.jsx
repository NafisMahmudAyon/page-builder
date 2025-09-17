import { cn } from '../../utils/cn'

export const CardContent = ({ children, className = '', ...rest }) => {
  return (
    <div className={cn('px-6', className)} {...rest}>
      {children}
    </div>
  )
}
