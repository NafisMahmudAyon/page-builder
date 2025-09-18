'use client'

import React, { createContext, useContext, useState } from 'react'

const SidebarContext = createContext(undefined)

export const SidebarProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isOpen2, setIsOpen2] = useState(false)
  const id = 1

  const toggleSidebar = (id=1) => {
    if (id === 1) {
    setIsOpen(prev => !prev)
    } else {
    setIsOpen2(prev => !prev)
    }
  }
  const closeSidebar = () => setIsOpen(false)
  const closeSidebar2 = () => setIsOpen2(false)

  return (
    <SidebarContext.Provider value={{ isOpen, isOpen2, toggleSidebar, closeSidebar, closeSidebar2 }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}
