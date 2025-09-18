'use client'
import { createContext, useContext, useEffect, useState } from "react";
import { templates } from "./templates";
import { usePathname } from "next/navigation";


const EditorContext = createContext(null)

export const EditorProvider = ({
	children,
}) => {
	const path = usePathname();
	const [selected, setSelected] = useState(null);
	const [selectedType, setSelectedType] = useState(null);
	const elementTemplates = templates;
	const [page, setPage] = useState({});
	const [pageId, setPageId] = useState(null);
	const [name, setName] = useState("");
	const [slug, setSlug] = useState("");
	const [status, setStatus] = useState("");
	const [editorData, setEditorData] = useState({});
	const [fetchedData, setFetchedData] = useState([]);
	const [responsive, setResponsive] = useState("xl");
	const [blocks, setBlocks] = useState([
		{
			id: 1,
			type: "container",
			label: "Container-1",
			content: "New Container",
			children: [
				{
					id: 2,
					type: "container",
					label: "Container-2",
					content: "New Container",
					children: [
						{
							id: 3,
							type: "text",
							label: "text-1",
							content: "New Text Element",
							parent_id: 2,
							options: {
								block: {
									tagName: "p",
									className: "",
									text: "Dummy Text Content...",
								},
							},
						},
					],
					parent_id: 1,
					options: {
						block: {
							tagName: "div",
							className: "",
						},
					},
				},
			],
			parent_id: null,
			options: {
				block: {
					tagName: "div",
					className: "",
				},
			},
		},
	]);
	const [responsiveBlock, setResponsiveBlock] = useState(blocks);
	const [draggedTemplate, setDraggedTemplate] = useState(null);
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const updateClassNames = (blocks) => {
			return blocks.map((block) => {
				// Update className if it exists in block options
				if (block.options?.block?.className) {
					const updatedClassName = block.options.block.className
						.replace(/\bsm:/g, "@sm:")
						.replace(/\bmd:/g, "@md:")
						.replace(/\blg:/g, "@lg:")
						.replace(/\bxl:/g, "@xl:")
						.replace(/\b2xl:/g, "@2xl:")
						.replace(/\b3xl:/g, "@3xl:")
						.trim(); // Remove extra spaces if needed

					block = {
						...block,
						options: {
							...block.options,
							block: {
								...block.options.block,
								className: updatedClassName,
							},
						},
					};
				}

				// Recursively update child blocks
				if (block.children && block.children.length > 0) {
					return { ...block, children: updateClassNames(block.children) };
				}

				return block;
			});
		};
		setResponsiveBlock(updateClassNames(blocks));
	}, [responsive, blocks]);
	const findBlockById = (blocks, id) => {
		for (const block of blocks) {
			if (block.id === id) {
				return block;
			}
			if (block.children && block.children.length > 0) {
				const found = findBlockById(block.children, id);
				if (found) return found;
			}
		}
		return null;
	};

	const findAndRemoveItem = (blocks, id) => {
		let removedItem = null;

		const traverse = (items) =>
			items.reduce((result, item) => {
				if (item.id === id) {
					removedItem = { ...item };
				} else {
					const newItem = { ...item };
					if (newItem.children) {
						newItem.children = traverse(newItem.children);
					}
					result.push(newItem);
				}
				return result;
			}, []);

		return { newBlocks: traverse(blocks), removedItem };
	};
	const handleBlockUpdate = (updatedList, parentId = null) => {
		setBlocks((prevBlocks) => {
			let newBlocks = [...prevBlocks];
			updatedList = updatedList.map((item) => {
				// If the item exists elsewhere in the tree, remove it first
				const searchResult = findAndRemoveItem(newBlocks, item.id);

				if (searchResult.removedItem) {
					newBlocks = searchResult.newBlocks;
					// Preserve the original item's properties while updating parent_id
					return {
						...searchResult.removedItem,
						parent_id: parentId,
					};
				}

				// If the item wasn't found elsewhere, it's new to this location
				return {
					...item,
					parent_id: parentId,
				};
			});

			// If this is a top-level update, return the new list
			if (parentId === null) {
				return updatedList;
			}

			// Otherwise, find the parent container and update its children
			const updateChildren = (blocks) => {
				return blocks.map((block) => {
					if (block.id === parentId) {
						return { ...block, children: updatedList };
					}
					if (block.children) {
						return {
							...block,
							children: updateChildren(block.children),
						};
					}
					return block;
				});
			};

			return updateChildren(prevBlocks);
		});
	};

	const generateUniqueId = () => {
		const ids = [];
		const collectIds = (items) => {
			items.forEach((item) => {
				ids.push(item.id);
				if (item.children) collectIds(item.children);
			});
		};
		collectIds(blocks);
		return ids.length > 0 ? Math.max(...ids) + 1 : 1;
	};

	const handleTemplateAdd = (template, parentId = null) => {
		const newItem = {
			id: generateUniqueId(),
			type: template.type,
			content: template.content,
			parent_id: parentId,
			children: template.children ? [] : undefined,
			options: { ...template.options },
			label: template.label,
		};

		setBlocks((prevBlocks) => {
			const addToParent = (items) =>
				items.map((item) => {
					if (item.id === parentId) {
						return {
							...item,
							children: [...(item.children || []), newItem],
						};
					}
					if (item.children) {
						return { ...item, children: addToParent(item.children) };
					}
					return item;
				});

			return parentId === null
				? [...prevBlocks, newItem]
				: addToParent(prevBlocks);
		});

		// Automatically set the newly added block as selected
		setSelected(newItem);
	};

	// Recursive function to update a block or its children
	const onChangeUpdateBlockOptions = (blocks, blockId, key, value) => {
		return blocks.map((block) => {
			if (block.id === blockId) {
				// Update the block options
				return {
					...block,
					options: {
						...block.options,
						block: {
							...block.options.block,
							[key]: value,
						},
					},
				};
			}

			// If the block has children, recursively update them
			if (block.children && block.children.length > 0) {
				return {
					...block,
					children: onChangeUpdateBlockOptions(
						block.children,
						blockId,
						key,
						value
					),
				};
			}

			// Return the block unchanged if no match
			return block;
		});
	};

  const handleSave = async () => {
		try {
			const user = JSON.parse(localStorage.getItem("user"));
			console.log(user);
			const pageData = {
				name,
				slug,
				status : "draft",
				page_data: { blocks },
				user_id: user?.userId,
			};
		const pageId = path.split("/")[2];
			const endpoint = pageId === null ? "pages" : `pages/${pageId}`;
			const method = pageId === null ? "post" : "put";
			console.log(pageId)

			const response = await fetch(`http://localhost:5000/api/${endpoint}`, {
				method,
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
				body: JSON.stringify(pageData),
			});

			const result = await response.json();
			console.log(result)

			if (result.error) throw result.error;

			if (result.data) {
				setPageId(result.data.id);
			}
		} catch (error) {
			console.error("Error saving page:", error);
		}
	};

  useEffect(() => {
		const fetchPageData = async () => {
			setLoading(true)
			if (pageId) {
				console.log(pageId)
				const response = await fetch(`http://localhost:5000/api/pages/${pageId}`, {
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				});

				const data = await response.json();
				console.log(data)

				if (data.error) {
					console.error("Error fetching page:", data.error);
					return;
				}

				if (data) {
					setName(data.name);
					setSlug(data.slug);
					setStatus(data.status);
					if (data.page_data?.blocks) {
						setBlocks(data.page_data.blocks);
					}
				}
			}
			setLoading(false)
		};

		fetchPageData();
	}, [pageId]);



	return (
		<EditorContext.Provider
			value={{
				selected,
				setSelected,
				selectedType,
				setSelectedType,
				blocks,
				setBlocks,
				elementTemplates,
				draggedTemplate,
				setDraggedTemplate,
				handleBlockUpdate,
				handleTemplateAdd,
				onChangeUpdateBlockOptions,
				handleSave,
				name,
				setName,
				slug,
				setSlug,
				status,
				setStatus,
				pageId,
				setPageId,
				responsive,
				setResponsive,
				responsiveBlock,
				setResponsiveBlock,
				findBlockById,
				loading,
			}}>
			{children}
		</EditorContext.Provider>
	);
}

export default function useEditor() {
	const context = useContext(EditorContext);
	if (!context) {
		throw new Error("useEditor must be used within an EditorProvider");
	}
	return context;
}
