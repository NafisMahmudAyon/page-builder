import DropDownData from '../../BuilderUI/DropDownData';
import useEditor from "../../../context/EditorContext";

export const Options = () => {
  const { selected, setSelected, blocks, setBlocks, onChangeUpdateBlockOptions } = useEditor();

  const handleOptionChange = (key, value) => {
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
  };

  return (
    <div>
      <DropDownData
        label="Tag Name"
        options={[
          { label: 'Div', value: 'div' },
          { label: 'Section', value: 'section' },
          { label: 'Article', value: 'article' },
          // { label: 'H4', value: 'h4' },
          // { label: 'H5', value: 'h5' },
          // { label: 'H6', value: 'h6' },
        ]}
        value={selected?.options?.block?.tagName || ''} // Accessing tagName correctly
        update={(value) => handleOptionChange('tagName', value)} // Passing tagName as key
      />
    </div>
  );
};
