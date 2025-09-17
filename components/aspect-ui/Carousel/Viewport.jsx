'use client'
import { forwardRef } from 'react'
import { useCarouselContext } from './CarouselContext'

export const CarouselViewport = forwardRef(({ children }, ref) => {
  const { emblaRef } = useCarouselContext()

  return (
    <div className={`overflow-hidden`} ref={ref || emblaRef}>
      {children}
    </div>
  )
})

CarouselViewport.displayName = 'CarouselViewport'
