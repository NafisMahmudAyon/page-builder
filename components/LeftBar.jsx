"use client";
import { Plus, X } from "lucide-react";
import useEditor from "../context/EditorContext";
import { Sidebar, TabContent, TabItem, TabList, Tabs } from "./aspect-ui";
import { useSidebar } from "./aspect-ui/Sidebar/SidebarContext";
import ListView from "./ListView";

const LeftBar = () => {
	const {
		elementTemplates,
		setDraggedTemplate,
	} = useEditor();
	const { closeSidebar } = useSidebar();
	return (
			<Sidebar className="left-0 h-[calc(100vh-120px)] my-6 ml-2 rounded-lg border-border border">
				<div className="lg:hidden" onClick={closeSidebar}>
					<X />
				</div>
				<Tabs defaultActive="item-1">
					<TabList>
						<TabItem id="item-1">Elements</TabItem>
						<TabItem id="item-2">List</TabItem>
					</TabList>
					<TabContent id="item-1">
						<h1>Elements</h1>
						<div className="grid grid-cols-2 gap-2 text-[11px]">
							{elementTemplates.map((template, index) => {
								return (
									<div
										key={index}
										className="flex items-center flex-col gap-2 px-3 py-2 pt-4 bg-bg-light border border-border rounded cursor-move hover:border-border-50 hover:bg-bg-light/60"
										draggable
										onDragStart={() => setDraggedTemplate(template)}
										onDragEnd={() => setDraggedTemplate(null)}>
										{/* <Icon className="w-5 h-5 mr-2 text-gray-600" /> */}
										{template.options?.editor?.icon ? (
											<template.options.editor.icon className="size-5" />
										) : (
											<Plus className="size-5" />
										)}
										<span>{template.label}</span>
									</div>
								);
							})}
						</div>
					</TabContent>
					<TabContent id="item-2">
						<h1>List</h1>
						<ListView />
					</TabContent>
				</Tabs>
			</Sidebar>
	);
};

export default LeftBar;
