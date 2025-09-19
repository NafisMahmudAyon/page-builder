"use client";

import useEditor from "../context/EditorContext";
import { Heading } from "./Blocks/Heading";
import { Image } from "./Blocks/Image";
import { Text } from "./Blocks/Text";
import Container from "./Container";
import { cn } from "./utils/cn";

const BlockWrapper = ({ block }) => {
	const {
		selected,
		setSelected,
		selectedType,
		setSelectedType,
		responsive,
		responsiveBlock,
		findBlockById,
	} = useEditor();
	return (
		<>
			{/* <CollaborationIndicators blockId={block.id} /> */}
			{block.type === "heading" && (
				<Heading
					tagName={block.options?.block?.tagName}
					onClick={() => {
						setSelected(block);
						setSelectedType(block.type);
					}}
					blockData={block}
					className={cn(
						selected &&
							block.id === selected.id &&
							"border border-border/30 border-dashed",
						responsive === "lg"
							? block.options?.block?.className
							: findBlockById(responsiveBlock, block.id)?.options?.block
									?.className
					)}>
					{block.type === "heading" && block.options?.block?.text}
				</Heading>
			)}
			{block.type === "image" && (
				<Image
					blockData={block}
					onClick={() => {
						setSelected(block);
						setSelectedType(block.type);
					}}
					className={`${
						selected &&
						block.id === selected.id &&
						"border border-border/30 border-dashed"
					}`}
				/>
			)}
			{block.type === "text" && (
				<Text
					onClick={() => {
						setSelected(block);
						setSelectedType(block.type);
					}}
					blockData={block}
					className={`${
						selected &&
						block.id === selected.id &&
						"border border-border/30 border-dashed"
					}`}>
					{block.options?.block?.text}
				</Text>
			)}
			{(block.type === "container" || block.type === "root") && (
				<Container block={block} />
			)}
		</>
	);
};

export default BlockWrapper;

