'use client'
import React from 'react'
import { cn } from '../../utils/cn'
import useEditor from '../../../context/EditorContext'

export const Container = ({
  tagName = "div",
  children,
  className = '',
  preview = false,
  blockData,
  ...rest
}) => {
  const TagName = tagName

  const { responsive, responsiveBlock, findBlockById } = useEditor();

  return (
    <TagName
      className={cn(!preview && "relative pb-6 mb-6 border border-dashed", className, preview && blockData?.options?.block?.className)}
      {...rest}
    >
      {children}
    </TagName>
  )
}
