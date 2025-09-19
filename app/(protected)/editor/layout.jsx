'use client'
import EditorLayout from "../../../components/EditorLayout";
import { SidebarProvider } from "../../../components/aspect-ui/Sidebar/SidebarContext";
import { EditorProvider } from "../../../context/EditorContext";

export default function Layout({ children }) {
	return (
		<EditorProvider>
			<SidebarProvider>
				<EditorLayout>{children}</EditorLayout>
			</SidebarProvider>
		</EditorProvider>
	);
}
