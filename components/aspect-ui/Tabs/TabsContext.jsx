'use client'

import { createContext, useContext } from 'react'

const TabsContext = createContext(undefined)

export const TabsProvider = ({ children, value }) => {
  return <TabsContext.Provider value={value}>{children}</TabsContext.Provider>
}

export const useTabs = () => {
  const context = useContext(TabsContext)
  if (context === undefined) {
    throw new Error('useTabs must be used within a TabsProvider')
  }
  return context
}
