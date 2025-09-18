'use client'

import { Menu } from 'lucide-react'
import React from 'react'
import { cn } from '../../utils/cn'
import { Button } from '../Button'
import { useSidebar } from './SidebarContext'

export const SidebarToggleButton = ({
  className = '',
  variant = 'default',
  size = 'medium',
  icon = <Menu />,
  id=1,
  ...rest
}) => {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      onClick={()=>toggleSidebar(id)}
      className={cn(className)}
      variant={variant}
      size={size}
      icon={icon}
      {...rest}
    />
  )
}
