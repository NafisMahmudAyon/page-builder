"use client";

import Nav from "../components/ui/Nav";

import { Eye, Pencil } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Card } from "../components/aspect-ui";
// import Nav from "@/components/ui/Nav";

export default function Home() {
	const [pages, setPages] = useState([]);
	const loadPages = async () => {
		const url =
			process.env.NEXT_PUBLIC_BACKEND_URL ||
			"https://page-builder-backend.onrender.com";
		const res = await fetch(`${url}/api/pages`);
		const data = await res.json();
		setPages(data);
	};
	useEffect(() => {
		loadPages();
	}, []);

	return (
		<div className="">
			<Nav />
			<div className="grid grid-cols-3 gap-4 my-4 px-4">
				{pages.map((page) => (
					<Card
						key={page._id}
						className="flex items-center flex-row justify-between px-4">
						<span>{page.name}</span>
						<div className="flex gap-4">
							<Link
								href={`/preview/${page._id}`}
								className="flex items-center gap-2">
								Preview <Eye />{" "}
							</Link>
							<Link
								href={`/editor/${page._id}`}
								className="flex items-center gap-2">
								Edit <Pencil />{" "}
							</Link>
						</div>
					</Card>
				))}
			</div>
		</div>
	);
}

