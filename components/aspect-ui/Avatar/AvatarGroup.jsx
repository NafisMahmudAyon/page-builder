'use client'

import React from 'react'
import { cn } from '../../utils/cn'
import { Avatar } from './Avatar'

export const AvatarGroup = ({ className = '', children, ...rest }) => {
  return (
    <div className={cn('flex items-center -space-x-2', className)} {...rest}>
      {!children ? (
        <>
          <Avatar />
          <Avatar />
        </>
      ) : (
        <>{children}</>
      )}
    </div>
  )
}
