import { FoldVertical, Heading1, Image, List, PencilLine, SquareDashed, Type } from "lucide-react";

export const templates = [
	{
		id: 0,
		type: "list",
		label: "List",
		content: "Creative Director",
		options: {
			editor: {
				icon: List,
			},
		},
	},
	{
		id: 0,
		type: "iconBlock",
		label: "Icon Block",
		content: "Creative  Studio LLC",
		options: {
			editor: {
				icon: PencilLine,
			},
		},
	},
	{
		id: 0,
		type: "divider",
		label: "Divider",
		content: "https://createllc.com",
		options: {
			editor: {
				icon: FoldVertical,
			},
		},
	},
	{
		id: 0,
		type: "heading",
		label: "Heading",
		content: "Dummy Heading",
		options: {
			editor: {
				icon: Heading1,
			},
			block: {
				tagName: "h2",
				className: "",
				text: "Dummy Heading",
			},
		},
	},
	{
		id: 0,
		type: "image",
		label: "Image",
		content: "",
		options: {
			editor: {
				icon: Image,
			},
			block: {
				imageLink:
					"https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
				className: "",
			},
		},
	},
	{
		id: 0,
		type: "text",
		content: "New Text Element",
		options: {
			editor: {
				icon: Type,
			},
			block: {
				tagName: "p",
				className: "",
				text: "Dummy Text Content...",
			},
		},
		label: "Text Block",
	},
	{
		id: 0,
		type: "container",
		content: "New Container",
		children: [],
		options: {
			editor: {
				icon: SquareDashed,
			},
		},
		label: "Container",
	},
];
