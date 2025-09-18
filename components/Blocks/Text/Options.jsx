import useEditor from "../../../context/EditorContext";
import DropDownData from "../../BuilderUI/DropDownData";
import TextEditor from "../../BuilderUI/TextEditor";

export const Options = () => {
	const {
		selected,
		setSelected,
		blocks,
		setBlocks,
		onChangeUpdateBlockOptions,
	} = useEditor();

	const handleOptionChange = (key, value) => {
		if (selected) {
			// Update the blocks state recursively
			const updatedBlocks = onChangeUpdateBlockOptions(
				blocks,
				selected.id,
				key,
				value
			);
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
	};

	return (
		<div className="space-y-3">
			<DropDownData
				label="Tag Name"
				options={[
					{ label: "P", value: "p" },
					{ label: "Span", value: "span" },
					{ label: "Div", value: "div" },
					{ label: "Caption", value: "caption" },
				]}
				value={selected?.options?.block?.tagName || ""} // Accessing tagName correctly
				update={(value) => handleOptionChange("tagName", value)} // Passing tagName as key
			/>
			<TextEditor
				value={selected?.options?.block?.text || ""}
				onChange={(value) => handleOptionChange("text", value)}
			/>
			{/* <textarea value={selected?.options?.block?.text || ''} onChange={(e) => handleOptionChange('text', e.target.value)} className='w-full border rounded p-1 border-dashed border-primary-200 text-primary-900 text-[11px] min-h-[100px]' /> */}
		</div>
	);
};
