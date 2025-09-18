"use client";
import { Grip, X } from "lucide-react";
import useEditor from "../context/EditorContext";
import { ReactSortable } from "react-sortablejs";

const parentSortableOptions = {
	animation: 150,
	fallbackOnBody: true,
	swapThreshold: 0.65,
	group: "parent-group",
};

const ListView = () => {
	const { blocks, handleBlockUpdate } = useEditor();
	const handleSortableUpdate = (newState) => {
		handleBlockUpdate(newState, null);
	};
	return (
		<div className="bg-primary-200 pr-1">
			<ReactSortable
				list={blocks}
				setList={handleSortableUpdate}
				{...parentSortableOptions}>
				{blocks.map((block) => (
					<BlockWrapper key={block.id} block={block} />
				))}
			</ReactSortable>
		</div>
	);
};

const BlockWrapper = ({ block }) => {
	const { selected, setSelected, setBlocks } = useEditor();
	const handleRemove = (block) => {
		if (block.type == "root") {
			return;
		}
		setBlocks((prevBlocks) => {
			const removeBlockRecursive = (blocks, blockId) => {
				return blocks
					.filter((b) => b.id !== blockId) // Remove the block if it's in this level
					.map((b) => ({
						...b,
						children: b.children
							? removeBlockRecursive(b.children, blockId)
							: [], // Recursively check children
					}));
			};

			return removeBlockRecursive(prevBlocks, block.id);
		});
	};
	return (
		<div className="relative pl-1 py-2 rounded w-full">
			<div
				className={`border-b border-b-primary-800 pl-2 pr-1 flex items-center justify-between text-primary-800 ${
					selected && block.id === selected.id
						? "bg-primary-500 text-white"
						: "bg-primary-300"
				}`}>
				<span
					className="cursor-pointer flex-1 py-1 flex items-center gap-1"
					onClick={() => setSelected(block)}>
					<Grip className="cursor-move" />
					{block.type.charAt(0).toUpperCase() + block.type.slice(1)} ID:{" "}
					{block.id}
				</span>
				<span
					onClick={() => {
						handleRemove(block);
					}}>
					<X className="size-4 hover:bg-red-500 cursor-pointer hover:text-white" />
				</span>
			</div>
			{(block.type === "container" || block.type === "root") && (
				<Container block={block} />
			)}
		</div>
	);
};

const childSortableOptions = {
	animation: 150,
	fallbackOnBody: true,
	dragoverBubble: true,
	swapThreshold: 0.65,
	group: "child-group",
};

const Container = ({ block }) => {
	const { handleBlockUpdate } = useEditor();
	return (
		<div className="pl-2">
			<ReactSortable
				list={block.children || []}
				setList={(newState) => handleBlockUpdate(newState, block.id)}
				{...childSortableOptions}>
				{block.children?.map((child) => (
					<BlockWrapper key={child.id} block={child} />
				))}
			</ReactSortable>
		</div>
	);
};


export default ListView;
