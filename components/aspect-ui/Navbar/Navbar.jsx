'use client'
import React from 'react'
import { cn } from '../../utils/cn'
import { NavbarProvider } from './NavbarContext'

export const Navbar = ({
  children,
  className = '',
  collapseBreakpoint = 'md',
  ...rest
}) => {
  return (
    <NavbarProvider collapseBreakpoint={collapseBreakpoint}>
      <nav className={cn('bg-bg relative shadow-md', className)} {...rest}>
        {children}
      </nav>
    </NavbarProvider>
  )
}
