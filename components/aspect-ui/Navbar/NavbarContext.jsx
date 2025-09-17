'use client'
import React, { createContext, useContext, useState } from 'react'

const NavbarContext = createContext(undefined)

export const NavbarProvider = ({ children, collapseBreakpoint = 'md' }) => {
  const [isCollapsed, setIsCollapsed] = useState(true)

  const toggleCollapse = () => setIsCollapsed(prev => !prev)

  return (
    <NavbarContext.Provider
      value={{ isCollapsed, toggleCollapse, collapseBreakpoint }}
    >
      {children}
    </NavbarContext.Provider>
  )
}

export const useNavbar = () => {
  const context = useContext(NavbarContext)
  if (context === undefined) {
    throw new Error('useNavbar must be used within a NavbarProvider')
  }
  return context
}
