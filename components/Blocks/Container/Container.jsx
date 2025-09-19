'use client'
import React from 'react'
import { cn } from '../../utils/cn'

export const Container = ({
	tagName: TagName = "div",
	children,
	className = "",
	preview = false,
	blockData,
	...rest
}) => {
	// const TagName = tagName; // "section"

	return (
		<TagName
			className={cn(
				!preview && "relative pb-6 mb-6 border border-dashed",
				className,
				preview && blockData?.options?.block?.className
			)}
			{...rest}>
			{children}
		</TagName>
	);
};
