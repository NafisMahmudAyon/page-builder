"use client";
import { usePathname } from "next/navigation";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { io } from "socket.io-client";
import { templates } from "./templates";
import { useToast } from "../components/aspect-ui";

const EditorContext = createContext(null);

let socket;

export const EditorProvider = ({ children }) => {
	const { toast, ToastContainer } = useToast();
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
	const [loading, setLoading] = useState(true);
	const [connectedUsers, setConnectedUsers] = useState([]);
	const [isSocketConnected, setIsSocketConnected] = useState(false);
	const [lastUpdateSource, setLastUpdateSource] = useState("local"); // 'local' or 'socket'

	// Socket connection setup
	useEffect(() => {
		if (!pageId) return;

		const token = localStorage.getItem("token");

		// Initialize socket connection
		socket = io(
			process.env.NEXT_PUBLIC_BACKEND_URL ||
				"https://page-builder-backend.onrender.com",
			{
				withCredentials: true,
				auth: {
					token: token,
				},
			}
		);

		// Connection events
		socket.on("connect", () => {
			console.log("✅ Socket connected");
			setIsSocketConnected(true);
		});

		socket.on("disconnect", () => {
			console.log("❌ Socket disconnected");
			setIsSocketConnected(false);
		});

		socket.on("connection-confirmed", (data) => {
			console.log("✅ Connected as:", data);
		});

		// Join the page room
		socket.emit("join-page", { pageId, requestSync: true });

		// Handle initial page state sync
		socket.on("page-state-sync", (state) => {
			console.log("📥 Page state synced:", state);
			if (state.blocks && Array.isArray(state.blocks)) {
				setLastUpdateSource("socket");
				setBlocks(state.blocks);
			}
		});

		// Handle real-time page updates from other users
		socket.on("page-updated", (update) => {
			console.log("📥 Page updated by another user:", update);
			if (update.blocks && Array.isArray(update.blocks)) {
				setLastUpdateSource("socket");
				setBlocks(update.blocks);
			}
		});

		// Handle connected users updates
		socket.on("users-updated", (users) => {
			console.log("👥 Active users:", users);
			setConnectedUsers(users);
		});

		// Handle save confirmations
		socket.on("page-saved", (data) => {
			console.log("💾 Page saved:", data);
		});

		// Cleanup on unmount
		return () => {
			if (socket) {
				socket.emit("leave-page", pageId);
				socket.disconnect();
			}
		};
	}, [pageId]);

	// Emit changes to other users when blocks update locally
	const emitBlocksUpdate = useCallback(
		(newBlocks, operation = "edit", blockId = null, metadata = {}) => {
			if (socket && isSocketConnected && lastUpdateSource === "local") {
				console.log("📤 Emitting page update:", { operation, blockId });
				socket.emit("page-update", {
					pageId,
					blocks: newBlocks,
					operation,
					blockId,
					metadata: {
						...metadata,
						timestamp: Date.now(),
						user: JSON.parse(localStorage.getItem("user") || "{}")?.userId,
					},
				});
			}
		},
		[pageId, isSocketConnected, lastUpdateSource]
	);

	// Enhanced setBlocks with socket integration
	const setBlocksWithSocket = useCallback(
		(newBlocks, operation = "edit", blockId = null, metadata = {}) => {
			setLastUpdateSource("local");
			setBlocks(newBlocks);

			// Emit to other users after a short delay to batch rapid changes
			setTimeout(() => {
				emitBlocksUpdate(newBlocks, operation, blockId, metadata);
			}, 100);
		},
		[emitBlocksUpdate]
	);

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
						.trim();

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
		setLastUpdateSource("local");
		setBlocks((prevBlocks) => {
			let newBlocks = [...prevBlocks];
			updatedList = updatedList.map((item) => {
				const searchResult = findAndRemoveItem(newBlocks, item.id);

				if (searchResult.removedItem) {
					newBlocks = searchResult.newBlocks;
					return {
						...searchResult.removedItem,
						parent_id: parentId,
					};
				}

				return {
					...item,
					parent_id: parentId,
				};
			});

			if (parentId === null) {
				// Emit the update for reordering at root level
				setTimeout(() => {
					emitBlocksUpdate(updatedList, "reorder", null, { parentId });
				}, 100);
				return updatedList;
			}

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

			const finalBlocks = updateChildren(prevBlocks);

			// Emit the update for reordering within container
			setTimeout(() => {
				emitBlocksUpdate(finalBlocks, "reorder", parentId, { parentId });
			}, 100);

			return finalBlocks;
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

		setLastUpdateSource("local");
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

			const newBlocks =
				parentId === null ? [...prevBlocks, newItem] : addToParent(prevBlocks);

			// Emit the addition
			setTimeout(() => {
				emitBlocksUpdate(newBlocks, "add", newItem.id, {
					parentId,
					template: template.type,
				});
			}, 100);

			return newBlocks;
		});

		setSelected(newItem);
	};

	const onChangeUpdateBlockOptions = (blocks, blockId, key, value) => {
		const updatedBlocks = blocks.map((block) => {
			if (block.id === blockId) {
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

			return block;
		});

		// Update local state and emit to other users
		setLastUpdateSource("local");
		setBlocks(updatedBlocks);

		setTimeout(() => {
			emitBlocksUpdate(updatedBlocks, "update", blockId, {
				field: key,
				value:
					typeof value === "string" ? value.substring(0, 100) + "..." : value, // Truncate for metadata
			});
		}, 100);

		return updatedBlocks;
	};

	const handleSave = async () => {
		try {
			const user = JSON.parse(localStorage.getItem("user"));
			const pageData = {
				name,
				slug,
				status: "draft",
				page_data: { blocks },
				user_id: user?.userId,
			};

			const currentPageId = path.split("/")[2];
			const endpoint =
				currentPageId === "new" ? "pages" : `pages/${currentPageId}`;
			const method = currentPageId === "new" ? "post" : "put";
			const url =
				process.env.NEXT_PUBLIC_BACKEND_URL ||
				"https://page-builder-backend.onrender.com";
			const response = await fetch(`${url}/api/${endpoint}`, {
				method,
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
				body: JSON.stringify(pageData),
			});

			const result = await response.json();

			if (result.error) throw result.error;

			if (result.data) {
				setPageId(result.data.id);
			}

			// Emit save event to notify other users
			if (socket && isSocketConnected) {
				socket.emit("page-save", {
					pageId: pageId || result.data?.id,
					blocks,
					metadata: {
						savedBy: user?.userId,
						timestamp: Date.now(),
					},
				});
			}

			toast({
				message: "Page saved successfully",
				type: "success",
			});
			console.log("✅ Page saved successfully");
		} catch (error) {
			console.error("❌ Error saving page:", error);
		}
	};

	useEffect(() => {
		const fetchPageData = async () => {
			setLoading(true);
			if (pageId && pageId !== "new") {
				try {
					const url =
						process.env.NEXT_PUBLIC_BACKEND_URL ||
						"https://page-builder-backend.onrender.com";
					const response = await fetch(`${url}/api/pages/${pageId}`, {
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${localStorage.getItem("token")}`,
						},
					});

					const data = await response.json();

					if (data.error) {
						console.error("Error fetching page:", data.error);
						return;
					}

					if (data) {
						setName(data.name);
						setSlug(data.slug);
						setStatus(data.status);
						if (data.page_data?.blocks) {
							setLastUpdateSource("socket"); // Prevent emitting when loading initial data
							setBlocks(data.page_data.blocks);
						}
					}
				} catch (error) {
					console.error("Error fetching page data:", error);
				}
			}
			setLoading(false);
		};

		fetchPageData();
	}, [pageId]);

	// Reset lastUpdateSource after socket updates are processed
	useEffect(() => {
		if (lastUpdateSource === "socket") {
			const timer = setTimeout(() => {
				setLastUpdateSource("local");
			}, 200);
			return () => clearTimeout(timer);
		}
	}, [lastUpdateSource]);

	return (
		<EditorContext.Provider
			value={{
				selected,
				setSelected,
				selectedType,
				setSelectedType,
				blocks,
				setBlocks: setBlocksWithSocket,
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
				// Socket-related states
				connectedUsers,
				isSocketConnected,
				socket,
			}}>
			{children}
			<ToastContainer />
		</EditorContext.Provider>
	);
};

export default function useEditor() {
	const context = useContext(EditorContext);
	if (!context) {
		throw new Error("useEditor must be used within an EditorProvider");
	}
	return context;
}
