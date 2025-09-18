"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io(
	process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000",
	{
		withCredentials: true,
	}
);

export default function EditorPage() {
	const [content, setContent] = useState("");
	const pageId = "page-123"; // Replace with actual page ID from DB / URL

	useEffect(() => {
		// Join editor room
		socket.emit("join-editor", pageId);

		// Receive updates from others
		socket.on("editor-update", ({ userId, content }) => {
			console.log("📥 Received update:", content);
			setContent(content);
		});

		// Cleanup
		return () => {
			socket.off("editor-update");
			socket.disconnect();
		};
	}, [pageId]);

	// Send updates when user types
	const handleChange = (e) => {
		const newContent = e.target.value;
		setContent(newContent);
		socket.emit("editor-update", { pageId, content: newContent });
	};

	return (
		<div className="p-6">
			<h1 className="text-xl font-semibold mb-4">Collaborative Editor</h1>
			<textarea
				value={content}
				onChange={handleChange}
				className="w-full h-96 border rounded p-3"
				placeholder="Start typing..."
			/>
		</div>
	);
}
