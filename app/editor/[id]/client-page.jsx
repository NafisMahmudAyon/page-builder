"use client";

import { LayoutPanelLeft, Settings, Users, Wifi, WifiOff } from "lucide-react";
import Script from "next/script";
import { useEffect, useState } from "react";
import { Button, Spinner } from "../../../components/aspect-ui";
import { SidebarToggleButton } from "../../../components/aspect-ui/Sidebar/SidebarToggleButton";
import LeftBar from "../../../components/LeftBar";
import MainContent from "../../../components/MainContent";
import OptionsPanel from "../../../components/OptionsPanel";
import useEditor from "../../../context/EditorContext";
import { useCollaboration } from "../../../hooks/useCollaboration";

export default function ClientPage({ id }) {
	const pageId = id;
	const { setPageId, loading, connectedUsers, isSocketConnected, blocks } =
		useEditor();

	const [showCollaborators, setShowCollaborators] = useState(false);

	useEffect(() => {
		setPageId(pageId);
	}, [pageId, setPageId]);

	// Auto-save functionality (optional)
	useEffect(() => {
		if (!blocks || blocks.length === 0) return;

		const autoSaveTimer = setTimeout(() => {
			// You can implement auto-save here if needed
			console.log("Auto-save triggered");
		}, 5000); // Auto-save after 5 seconds of inactivity

		return () => clearTimeout(autoSaveTimer);
	}, [blocks]);

	const ConnectionStatus = () => (
		<div>
			{isSocketConnected ? (
				<>
					<Wifi className="w-4 h-4 text-green-500" />
				</>
			) : (
				<>
					<WifiOff className="w-4 h-4 text-red-500" />
				</>
			)}
		</div>
	);

	const CollaboratorsList = () => (
		<div
			className={`fixed bottom-4 left-4 z-100 bg-bg-dark border border-border rounded-lg shadow-lg p-3 min-w-48 transition-all duration-200 text-text ${
				showCollaborators ? "opacity-100 visible" : "opacity-0 invisible"
			}`}>
			<h3 className="font-medium text-text-muted mb-2">Active Collaborators</h3>
			{connectedUsers.length > 0 ? (
				<div className="space-y-2">
					{connectedUsers.map((user, index) => (
						<div key={user.id || index} className="flex items-center gap-2">
							<div className="w-2 h-2 bg-green-500 rounded-full"></div>
							<span className="text-sm text-text">
								{user.name || user.userId || `User ${index + 1}`}
							</span>
						</div>
					))}
				</div>
			) : (
				<p className="text-sm text-gray-500">You're working alone</p>
			)}
		</div>
	);

	const CollaboratorsButton = () => (
		<Button variant="outline"
			onClick={() => setShowCollaborators(!showCollaborators)}
			className={`fixed bottom-4 right-4 z-50 rounded-lg text-sm font-medium transition-colors ${
				connectedUsers.length > 0
					? "text-text"
					: "text-text-muted"
			}`}>
			<Users className="w-4 h-4" />
			<span>{connectedUsers.length}</span>
			<ConnectionStatus />
		</Button>
	);

	return (
		<>
			<div className="flex h-full justify-between relative">
				{loading && (
					<div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-bg-dark/50 z-50 backdrop-blur-sm">
						<div className="flex flex-col items-center gap-4">
							<Spinner className="w-8 h-8" />
							<span className="text-white font-medium">Loading editor...</span>
						</div>
					</div>
				)}
				{/* Connection Status Indicator */}
				{/* <ConnectionStatus /> */}
				{/* Collaborators Button */}
				<CollaboratorsButton />
				{/* Collaborators List */}
				<CollaboratorsList />
				{/* <CollaborationIndicators /> */}
				{/* Sidebar Toggle for Mobile */}
				<div className="lg:hidden">
					<SidebarToggleButton icon={<LayoutPanelLeft />} />
				</div>
				{/* Main Editor Layout */}
				<LeftBar />
				<MainContent />
				<OptionsPanel />
				{/* Options Panel Toggle for Mobile */}
				<div className="lg:hidden">
					<SidebarToggleButton id={2} icon={<Settings />} />
				</div>
				{/* Real-time Activity Indicator */}
				{isSocketConnected && connectedUsers.length > 1 && (
					<div className="fixed bottom-4 right-4 z-40 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
							<span className="text-sm text-blue-700 font-medium">
								Live collaboration active
							</span>
						</div>
					</div>
				)}
			</div>

			{/* Tailwind Browser Support */}
			<Script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4" />

			{/* Click outside to close collaborators list */}
			{showCollaborators && (
				<div
					className="fixed inset-0 z-30"
					onClick={() => setShowCollaborators(false)}
				/>
			)}
		</>
	);
}
