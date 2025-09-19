"use client";

import React, { useEffect, useState } from "react";
import { Switch } from "./aspect-ui";
import { useTheme } from "next-themes";

const DarkMode = () => {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true); // Only render after hydration
	}, []);

	if (!mounted) {
		// Avoid rendering before theme is ready
		return null;
	}

	return (
		<Switch
			checked={theme === "dark"}
			onChange={(checked) => setTheme(checked ? "dark" : "light")}
			activeClassName="bg-bg-light"
			deactiveClassName="bg-bg-dark"
			deactiveSwitchClassName="bg-text-muted"
			activeSwitchClassName="bg-text">
			DarkMode
		</Switch>
	);
};

export default DarkMode;
