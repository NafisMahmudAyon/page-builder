// hooks/useCollaboration.js
"use client";
import { useCallback, useEffect, useState } from "react";
import useEditor from "../context/EditorContext";

export const useCollaboration = () => {
	const { connectedUsers, isSocketConnected, socket, blocks, pageId } =
		useEditor();

	const [recentActivity, setRecentActivity] = useState([]);
	const [isTyping, setIsTyping] = useState(new Map()); // userId -> isTyping
	const [cursors, setCursors] = useState(new Map()); // userId -> cursor position

	// Track typing indicators
	useEffect(() => {
		if (!socket) return;

		const handleTypingStart = (data) => {
			setIsTyping(
				(prev) =>
					new Map(
						prev.set(data.userId, {
							blockId: data.blockId,
							timestamp: Date.now(),
							user: data.user,
						})
					)
			);
		};

		const handleTypingStop = (data) => {
			setIsTyping((prev) => {
				const newMap = new Map(prev);
				newMap.delete(data.userId);
				return newMap;
			});
		};

		const handleCursorMove = (data) => {
			setCursors(
				(prev) =>
					new Map(
						prev.set(data.userId, {
							blockId: data.blockId,
							position: data.position,
							user: data.user,
							timestamp: Date.now(),
						})
					)
			);
		};

		socket.on("user-typing-start", handleTypingStart);
		socket.on("user-typing-stop", handleTypingStop);
		socket.on("cursor-moved", handleCursorMove);

		return () => {
			socket.off("user-typing-start", handleTypingStart);
			socket.off("user-typing-stop", handleTypingStop);
			socket.off("cursor-moved", handleCursorMove);
		};
	}, [socket]);

	// Clean up old typing indicators
	useEffect(() => {
		const interval = setInterval(() => {
			const now = Date.now();
			const timeout = 3000; // 3 seconds

			setIsTyping((prev) => {
				const newMap = new Map();
				for (const [userId, data] of prev.entries()) {
					if (now - data.timestamp < timeout) {
						newMap.set(userId, data);
					}
				}
				return newMap;
			});

			setCursors((prev) => {
				const newMap = new Map();
				for (const [userId, data] of prev.entries()) {
					if (now - data.timestamp < 10000) {
						// 10 seconds for cursors
						newMap.set(userId, data);
					}
				}
				return newMap;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	// Track page updates and add to activity log
	useEffect(() => {
		if (!socket) return;

		const handlePageUpdate = (update) => {
			setRecentActivity((prev) => {
				const newActivity = {
					id: Date.now(),
					type: update.operation || "update",
					blockId: update.blockId,
					userId: update.metadata?.userId,
					user: update.updatedBy?.user,
					timestamp: Date.now(),
					metadata: update.metadata,
				};

				return [newActivity, ...prev.slice(0, 19)]; // Keep last 20 activities
			});
		};

		socket.on("page-updated", handlePageUpdate);

		return () => {
			socket.off("page-updated", handlePageUpdate);
		};
	}, [socket]);

	// Emit typing indicators
	const emitTypingStart = useCallback(
		(blockId) => {
			if (socket && isSocketConnected) {
				socket.emit("typing-start", {
					pageId,
					blockId,
					user: JSON.parse(localStorage.getItem("user") || "{}"),
				});
			}
		},
		[socket, isSocketConnected, pageId]
	);

	const emitTypingStop = useCallback(
		(blockId) => {
			if (socket && isSocketConnected) {
				socket.emit("typing-stop", {
					pageId,
					blockId,
					user: JSON.parse(localStorage.getItem("user") || "{}"),
				});
			}
		},
		[socket, isSocketConnected, pageId]
	);

	const emitCursorMove = useCallback(
		(blockId, position) => {
			if (socket && isSocketConnected) {
				socket.emit("cursor-move", {
					pageId,
					blockId,
					position,
					user: JSON.parse(localStorage.getItem("user") || "{}"),
				});
			}
		},
		[socket, isSocketConnected, pageId]
	);

	// Get typing status for a specific block
	const getTypingUsersForBlock = useCallback(
		(blockId) => {
			const typingUsers = [];
			for (const [userId, data] of isTyping.entries()) {
				if (data.blockId === blockId) {
					typingUsers.push({
						userId,
						user: data.user,
						timestamp: data.timestamp,
					});
				}
			}
			return typingUsers;
		},
		[isTyping]
	);

	// Get cursors for a specific block
	const getCursorsForBlock = useCallback(
		(blockId) => {
			const blockCursors = [];
			for (const [userId, data] of cursors.entries()) {
				if (data.blockId === blockId) {
					blockCursors.push({
						userId,
						user: data.user,
						position: data.position,
						timestamp: data.timestamp,
					});
				}
			}
			return blockCursors;
		},
		[cursors]
	);

	// Format recent activity for display
	const getFormattedActivity = useCallback(() => {
		return recentActivity.slice(0, 10).map((activity) => {
			const timeAgo = formatTimeAgo(activity.timestamp);
			const userName =
				activity.user?.name ||
				activity.user?.username ||
				`User ${activity.userId}`;

			let action = "updated";
			switch (activity.type) {
				case "add":
					action = "added";
					break;
				case "delete":
					action = "deleted";
					break;
				case "reorder":
					action = "reordered";
					break;
				case "update":
					action = "updated";
					break;
			}

			return {
				...activity,
				displayText: `${userName} ${action} a block`,
				timeAgo,
			};
		});
	}, [recentActivity]);

	return {
		// Connection state
		connectedUsers,
		isSocketConnected,

		// Real-time indicators
		isTyping,
		cursors,
		recentActivity: getFormattedActivity(),

		// Helper functions
		getTypingUsersForBlock,
		getCursorsForBlock,

		// Emit functions
		emitTypingStart,
		emitTypingStop,
		emitCursorMove,

		// Stats
		collaboratorCount: connectedUsers.length,
		hasActiveCollaborators: connectedUsers.length > 1,
	};
};

// Helper function to format time ago
function formatTimeAgo(timestamp) {
	const now = Date.now();
	const diff = now - timestamp;

	if (diff < 1000) return "just now";
	if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
	if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
	if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
	return `${Math.floor(diff / 86400000)}d ago`;
}
