"use client";

import { Card, Input, Button, Alert } from "@/components/aspect-ui";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Page = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const fetchUser = async () => {
		if (!name || !email) {
			alert("Please fill all fields");
			return;
		}

		setLoading(true);
		try {
			const url =
				process.env.NEXT_PUBLIC_BACKEND_URL ||
				"https://page-builder-backend.onrender.com";
			const response = await fetch(`${url}/api/auth/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name, email }),
			});

			if (!response.ok) {
				const error = await response.json();
				alert(error.message || "Login failed");
				return;
			}

			const data = await response.json();

			// save in localStorage (client use)
			localStorage.setItem("user", JSON.stringify(data.user));
			localStorage.setItem("token", data.token);

			// also save token in cookie (for middleware to read)
			document.cookie = `token=${data.token}; path=/; max-age=${60 * 60 * 24}`;

			// redirect to home
			router.push("/");
		} catch (error) {
			console.error("Login error:", error);
			alert("Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		fetchUser();
	};

	return (
		<div className="min-h-screen flex justify-center items-center">
			<Card className="p-4">
				<h1 className="text-2xl font-bold text-center">Login</h1>
				<form onSubmit={handleSubmit} className="p-4 flex gap-4 flex-col">
					<Input
						type="text"
						placeholder="Name"
						value={name}
						icon={<User />}
						onChange={(e) => setName(e.target.value)}
					/>
					<Input
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<Button variant="outline" type="submit" disabled={loading}>
						{loading ? "Logging in..." : "Login"}
					</Button>
				</form>
				<Alert type="info" >You can use any name and email</Alert>
			</Card>
		</div>
	);
};

export default Page;
