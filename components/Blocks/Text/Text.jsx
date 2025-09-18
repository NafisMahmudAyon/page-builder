'use client'
import { cn } from "../../utils/cn";
import useEditor from "../../../context/EditorContext";

export const Text = ({
	tagName = "p",
	children,
	className = "",
	blockData,
	preview = false,
	...rest
}) => {
	const {
		selected,
		setSelected,
		blocks,
		setBlocks,
		onChangeUpdateBlockOptions,
	} = useEditor();
	const TagName = tagName;

	return (
		<TagName
			className={cn(
				"text-primary-800 dark:text-primary-200",
				preview && blockData?.options?.block?.className,
				className
			)}
			{...rest}
			dangerouslySetInnerHTML={{
				__html: blockData?.options?.block?.text ?? "",
			}}></TagName>
	);
};
