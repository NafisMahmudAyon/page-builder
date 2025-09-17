'use client'

import { forwardRef } from 'react'
import { cn } from '../../utils/cn'

export const Textarea = forwardRef(
  (
    {
      label,
      error,
      className = '',
      labelClassName = '',
      wrapperClassName = '',
      errorClassName = '',
      ...rest
    },
    ref
  ) => {
    return (
      <fieldset className={cn('mb-4', wrapperClassName)}>
        {label && (
          <label
            className={cn(
              'text-text mb-1 block text-sm font-medium',
              labelClassName
            )}
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`placeholder:text-text-muted shadow-xs selection:bg-primary selection:text-primary-foreground focus-visible:border-border focus:outline-hidden focus:ring-border w-full rounded-md border px-3 py-2 focus:ring-2 ${
            error ? 'border-error-500' : 'border-border'
          } ${className})`}
          {...rest}
        />
        {error && (
          <p className={cn('text-error-600 mt-1 text-xs', errorClassName)}>
            {error}
          </p>
        )}
      </fieldset>
    )
  }
)

Textarea.displayName = 'Textarea'
