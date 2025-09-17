'use client'

import { cn } from '../../utils/cn'
import { useTabs } from './TabsContext'

export const TabItem = ({
  children,
  id,
  disabled,
  className = '',
  activeClassName = '',
  disabledClassName = '',
  onClick,
  ...rest
}) => {
  const { activeTab, setActiveTab } = useTabs()

  return (
    <button
      className={cn(
        'whitespace-nowrap rounded-md border border-transparent px-3 py-1.5 text-sm font-medium',
        activeTab === id
          ? cn('bg-bg-light border-border', activeClassName)
          : disabled && cn('pointer-events-none opacity-50', disabledClassName),
        className
      )}
      onClick={() => {
        if (!disabled) {
          setActiveTab(id)
          onClick?.()
        }
      }}
      {...rest}
    >
      {children}
    </button>
  )
}
