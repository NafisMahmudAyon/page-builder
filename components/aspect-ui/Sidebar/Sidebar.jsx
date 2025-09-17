'use client'

import React from 'react'
import { cn } from '../../utils/cn'
import { useSidebar } from './SidebarContext'

export const Sidebar = ({
  children,
  className = '',
  breakPoint = 'md',
  ...rest
}) => {
  const { isOpen } = useSidebar()

  const breakpointStyle = breakPoint => {
    switch (breakPoint) {
      case 'sm':
        return 'md:flex md:translate-x-0 md:relative'
      case 'md':
        return 'lg:flex lg:translate-x-0 lg:relative'
      case 'lg':
        return 'xl:flex xl:translate-x-0 xl:relative'
      case 'xl':
        return '2xl:flex 2xl:translate-x-0 2xl:relative'
      case '2xl':
        return ''
      case 'none':
        return 'flex !translate-x-0 relative'
      default:
        return 'lg:flex lg:translate-x-0 lg:relative'
    }
  }

  return (
    <aside
      className={cn(
        'bg-bg fixed left-0 top-0 z-40 h-screen w-64 flex-col p-5 transition-all duration-300 ease-in-out',
        breakpointStyle(breakPoint),
        isOpen ? 'translate-x-0' : '-translate-x-full',
        className
      )}
      {...rest}
    >
      {children}
    </aside>
  )
}
