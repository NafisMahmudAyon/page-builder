'use client'

import { cn } from '../../utils/cn'

export const TableHeader = ({ children, className = '', ...rest }) => {
  return (
    <thead
      className={cn('[&_tr]:border-b-border [&_tr]:border-b', className)}
      {...rest}
    >
      {children}
    </thead>
  )
}
