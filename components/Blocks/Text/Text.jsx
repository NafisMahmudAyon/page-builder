"use client";
import { cn } from "../../utils/cn";

export const Text = ({
	tagName = "p",
	children,
	className = "",
	blockData,
	preview = false,
	...rest
}) => {
	const TagName = tagName;

	return (
		<TagName
			className={cn(
				"",
				preview && blockData?.options?.block?.className,
				className
			)}
			{...rest}
			dangerouslySetInnerHTML={{
				__html: blockData?.options?.block?.text ?? "",
			}}></TagName>
	);
};
