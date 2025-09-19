import Popover from "./Popover";
import { useEffect, useRef, useState } from "react";
import { tailwindCSS } from "./tailwindClasses";


const TailwindInput = ({
	update,
	val,
	label = "Add Classes",
}) => {
	const [inputValue, setInputValue] = useState(val || "");
	const [suggestions, setSuggestions] = useState([]);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);

	const inputRef = useRef(null);
	const activeSuggestionRef = useRef(null);
	// const containerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		setInputValue(val);
	}, [val]);

	const tailwindClasses = tailwindCSS;

	// Debounce mechanism
	const debounce = (func, delay) => {
	let timer;
	return (...args) => {
		clearTimeout(timer);
		timer = setTimeout(() => func(...args), delay);
	};
};


	const debounceFilterSuggestions = debounce((value) => {
		const currentWord = value.split(" ").pop()?.trim(); // Get the last word
		if (!currentWord) {
			setSuggestions([]);
			setShowSuggestions(false);
			return;
		}

		let filtered = [];
		if (currentWord.includes(":")) {
			// Handle modifier filtering
			const [modifier, rest] = currentWord.split(":");
			const prefix = `${modifier}:`;
			filtered =
				rest?.length > 0
					? tailwindClasses
						.filter((className) =>
							className.toLowerCase().startsWith(rest.toLowerCase())
						)
						.map((className) => `${prefix}${className}`)
					: tailwindClasses.map((className) => `${prefix}${className}`);
		} else if (/^[a-z]+$/i.test(currentWord)) {
			// Handle shorthand matching
			const pattern = currentWord.toLowerCase();
			filtered = tailwindClasses.filter((className) => {
				const words = className.split("-");
				return pattern.split("").every((char, index) => {
					return words[index] && words[index].startsWith(char);
				});
			});
		} else {
			// Handle substring matching
			const pattern = currentWord.toLowerCase();
			filtered = tailwindClasses.filter((className) =>
				className.toLowerCase().includes(pattern)
			);
		}

		// Keep suggestions visible even if no matches
		if (filtered.length === 0) {
			filtered = tailwindClasses.filter((className) =>
				className.toLowerCase().includes(currentWord.toLowerCase())
			);
		}

		setSuggestions(filtered);
		setShowSuggestions(true); // Always show suggestions until space or clear
		setActiveSuggestionIndex(0);
	}, 300);

	const handleInputChange = (e) => {
		const value = e.target.value;
		setInputValue(value);
		update(value);
		debounceFilterSuggestions(value);
	};

	// Scroll active suggestion into view
	useEffect(() => {
		if (activeSuggestionRef.current) {
			activeSuggestionRef.current.scrollIntoView({
				behavior: "smooth",
				block: "nearest",
			});
		}
	}, [activeSuggestionIndex]);

	const handleKeyDown = (e) => {
		if (e.key === "ArrowDown") {
			setActiveSuggestionIndex((prevIndex) =>
				prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
			);
		} else if (e.key === "ArrowUp") {
			setActiveSuggestionIndex((prevIndex) =>
				prevIndex > 0 ? prevIndex - 1 : prevIndex
			);
		} else if (e.key === "Enter" && suggestions.length > 0) {
			e.preventDefault();
			selectSuggestion(suggestions[activeSuggestionIndex]);
		}
	};

	const selectSuggestion = (suggestion) => {
		const words = inputValue.split(" ");
		words.pop();
		const updatedValue = [...words, suggestion].join(" ").trim();
		setInputValue(updatedValue);
		update(updatedValue);
		setShowSuggestions(false);
		setActiveSuggestionIndex(0);
		inputRef.current?.focus();
	};

	const handleSuggestionClick = (suggestion) => {
		selectSuggestion(suggestion);
	};

	const handleBlur = (e) => {
		if (!e.relatedTarget || !(e.relatedTarget).closest("ul")) {
			setShowSuggestions(false);
		}
	};

	return (
		<div className="relative w-full" onBlur={handleBlur}>
			<label
				htmlFor="tailwind-input"
				className="text-[11px] text-primary-900 dark:text-primary-900">
				{label}
			</label>
			<Popover
				position="bottom"
				className="min-w-[120px] max-w-[220px] w-full"
				isOpen={showSuggestions}
				content={
					<ul
						id="suggestion-list"
						className="max-h-60 overflow-y-auto lite-scrollbar bg-bg text-text rounded shadow-md"
						role="listbox">
						{suggestions.map((suggestion, index) => (
							<li
								key={index}
								ref={index === activeSuggestionIndex ? activeSuggestionRef : null}
								onClick={() => handleSuggestionClick(suggestion)}
								className={`p-2 py-1.5 cursor-pointer text-[11px] mb-0.5 last:mb-0 ${index === activeSuggestionIndex
									? "bg-bg-light text-text"
									: "hover:bg-bg-light hover:text-text"
									}`}
								aria-selected={index === activeSuggestionIndex}
								role="option">
								{suggestion}
							</li>
						))}
						{showSuggestions && suggestions.length === 0 && (
							<div className="p-2 cursor-pointer text-[11px]">No Class Found</div>
						)}
					</ul>
				}
			>
				<textarea
					id="tailwind-input"
					ref={inputRef}
					value={inputValue}
					onChange={handleInputChange}
					onKeyDown={handleKeyDown}
					placeholder="Type Tailwind classes..."
					className="w-full h-max text-[11px] row-span-3 p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
					// aria-expanded={showSuggestions}
					aria-owns="suggestion-list"
				/>
			</Popover>
			{/* {showSuggestions && (
				
			)} */}
		</div>
	);
};

export default TailwindInput;
