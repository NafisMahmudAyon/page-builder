'use client'
import useEditor from "../../context/editorContext";
import { useRef } from "react";

const ExpandingInput = () => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { selected, setSelected, blocks, setBlocks, onChangeUpdateBlockOptions } = useEditor();

  const handleOptionChange = (event, key, value) => {
    if (selected) {
      // Update the blocks state recursively
      const updatedBlocks = onChangeUpdateBlockOptions(blocks, selected.id, key, value);
      setBlocks(updatedBlocks);

      // Update the selected block state
      setSelected({
        ...selected,
        options: {
          ...selected.options,
          block: {
            ...selected.options.block,
            [key]: value,
          },
        },
      });
    }
    event.target.style.height = "auto";
    event.target.style.height = `${event.target.scrollHeight}px`;
  };

  return (
    <textarea
      ref={inputRef}
      value={selected?.options?.block?.text || ""}
      onChange={(event)=>handleOptionChange(event, 'text', event.target.value)}
      style={{
        width: "100%",
        // height: "max-content",
        whiteSpace: "pre-wrap",
        wordWrap: "break-word",
        overflow: "hidden",
        resize: "none",
      }}
    />
  );
};

export default ExpandingInput;
