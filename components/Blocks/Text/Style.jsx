import useEditor from "../../../context/EditorContext";
import TailwindInput from "../../TailwindInput";

export const Style = () => {
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
		<div>
			<TailwindInput
				label="Class"
				update={(e) => handleOptionChange("className", e)}
				val={selected?.options?.block?.className || ""}
			/>
		</div>
	);
};
