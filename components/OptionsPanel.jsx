"use client";
import { X } from "lucide-react";
import useEditor from "../context/EditorContext";
import { Sidebar, TabContent, TabItem, TabList, Tabs } from "./aspect-ui";
import { useSidebar } from "./aspect-ui/Sidebar/SidebarContext";
import { SidebarToggleButton } from "./aspect-ui/Sidebar/SidebarToggleButton";
import {
	Options as ContainerOptions,
	Style as ContainerStyle,
} from "./Blocks/Container";
import {
	Options as HeadingOptions,
	Style as HeadingStyle,
} from "./Blocks/Heading";
import { Style as ImageStyle } from "./Blocks/Image";
import { Options as TextOptions, Style as TextStyle } from "./Blocks/Text";
import { cn } from "./utils/cn";

const OptionsPanel = () => {
	const { selected, setSelected, selectedType, setSelectedType } = useEditor();
	console.log(selected);
const { isOpen2, closeSidebar2 } = useSidebar()
console.log(isOpen2)
	return (
		<div className="relative">
			<Sidebar
				className={cn(
					"fixed right-0 top-0 z-40 h-screen",
					isOpen2 ? "translate-x-0" : "translate-x-full"
				)}>
				<div className="lg:hidden" onClick={closeSidebar2}>
					<X />
				</div>
				{selected ? (
					<Tabs defaultActive="item-1">
						<TabList>
							<TabItem id="item-1">Options</TabItem>
							<TabItem id="item-2">Styles</TabItem>
						</TabList>
						<TabContent id="item-1">
							<h1>Options</h1>
							{selected && (
								<>
									{selected.type === "heading" && <HeadingOptions />}
									{selected.type === "container" && <ContainerOptions />}
									{selected.type === "text" && <TextOptions />}
								</>
							)}
						</TabContent>
						<TabContent id="item-2">
							<h1>Styles</h1>
							{selected && (
								<>
									{selected.type === "heading" && <HeadingStyle />}
									{selected.type === "container" && <ContainerStyle />}
									{selected.type === "text" && <TextStyle />}
									{selected.type === "image" && <ImageStyle />}
								</>
							)}
						</TabContent>
					</Tabs>
				) : (
					<div className="text-warning-foreground">
						[Please select a block to get options.]
					</div>
				)}
			</Sidebar>
		</div>
	);
};

export default OptionsPanel;
