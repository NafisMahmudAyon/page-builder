'use client'
import useEmblaCarousel from 'embla-carousel-react'
import { forwardRef } from 'react'
import { cn } from '../../utils/cn'
import { CarouselContext } from './CarouselContext'
import { CarouselViewport } from './Viewport'

const Carousel = forwardRef(
  (
    { children, options, plugins, className, carouselViewportClasses, ...rest },
    ref
  ) => {
    const [emblaRef, emblaApi] = useEmblaCarousel(options, plugins)

    return (
      <div
        className={cn('relative w-full pb-[2.4rem]', className)}
        ref={ref}
        {...rest}
      >
        <CarouselContext.Provider value={{ emblaApi, emblaRef }}>
          <CarouselViewport className={carouselViewportClasses}>
            {children}
          </CarouselViewport>
        </CarouselContext.Provider>
      </div>
    )
  }
)

Carousel.displayName = 'Carousel'

export { Carousel }
