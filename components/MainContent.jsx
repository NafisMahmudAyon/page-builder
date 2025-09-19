"use client";
import useEditor from "../context/EditorContext";
import BlockWrapper from "./BlockWrapper";

const parentSortableOptions = {
	animation: 150,
	fallbackOnBody: true,
	swapThreshold: 0.65,
	group: "parent-group",
};

const MainContent = () => {
	const { blocks, handleBlockUpdate, responsive } = useEditor();

	const handleSortableUpdate = (newState) => {
		handleBlockUpdate(newState, null);
	};

	return (
		<div className="flex-1 p-6 ">
			<div
				className={`bg-bg rounded-lg shadow-sm max-h-[calc(100vh-124px)] overflow-auto lite-scrollbar border border-border p-6 @container ${
					responsive === "sm" && "w-[27.5rem]"
				} ${responsive === "md" && "w-[768px]"} ${
					responsive === "lg" && "w-[1024px]"
				} ${responsive === "xl" && "w-full"} `}>
				{blocks.map((block) => (
					<BlockWrapper key={block.id} block={block} />
				))}
			</div>
		</div>
	);
};

export default MainContent;
