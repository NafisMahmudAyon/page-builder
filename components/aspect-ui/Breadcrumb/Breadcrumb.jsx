'use client'
import { ChevronRight } from 'lucide-react'
import React, { Children } from 'react'
import { cn } from '../../utils/cn'

export const Breadcrumb = ({
  children,
  className = '',
  separator = <ChevronRight />,
  separatorClassName = '',
  ...rest
}) => {
  const childrenArray = Children.toArray(children)

  return (
    <ul
      className={cn(
        'text-muted flex flex-wrap items-center gap-1.5 break-words text-sm sm:gap-2.5',
        className
      )}
      {...rest}
    >
      {childrenArray.map((child, index) => (
        <React.Fragment key={index}>
          {child}
          {index < childrenArray.length - 1 && (
            <span className={cn('text-muted mx-2', separatorClassName)}>
              {separator}
            </span>
          )}
        </React.Fragment>
      ))}
    </ul>
  )
}

Breadcrumb.displayName = 'Breadcrumb'
