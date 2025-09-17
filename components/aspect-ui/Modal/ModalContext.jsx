'use client'

import { createContext, useContext } from 'react'

const ModalContext = createContext(undefined)

export const ModalProvider = ({ children, value }) => {
  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
}

export const useModal = () => {
  const context = useContext(ModalContext)
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider')
  }
  return context
}
