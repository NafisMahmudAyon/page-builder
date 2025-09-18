"use client";
import { useDebounce } from "../../../hooks/useDebounce";
import useEditor from "../../../context/editorContext";
import { cn } from "../../../utils/cn";

export const Heading = ({
	variant,
	tagName = "h2",
	children,
	className = "",
	blockData,
	...rest
}) => {
	const {
		selected,
		setSelected,
		blocks,
		setBlocks,
		onChangeUpdateBlockOptions,
	} = useEditor();
	const [isEditing, setIsEditing] = useState(false);
	const elementRef = useRef < HTMLElement > null;
	const [localText, setLocalText] = useState(
		selected?.options?.block?.text || ""
	);

	useEffect(() => {
		setLocalText(selected?.options?.block?.text || "");
	}, [selected?.options?.block?.text]);

	useEffect(() => {
		if (blockData && blockData.id === selected?.id) {
			setIsEditing(true);
		} else {
			setIsEditing(false);
		}
	}, [blockData, selected]);

	const debouncedHandleOptionChange = useDebounce((value) => {
		if (selected) {
			const updatedBlocks = onChangeUpdateBlockOptions(
				blocks,
				selected.id,
				"text",
				value
			);
			setBlocks(updatedBlocks);
			setSelected({
				...selected,
				options: {
					...selected.options,
					block: {
						...selected.options.block,
						text: value,
					},
				},
			});
		}
	}, 300);

	const handleInput = (e) => {
		const text = e.currentTarget.textContent || "";
		setLocalText(text);
		debouncedHandleOptionChange(text);
	};

	const handleBlur = () => {
		setIsEditing(false);
	};

	const handleFocus = () => {
		setIsEditing(true);
		// Set cursor to end of text when focusing
		if (elementRef.current) {
			const range = document.createRange();
			const selection = window.getSelection();
			range.selectNodeContents(elementRef.current);
			range.collapse(false);
			selection?.removeAllRanges();
			selection?.addRange(range);
		}
	};

	const TagName = tagName;

	const getStyles = () => {
		switch (variant ?? tagName) {
			case "h1":
				return "text-h1";
			case "h2":
				return "text-h2";
			case "h3":
				return "text-h3";
			case "h4":
				return "text-h4";
			case "h5":
				return "text-h5";
			case "h6":
				return "text-h6";
			case "display1":
				return "text-display1";
			case "display2":
				return "text-display2";
			default:
				return "";
		}
	};

	const styles = getStyles();

	return (
		<TagName
			// ref={elementRef}
			className={cn(
				"text-primary-800 dark:text-primary-200 h-max outline-none",
				styles,
				className,
				isEditing && "ring-2 ring-blue-500 ring-opacity-50"
			)}
			contentEditable
			suppressContentEditableWarning
			onInput={handleInput}
			onBlur={handleBlur}
			onFocus={handleFocus}
			{...rest}>
			{localText}
		</TagName>
	);
};
