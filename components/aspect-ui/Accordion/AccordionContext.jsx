'use client'

import { createContext, useContext } from 'react'

const AccordionContext = createContext(undefined)

export const AccordionProvider = ({ children, value }) => {
  return (
    <AccordionContext.Provider value={value}>
      {children}
    </AccordionContext.Provider>
  )
}

export const useAccordion = () => {
  const context = useContext(AccordionContext)
  if (context === undefined) {
    throw new Error('useAccordion must be used within an AccordionProvider')
  }
  return context
}
