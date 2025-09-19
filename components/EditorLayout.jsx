"use client";
import { ArrowUpFromLine, Plus } from "lucide-react";
import useEditor from "../context/EditorContext";
import {
	Button,
	Dropdown,
	DropdownAction,
	DropdownContent,
	DropdownItem,
	Input,
	useToast,
} from "./aspect-ui";
import Link from "next/link";

const EditorLayout = ({ children }) => {
	const {
		page,
		name,
		slug,
		status,
		editorData,
		setEditorData,
		setPage,
		setPageId,
		setSlug,
		setStatus,
		setName,
		handleSave,
		responsive,
		setResponsive,
		blocks,
	} = useEditor();
	const { toast, ToastContainer } = useToast();
	const statusList = [
		{ value: "published", label: "Published" },
		{ value: "draft", label: "Draft" },
	];
	const responsiveList = [
		{ value: "sm", label: "Small" },
		{ value: "md", label: "Medium" },
		{ value: "lg", label: "Large" },
		{ value: "xl", label: "Extra Large" },
	];
	const handleCopy = () => {
		window.navigator.clipboard.writeText(JSON.stringify(blocks));
		toast({
			message: "Copied to clipboard",
			type: "success",
		});
	};
	return (
		<div className="flex flex-col ">
			<div className="w-full h-16 flex items-center border-b gap-2 border-border px-4">
				<div><Link href={"/"}>Editor</Link></div>
				<div className="flex-1 flex justify-center items-center gap-2">
					<Input
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="Page Name"
						wrapperClassName="flex items-center"
						icon={false}
					/>
					<Input
						value={slug}
						onChange={(e) => setSlug(e.target.value)}
						placeholder="Page Slug"
						wrapperClassName="flex items-center"
						icon={false}
					/>
					<Dropdown>
						<DropdownAction className="min-w-[136px] justify-between">
							{status
								? statusList.find((st) => st.value === status).label
								: "Select Status"}
						</DropdownAction>
						<DropdownContent>
							{statusList.map((item, i) => (
								<DropdownItem
									key={i}
									onClick={() => setStatus(item.value)}
									isSelected={status === item.value}>
									{item.label}
								</DropdownItem>
							))}
							{/* <DropdownItem value="draft">Draft</DropdownItem> */}
						</DropdownContent>
					</Dropdown>
					{/* <select value={status} onChange={(e) => setStatus(e.target.value)}>
						<option value="published">Published</option>
						<option value="draft">Draft</option>
						<option value="private">Private</option>
            <option value="public">Public</option>
					</select> */}
					<Dropdown>
						<DropdownAction className="min-w-[136px] justify-between">
							{responsive
								? responsiveList.find((st) => st.value === responsive).label
								: "Select Responsive"}
						</DropdownAction>
						<DropdownContent>
							{responsiveList.map((item, i) => (
								<DropdownItem
									key={i}
									onClick={() => setResponsive(item.value)}
									isSelected={responsive === item.value}>
									{item.label}
								</DropdownItem>
							))}
						</DropdownContent>
					</Dropdown>
					{/* <select
						value={responsive}
						onChange={(e) => setResponsive(e.target.value)}>
						<option value="sm">Small</option>
						<option value="md">Medium</option>
						<option value="lg">Large</option>
						<option value="xl">Extra Large</option>
					</select> */}
				</div>
				<div className="flex items-center gap-2">
					<Button variant="outline" onClick={handleCopy}>
						<ArrowUpFromLine />
					</Button>
					<Button className="flex items-center gap-2" onClick={handleSave}>
						<Plus className="size-5" />
						Save Page
					</Button>
				</div>
			</div>
			<div className="min-h-[calc(100vh-100px)]">{children}</div>
			<ToastContainer />
		</div>
	);
};

export default EditorLayout;
