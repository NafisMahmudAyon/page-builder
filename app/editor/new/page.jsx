"use client";

import { LayoutPanelLeft, Settings } from "lucide-react";
import Script from "next/script";
import { Spinner } from "../../../components/aspect-ui";
import { SidebarToggleButton } from "../../../components/aspect-ui/Sidebar/SidebarToggleButton";
import LeftBar from "../../../components/LeftBar";
import MainContent from "../../../components/MainContent";
import OptionsPanel from "../../../components/OptionsPanel";
import useEditor from "../../../context/EditorContext";

export default function ClientPage() {
	const { setPageId, loading, connectedUsers, isSocketConnected, blocks } =
		useEditor();

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
			</div>

			{/* Tailwind Browser Support */}
			<Script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4" />
		</>
	);
}
