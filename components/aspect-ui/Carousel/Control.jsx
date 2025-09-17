'use client'
import { forwardRef } from 'react'
import { cn } from '../../utils/cn'

export const CarouselControl = forwardRef(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        {...props}
        className={cn(
          'absolute left-0 top-0 z-50 mt-[1.8rem] flex w-full items-center justify-between',
          className
        )}
        ref={ref}
      >
        {children}
      </div>
    )
  }
)

CarouselControl.displayName = 'CarouselControl'
