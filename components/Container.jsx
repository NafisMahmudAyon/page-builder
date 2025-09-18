"use client";

import useEditor from "../context/EditorContext";
import { cn } from "./utils/cn";
import { useState } from "react";
import BlockWrapper from "./BlockWrapper";
import { Container as ContainerBlock } from "./Blocks/Container";

const childSortableOptions = {
  animation: 150,
  fallbackOnBody: true,
  dragoverBubble: true,
  swapThreshold: 0.65,
  group: "child-group",
};

const Container = ({ block }) => {
  const { draggedTemplate, handleTemplateAdd, handleBlockUpdate, selected, setSelected, responsive, responsiveBlock, findBlockById } = useEditor();
  const [enter, setEnter] = useState(false);
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (draggedTemplate) {
      handleTemplateAdd(draggedTemplate, block.id); // Add a new block
    }
  };
  return (
    <ContainerBlock
      // onClick={() => setSelected(block)} 
      className={cn(selected && block.id === selected.id && "border border-border/30 border-dashed", responsive === 'lg' ? block.options?.block?.className : findBlockById(responsiveBlock, block.id)?.options?.block?.className,)} onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    // onMouseEnter={(e) => {
    //   // e.preventDefault();
    //   if (draggedTemplate) {
    //     setEnter(true)
    //   }
    // }
    // }
    //   onMouseLeave={(e) => { e.preventDefault(); setEnter(false) }}
    >
      {/* <ReactSortable
        list={block.children || []}
        setList={(newState) =>
          handleBlockUpdate(newState, block.id)
        }
        tag={"template"}
        className="block h-full"
        {...childSortableOptions}
      > */}
      {block.children?.map((child) => (
        <BlockWrapper key={child.id} block={child} />
      ))}
      {/* </ReactSortable> */}
      {block.children && (
        <div className="absolute bottom-0 left-0 w-full flex items-center justify-center text-center min-h-[10px] border border-transparent transition-colors duration-200 ease-in-out text-primary-800" onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}>+</div>
      )}
    </ContainerBlock>
  );
};

export default Container;
