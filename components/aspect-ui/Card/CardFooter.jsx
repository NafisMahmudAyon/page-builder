import { cn } from '../../utils/cn'

export const CardFooter = ({ children, className = '', ...rest }) => {
  return (
    <div className={cn('flex items-center px-6', className)} {...rest}>
      {children}
    </div>
  )
}
