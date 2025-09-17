import { cn } from '../../utils/cn'

export const DropdownList = ({ children, className = '', ...rest }) => {
  return (
    <div
      className={cn('border-border border-b py-1 last:border-b-0', className)}
      {...rest}
    >
      {children}
    </div>
  )
}
