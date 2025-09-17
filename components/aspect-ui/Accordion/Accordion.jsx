'use client'

import { useState } from 'react'
import { cn } from '../../utils/cn'
import { AccordionProvider } from './AccordionContext'

export const Accordion = ({
  children,
  iconEnabled = true,
  iconPosition = 'right',
  iconClassName = '',
  activeItem,
  activeIconClassName = '',
  activeIcon,
  inactiveIcon,
  multiple = false,
  className = '',
  labelClassName = '',
  activeLabelClassName = '',
  headerClassName = '',
  activeHeaderClassName = '',
  contentClassName = '',
  ...rest
}) => {
  const [openItems, setOpenItems] = useState(activeItem ?? [])

  const toggleItem = itemId => {
    setOpenItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId)
      } else {
        return multiple ? [...prev, itemId] : [itemId]
      }
    })
  }

  return (
    <AccordionProvider
      value={{
        openItems,
        toggleItem,
        iconEnabled,
        iconPosition,
        iconClassName,
        activeIconClassName,
        activeIcon,
        inactiveIcon,
        labelClassName,
        activeLabelClassName,
        headerClassName,
        activeHeaderClassName,
        contentClassName
      }}
    >
      <div className={cn('space-y-2', className)} {...rest}>
        {children}
      </div>
    </AccordionProvider>
  )
}
