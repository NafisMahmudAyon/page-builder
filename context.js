import React, { createContext, useContext, useReducer } from "react";

const PageBuilderContext = createContext();

const initialState = {
	currentPage: null,
	currentSite: null,
	user: null,
	pages: [],
	sites: [],
	selectedBlock: null,
	editorMode: "edit", // 'edit' | 'preview'
	loading: false,
	error: null,
};

const pageBuilderReducer = (state, action) => {
	switch (action.type) {
		case "SET_LOADING":
			return { ...state, loading: action.payload };
		case "SET_ERROR":
			return { ...state, error: action.payload, loading: false };
		case "SET_CURRENT_PAGE":
			return { ...state, currentPage: action.payload };
		case "SET_CURRENT_SITE":
			return { ...state, currentSite: action.payload };
		case "SET_USER":
			return { ...state, user: action.payload };
		case "SET_PAGES":
			return { ...state, pages: action.payload };
		case "ADD_PAGE":
			return { ...state, pages: [...state.pages, action.payload] };
		case "UPDATE_PAGE":
			return {
				...state,
				pages: state.pages.map((page) =>
					page._id === action.payload._id ? action.payload : page
				),
				currentPage:
					state.currentPage?._id === action.payload._id
						? action.payload
						: state.currentPage,
			};
		case "DELETE_PAGE":
			return {
				...state,
				pages: state.pages.filter((page) => page._id !== action.payload),
				currentPage:
					state.currentPage?._id === action.payload ? null : state.currentPage,
			};
		case "SET_SELECTED_BLOCK":
			return { ...state, selectedBlock: action.payload };
		case "SET_EDITOR_MODE":
			return { ...state, editorMode: action.payload };
		default:
			return state;
	}
};

export const PageBuilderProvider = ({ children }) => {
	const [state, dispatch] = useReducer(pageBuilderReducer, initialState);

	return (
		<PageBuilderContext.Provider value={{ state, dispatch }}>
			{children}
		</PageBuilderContext.Provider>
	);
};

export const usePageBuilder = () => {
	const context = useContext(PageBuilderContext);
	if (!context) {
		throw new Error("usePageBuilder must be used within PageBuilderProvider");
	}
	return context;
};
