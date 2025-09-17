'use client'
import { cn } from '../../utils/cn'

export const BreadcrumbItem = ({ children, className = '', ...rest }) => {
  return (
    <li className={cn('flex cursor-pointer items-center', className)} {...rest}>
      {children}
    </li>
  )
}

BreadcrumbItem.displayName = 'BreadcrumbItem'
