'use client'

import { createContext, useContext } from 'react'

const DropdownContext = createContext(undefined)

export const DropdownProvider = ({ children, value }) => {
  return (
    <DropdownContext.Provider value={value}>
      {children}
    </DropdownContext.Provider>
  )
}

export const useDropdown = () => {
  const context = useContext(DropdownContext)
  if (context === undefined) {
    throw new Error('useDropdown must be used within a DropdownProvider')
  }
  return context
}
