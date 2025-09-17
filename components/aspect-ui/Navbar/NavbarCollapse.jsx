'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { forwardRef } from 'react'
import { cn } from '../../utils/cn'
import { useNavbar } from './NavbarContext'

export const NavbarCollapseComponent = forwardRef(
  ({ children, className, ...rest }, ref) => {
    const { isCollapsed } = useNavbar()

    return (
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ y: '20px', opacity: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'anticipate' }}
            exit={{ opacity: 0, y: '20px' }}
            ref={ref}
            {...rest}
            className={cn(
              `bg-bg border-border absolute left-0 right-0 top-full z-[1000] rounded-md rounded-t-none border p-4 shadow-md ${
                isCollapsed ? 'hidden' : 'flex flex-col'
              }`,
              className
            )}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    )
  }
)

NavbarCollapseComponent.displayName = 'NavbarCollapse'

export const NavbarCollapse = NavbarCollapseComponent
