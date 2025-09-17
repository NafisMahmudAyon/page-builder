'use client'

import { createContext, useContext } from 'react'

const TableContext = createContext(undefined)

export const TableProvider = ({ children }) => {
  return <TableContext.Provider value={{}}>{children}</TableContext.Provider>
}

export const useTable = () => {
  const context = useContext(TableContext)
  if (context === undefined) {
    throw new Error('useTable must be used within a TableProvider')
  }
  return context
}
