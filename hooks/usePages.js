import { useState, useEffect } from "react";
import { pagesAPI } from "../services/api";

export const usePages = (userId, siteId = null) => {
	const [pages, setPages] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		fetchPages();
	}, [userId, siteId]);

	const fetchPages = async () => {
		try {
			setLoading(true);
			const response = await pagesAPI.getPages(userId, siteId);
			setPages(response.data);
			setError(null);
		} catch (err) {
			setError(err.response?.data?.message || "Failed to fetch pages");
		} finally {
			setLoading(false);
		}
	};

	const createPage = async (pageData) => {
		try {
			const response = await pagesAPI.createPage(pageData);
			setPages((prev) => [...prev, response.data]);
			return response.data;
		} catch (err) {
			throw new Error(err.response?.data?.message || "Failed to create page");
		}
	};

	const updatePage = async (pageId, pageData) => {
		try {
			const response = await pagesAPI.updatePage(pageId, pageData);
			setPages((prev) =>
				prev.map((page) => (page._id === pageId ? response.data : page))
			);
			return response.data;
		} catch (err) {
			throw new Error(err.response?.data?.message || "Failed to update page");
		}
	};

	const deletePage = async (pageId) => {
		try {
			await pagesAPI.deletePage(pageId);
			setPages((prev) => prev.filter((page) => page._id !== pageId));
		} catch (err) {
			throw new Error(err.response?.data?.message || "Failed to delete page");
		}
	};

	return {
		pages,
		loading,
		error,
		fetchPages,
		createPage,
		updatePage,
		deletePage,
	};
};
