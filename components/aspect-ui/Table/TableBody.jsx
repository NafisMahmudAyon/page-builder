'use client'

import React, { ReactNode } from 'react'
import { cn } from '../../utils/cn'

export const TableBody = ({ children, className = '' }) => {
  return (
    <tbody className={cn('[&_tr:last-child]:border-0', className)}>
      {children}
    </tbody>
  )
}
