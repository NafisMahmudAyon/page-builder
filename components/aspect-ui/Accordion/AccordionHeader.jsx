'use client'

import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '../../utils/cn'
import { useAccordion } from './AccordionContext'

export const AccordionHeader = ({
  children,
  isOpen,
  onToggle,
  className = '',
  iconEnabled: headerIconEnabled,
  iconPosition: headerIconPosition,
  iconClassName: headerIconClassName,
  activeIconClassName: headerActiveIconClassName,
  activeIcon: headerActiveIcon,
  inactiveIcon: headerInactiveIcon,
  labelClassName: headerLabelClassName,
  activeLabelClassName: headerActiveLabelClassName,
  headerClassName: headerHeaderClassName,
  activeHeaderClassName: headerActiveHeaderClassName,
  disabled = false,
  tagName = 'h2',
  ...rest
}) => {
  const {
    iconEnabled: accordionIconEnabled,
    iconPosition: accordionIconPosition,
    iconClassName: accordionIconClassName,
    activeIconClassName: accordionActiveIconClassName,
    activeIcon: accordionActiveIcon,
    inactiveIcon: accordionInactiveIcon,
    labelClassName: accordionLabelClassName,
    activeLabelClassName: accordionActiveLabelClassName,
    headerClassName: accordionHeaderClassName,
    activeHeaderClassName: accordionActiveHeaderClassName
  } = useAccordion()
  const TagName = tagName
  const iconEnabled = headerIconEnabled ?? accordionIconEnabled
  const iconPosition = headerIconPosition ?? accordionIconPosition
  const iconClassName = headerIconClassName ?? accordionIconClassName
  const activeIconClassName =
    headerActiveIconClassName ?? accordionActiveIconClassName
  const activeIcon = headerActiveIcon ?? accordionActiveIcon ?? <ChevronUp />
  const inactiveIcon = headerInactiveIcon ?? accordionInactiveIcon ?? (
    <ChevronDown />
  )

  const icon = isOpen ? activeIcon : inactiveIcon
  const iconClass = cn(
    iconClassName,
    isOpen ? activeIconClassName : '',
    'transition-transform duration-300'
  )

  const labelClassName = headerLabelClassName ?? accordionLabelClassName
  const activeLabelClassName =
    headerActiveLabelClassName ?? accordionActiveLabelClassName
  const headerClassName = headerHeaderClassName ?? accordionHeaderClassName
  const activeHeaderClassName =
    headerActiveHeaderClassName ?? accordionActiveHeaderClassName

  const labelClass = cn(labelClassName, isOpen ? activeLabelClassName : '')
  const headerClass = cn(headerClassName, isOpen ? activeHeaderClassName : '')

  return (
    <TagName
      className={cn(
        'bg-bg text-text flex w-full cursor-pointer items-center justify-between p-4 text-left transition-all duration-150 ease-in-out',
        className,
        headerClass
      )}
      onClick={onToggle}
      disabled={disabled}
      {...rest}
    >
      {iconEnabled && iconPosition === 'left' && (
        <span className={cn('text-text-muted', iconClass)}>{icon}</span>
      )}
      <span className={`${labelClass} grow`}>{children}</span>
      {iconEnabled && iconPosition === 'right' && (
        <span className={cn('text-text-muted', iconClass)}>{icon}</span>
      )}
    </TagName>
  )
}
