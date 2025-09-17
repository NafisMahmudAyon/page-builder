'use client'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useCallback, useEffect, useState } from 'react'
import { cn } from '../../utils/cn'

const Toast = ({
  className = '',
  containerClassName = '',
  message,
  description,
  messageClassName = '',
  messageAreaClassName = '',
  descriptionClassName = '',
  type = 'info',
  duration = 3000,
  onClose,
  action,
  isNew = false,
  toastId
}) => {
  useEffect(() => {
    if (duration === Infinity) return

    const timer = setTimeout(() => {
      if (onClose) onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const handleClose = () => {
    if (onClose) onClose()
  }

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-success text-success-foreground'
      case 'error':
        return 'bg-error text-error-foreground'
      case 'warning':
        return 'bg-warning text-warning-foreground'
      default:
        return 'bg-bg text-text'
    }
  }

  return (
    <motion.div
      layoutId={toastId}
      layout
      initial={
        isNew
          ? {
              opacity: 0,
              x: 300,
              scale: 0.9
            }
          : false
      }
      animate={{
        opacity: 1,
        x: 0,
        scale: 1
      }}
      exit={{
        opacity: 0,
        x: 300,
        scale: 0.9
      }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0.0, 0.2, 1],
        layout: { duration: 0.2, ease: 'easeInOut' }
      }}
      className={cn(
        'w-[280px] rounded-md shadow-lg transition-colors',
        getBackgroundColor(),
        className
      )}
    >
      <div
        className={cn(
          'flex items-start justify-between p-4',
          containerClassName
        )}
      >
        <div className={messageAreaClassName}>
          <div className={cn('font-medium', messageClassName)}>{message}</div>
          {description && (
            <div
              className={cn(
                'text-text-muted mt-1 text-sm',
                descriptionClassName
              )}
            >
              {description}
            </div>
          )}
        </div>
        {action ? (
          <button
            onClick={action.onClick}
            className={cn(
              'ml-4 rounded-md px-2 py-1 text-sm font-medium',
              action.buttonClassName
            )}
          >
            {action.label}
          </button>
        ) : (
          <button
            onClick={handleClose}
            className='ml-4 text-lg font-bold opacity-60 hover:opacity-100'
            aria-label='Close'
          >
            &times;
          </button>
        )}
      </div>
    </motion.div>
  )
}

export const useToast = () => {
  const [toasts, setToasts] = useState([])

  const toast = useCallback(options => {
    const id =
      options.id ||
      `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newToast = {
      ...options,
      id,
      isNew: true,
      timestamp: Date.now()
    }

    setToasts(prev => {
      const updatedPrev = prev.map(toast => ({ ...toast, isNew: false }))
      return [newToast, ...updatedPrev]
    })

    setTimeout(() => {
      setToasts(prev =>
        prev.map(toast =>
          toast.id === id ? { ...toast, isNew: false } : toast
        )
      )
    }, 300)
  }, [])

  const removeToast = useCallback(id => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  async function promise(promise, options) {
    const loadingId = `loading-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    toast({
      id: loadingId,
      message: options.loading,
      description: options.loadingDescription,
      type: 'info',
      duration: Infinity
    })

    try {
      const result = await promise
      removeToast(loadingId)
      toast({
        message: options.success,
        description: options.successDescription,
        type: 'success'
      })
      return result
    } catch (error) {
      removeToast(loadingId)
      toast({
        message: options.error,
        description: options.errorDescription,
        type: 'error'
      })
      throw error
    }
  }

  const ToastContainer = ({ limit = 5 }) => (
    <div className='fixed bottom-4 right-4 z-[9999] flex flex-col-reverse gap-2'>
      <AnimatePresence>
        {toasts.slice(0, limit).map(toastItem => (
          <Toast
            key={toastItem.id}
            toastId={toastItem.id}
            {...toastItem}
            onClose={() => removeToast(toastItem.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  )

  return { toast, ToastContainer, promise }
}
