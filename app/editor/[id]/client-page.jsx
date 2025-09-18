"use client";

import { LayoutPanelLeft, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { SidebarToggleButton } from "../../../components/aspect-ui/Sidebar/SidebarToggleButton";
import LeftBar from "../../../components/LeftBar";
import MainContent from "../../../components/MainContent";
import OptionsPanel from "../../../components/OptionsPanel";
import useEditor from "../../../context/EditorContext";
import { DotLoader } from "../../../components/Loader";
import { Spinner } from "../../../components/aspect-ui";
import Script from "next/script";

let socket;

export default function ClientPage({ id }) {
	const [content, setContent] = useState("");
	const [connectedUsers, setConnectedUsers] = useState([]);
	const pageId = id;
	const { setPageId, loading } = useEditor();

	useEffect(() => {
		setPageId(pageId);
	}, [pageId]);

	useEffect(() => {
		// Connect with auth token
		console.log(localStorage.getItem("token"));
		const token = localStorage.getItem("token");
		console.log(token);
		socket = io(
			process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000",
			{
				withCredentials: true,
				auth: {
					token: token, // 👈 pass JWT
				},
			}
		);

		// Confirm connection
		socket.on("connection-confirmed", (data) => {
			console.log("✅ Connected as:", data);
		});

		// Join page
		socket.emit("join-page", { pageId, requestSync: true });

		// Initial page state sync
		socket.on("page-state-sync", (state) => {
			console.log("📥 Page state synced:", state);
			setContent(JSON.stringify(state.blocks, null, 2)); // for demo: show blocks as text
		});

		// Page updated by others
		socket.on("page-updated", (update) => {
			console.log("📥 Page updated:", update);
			setContent(JSON.stringify(update.blocks, null, 2));
		});

		// User list updates
		socket.on("users-updated", (users) => {
			console.log("👥 Active users:", users);
			setConnectedUsers(users);
		});

		// Saved confirmation
		socket.on("page-saved", (data) => {
			console.log("💾 Page saved:", data);
		});

		// Cleanup on unmount
		return () => {
			socket.emit("leave-page", pageId);
			socket.disconnect();
		};
	}, [pageId]);

	// Send updates when user types
	const handleChange = (e) => {
		const text = e.target.value;
		setContent(text);

		// for demo, treat text as a single "block"
		const blocks = [{ id: "block-1", type: "text", content: text }];

		socket.emit("page-update", {
			pageId,
			blocks,
			operation: "edit",
			blockId: "block-1",
			metadata: { field: "content" },
		});
	};

	return (
		<>
			<div className="flex h-full justify-between">
				{loading && (
					<div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-bg-dark/50 z-50 backdrop-blur-sm">
						<Spinner />
						Loading...
					</div>
				)}
				<div className="lg:hidden">
					<SidebarToggleButton icon={<LayoutPanelLeft />} />
				</div>
				<LeftBar />
				<MainContent />
				<OptionsPanel />
				<div className="lg:hidden">
					<SidebarToggleButton id={2} icon={<Settings />} />
				</div>
			</div>
			<Script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4" />
		</>
	);
}
