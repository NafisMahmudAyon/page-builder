'use client'
import { forwardRef } from 'react'
import { cn } from '../../utils/cn'

export const CarouselSlides = forwardRef(
  ({ children, className, ...props }, ref) => {
    return (
      <div {...props} className={cn('-ml-4 flex', className)} ref={ref}>
        {children}
      </div>
    )
  }
)

CarouselSlides.displayName = 'CarouselSlides'
