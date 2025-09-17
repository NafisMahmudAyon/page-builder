import { cn } from '../../utils/cn'

export const CardTitle = ({ children, className = '', ...rest }) => {
  return (
    <h3 className={cn('font-semibold leading-none', className)} {...rest}>
      {children}
    </h3>
  )
}
