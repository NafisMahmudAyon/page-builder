'use client'

import { cn } from '../../utils/cn'
import { TableProvider } from './TableContext'

export const Table = ({ children, className = '', ...rest }) => {
  return (
    <TableProvider>
      <div className='relative w-full overflow-auto'>
        <table className={cn('relative w-full', className)} {...rest}>
          {children}
        </table>
      </div>
    </TableProvider>
  )
}
