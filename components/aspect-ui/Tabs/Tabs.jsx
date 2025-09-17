'use client'

import { useState } from 'react'
import { TabsProvider } from './TabsContext'

export const Tabs = ({ children, defaultActive, className, ...rest }) => {
  const [activeTab, setActiveTab] = useState(defaultActive)

  return (
    <TabsProvider value={{ activeTab, setActiveTab }}>
      <div className={className} {...rest}>
        {children}
      </div>
    </TabsProvider>
  )
}
