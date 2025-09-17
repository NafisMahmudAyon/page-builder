'use client'
import { motion } from 'framer-motion'
import { forwardRef } from 'react'
import { cn } from '../../utils/cn'

export const ModalOverlayComponent = forwardRef(
  ({ children, className, ...props }, ref) => {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        {...props}
        className={cn(
          'fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black/80',
          className
        )}
        ref={ref}
      >
        {children}
      </motion.div>
    )
  }
)

ModalOverlayComponent.displayName = 'ModalOverlay'

export const ModalOverlay = ModalOverlayComponent
