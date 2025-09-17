'use client'

import React, { cloneElement, isValidElement } from 'react'
import { cn } from '../../utils/cn'
import { useAccordion } from './AccordionContext'

export const AccordionItem = ({
  children,
  id,
  disabled = false,
  className = '',
  ...rest
}) => {
  const { openItems, toggleItem } = useAccordion()
  const isOpen = openItems.includes(id)

  return (
    <div
      className={cn(
        'border-border overflow-hidden rounded-md border',
        disabled ? 'opacity-50' : '',
        className
      )}
      {...rest}
    >
      {React.Children.map(children, child => {
        if (isValidElement(child)) {
          const childProps = {
            isOpen,
            onToggle: disabled ? undefined : () => toggleItem(id),
            disabled
          }
          return cloneElement(child, childProps)
        }
        return child
      })}
    </div>
  )
}
