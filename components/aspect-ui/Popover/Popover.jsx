'use client'

import * as PopoverPrimitive from '@radix-ui/react-popover'
import { cn } from '../../utils/cn'

function Popover({ ...props }) {
  return <PopoverPrimitive.Root {...props} />
}

function PopoverAction({ className, outline = false, ...props }) {
  return (
    <PopoverPrimitive.Trigger
      className={cn(
        'focus:outline-hidden focus-visible:border-ring focus-visible:ring-border hover:bg-bg-light/60 inline-flex cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2 font-medium transition duration-200 ease-in-out focus-visible:ring-1',
        outline && 'border-border text-text bg-bg-light/30 border',
        className
      )}
      {...props}
    />
  )
}

function PopoverContent({
  className,
  align = 'center',
  sideOffset = 4,
  ...props
}) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'bg-bg origin-(--radix-popover-content-transform-origin) border-border outline-hidden z-50 w-72 rounded-md border p-4 shadow-md',
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}

function PopoverAnchor({ ...props }) {
  return <PopoverPrimitive.Anchor {...props} />
}

export { Popover, PopoverAction, PopoverAnchor, PopoverContent }
