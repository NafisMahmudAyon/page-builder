import useEditor from "../../../context/EditorContext";
import DropDownData from "../../BuilderUI/DropDownData";

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
					{ label: "H1", value: "h1" },
					{ label: "H2", value: "h2" },
					{ label: "H3", value: "h3" },
					{ label: "H4", value: "h4" },
					{ label: "H5", value: "h5" },
					{ label: "H6", value: "h6" },
				]}
				value={selected?.options?.block?.tagName || ""} // Accessing tagName correctly
				update={(value) => handleOptionChange("tagName", value)} // Passing tagName as key
			/>
			{/* <TextEditor value={selected?.options?.block?.text || ''} onChange={(value) => handleOptionChange('text', value)} /> */}
			<textarea
				value={selected?.options?.block?.text || ""}
				onChange={(e) => handleOptionChange("text", e.target.value)}
				className="w-full border rounded p-1 border-dashed border-primary-200 text-primary-900 text-[11px] min-h-[100px]"
			/>
		</div>
	);
};
