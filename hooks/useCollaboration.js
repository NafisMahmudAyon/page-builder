import { useEffect, useState, useRef, useCallback } from "react";
import io from "socket.io-client";

export const useCollaboration = (pageId, userId, userToken) => {
	const [socket, setSocket] = useState(null);
	const [activeUsers, setActiveUsers] = useState([]);
	const [pageState, setPageState] = useState({ blocks: [], version: 0 });
	const [selectedBlocks, setSelectedBlocks] = useState(new Map());
	const [cursors, setCursors] = useState(new Map());
	const [isConnected, setIsConnected] = useState(false);

	const lastUpdateRef = useRef(0);
	const pendingUpdatesRef = useRef([]);

	useEffect(() => {
		// if (!pageId || !userToken) return;

    

		// Initialize socket connection
		const newSocket = io(
			process.env.REACT_APP_WEBSOCKET_URL || "http://localhost:5000",
			{
				auth: { token: userToken },
			}
		);

		newSocket.on("connect", () => {
			console.log("Connected to collaboration server");
			setIsConnected(true);
			newSocket.emit("join-page", pageId);
		});

		newSocket.on("disconnect", () => {
			setIsConnected(false);
		});

		// Handle incoming updates
		newSocket.on("page-updated", (data) => {
			const { blocks, userId: senderId, version } = data;

			// Avoid processing our own updates
			if (senderId !== userId && version > lastUpdateRef.current) {
				setPageState((prev) => ({
					blocks,
					version,
					lastModifiedBy: data.userName,
				}));
				lastUpdateRef.current = version;
			}
		});

		newSocket.on("page-state-sync", (state) => {
			setPageState(state);
			lastUpdateRef.current = state.version;
		});

		newSocket.on("users-updated", (users) => {
			setActiveUsers(users);
		});

		newSocket.on("block-selection-changed", (data) => {
			const { blockId, userId: senderId, action } = data;

			setSelectedBlocks((prev) => {
				const updated = new Map(prev);
				if (action === "select") {
					updated.set(blockId, senderId);
				} else {
					updated.delete(blockId);
				}
				return updated;
			});
		});

		newSocket.on("cursor-updated", (data) => {
			const { userId: senderId, x, y, userName } = data;
			setCursors((prev) => new Map(prev.set(senderId, { x, y, userName })));
		});

		newSocket.on("text-changed", (data) => {
			const { blockId, content, userId: senderId } = data;
			// Handle real-time text updates
			setPageState((prev) => ({
				...prev,
				blocks: prev.blocks.map((block) =>
					updateBlockContent(block, blockId, content)
				),
			}));
		});

		setSocket(newSocket);

		return () => {
			newSocket.disconnect();
		};
	}, [pageId, userToken, userId]);

	const updateBlockContent = (block, targetId, content) => {
		if (block.id === targetId) {
			return { ...block, content };
		}
		if (block.children) {
			return {
				...block,
				children: block.children.map((child) =>
					updateBlockContent(child, targetId, content)
				),
			};
		}
		return block;
	};

	const emitPageUpdate = useCallback(
		(blocks, operation, blockId = null) => {
			if (!socket || !isConnected) return;

			const updateData = {
				pageId,
				blocks,
				operation,
				blockId,
				userId,
				timestamp: Date.now(),
			};

			socket.emit("page-update", updateData);

			// Update local state immediately for responsiveness
			setPageState((prev) => ({
				blocks,
				version: prev.version + 1,
			}));
		},
		[socket, pageId, userId, isConnected]
	);

	const selectBlock = useCallback(
		(blockId) => {
			if (!socket) return;
			socket.emit("block-select", { pageId, blockId, action: "select" });
		},
		[socket, pageId]
	);

	const deselectBlock = useCallback(
		(blockId) => {
			if (!socket) return;
			socket.emit("block-select", { pageId, blockId, action: "deselect" });
		},
		[socket, pageId]
	);

	const updateCursor = useCallback(
		(x, y) => {
			if (!socket) return;
			socket.emit("cursor-move", { pageId, x, y });
		},
		[socket, pageId]
	);

	const emitTextEdit = useCallback(
		(blockId, content, caretPosition) => {
			if (!socket) return;
			socket.emit("text-edit", { pageId, blockId, content, caretPosition });
		},
		[socket, pageId]
	);

	return {
		pageState,
		activeUsers,
		selectedBlocks,
		cursors,
		isConnected,
		emitPageUpdate,
		selectBlock,
		deselectBlock,
		updateCursor,
		emitTextEdit,
	};
};
