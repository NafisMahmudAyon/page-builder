'use client'
import {
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useState
} from 'react'

export const useDotButton = emblaApi => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState([])

  const onDotButtonClick = useCallback(
    index => {
      if (!emblaApi) return
      emblaApi.scrollTo(index)
    },
    [emblaApi]
  )

  const onInit = useCallback(emblaApi => {
    setScrollSnaps(emblaApi.scrollSnapList())
  }, [])

  const onSelect = useCallback(emblaApi => {
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    onInit(emblaApi)
    onSelect(emblaApi)
    emblaApi.on('reInit', onInit)
    emblaApi.on('reInit', onSelect)
    emblaApi.on('select', onSelect)
  }, [emblaApi, onInit, onSelect])

  return {
    selectedIndex,
    scrollSnaps,
    onDotButtonClick
  }
}

export const DotButton = forwardRef(
  ({ children, asChild, className, ...props }, ref) => {
    if (asChild && isValidElement(children)) {
      return cloneElement(children, {
        itemRef: ref,
        ...props
      })
    }

    return (
      <button ref={ref} type='button' {...props} className={`${className}`}>
        {children}
      </button>
    )
  }
)

DotButton.displayName = 'DotButton'
