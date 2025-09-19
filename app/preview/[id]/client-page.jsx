"use client";
import Script from "next/script";
import { useEffect, useState } from "react";
import { Container } from "../../../components/Blocks/Container";
import { Heading } from "../../../components/Blocks/Heading";
import { Image } from "../../../components/Blocks/Image";
import { Text } from "../../../components/Blocks/Text";
import { EditorProvider } from "../../../context/EditorContext";

export default function ClientPage({ id }) {
	const pageId = id;
	const [page, setPage] = useState();
	const loadPage = async () => {
		const url =
			process.env.NEXT_PUBLIC_BACKEND_URL ||
			"https://page-builder-backend.onrender.com";
		const res = await fetch(`${url}/api/pages/${pageId}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		});
		const data = await res.json();
		console.log(data);
		setPage(data);
	};
	useEffect(() => {
		loadPage();
	}, [pageId]);

	const blocks = page?.page_data?.blocks;
	return (
		<EditorProvider>
			<div>
				{blocks && blocks.map((block) => <Tree key={block.id} block={block} />)}
			</div>
			<Script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4" />
		</EditorProvider>
	);
}

const Tree = ({ block }) => {
	if (!block) return null;
	if (block.type === "container") {
		return (
			<Container
				blockData={block}
				preview={true}
				tagName={block.options?.block?.tagName}>
				{block.children?.map((child) => (
					<Tree key={child.id} block={child} />
				))}
			</Container>
		);
	}
	if (block.type === "text") {
		return (
			<Text
				blockData={block}
				preview={true}
				tagName={block.options?.block?.tagName}
			/>
		);
	}
	if (block.type === "heading") {
		return (
			<Heading
				blockData={block}
				preview={true}
				tagName={block.options?.block?.tagName}
			/>
		);
	}
	if (block.type === "image") {
		return <Image blockData={block} preview={true} />;
	}
	return null;
};
