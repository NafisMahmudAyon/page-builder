import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_PATHS = ["/login", "/_next", "/api", "/preview"];
const JWT_SECRET = "your_secret_key"; // must match backend

async function verifyJWT(token) {
	try {
		const secret = new TextEncoder().encode(JWT_SECRET); // ✅ convert to Uint8Array
		const { payload } = await jwtVerify(token, secret);
		return payload;
	} catch (err) {
		console.error("Invalid token:", err);
		return null;
	}
}

export async function middleware(req) {
	const { pathname } = req.nextUrl;

	// allow public paths
	if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
		return NextResponse.next();
	}

	const token = req.cookies.get("token")?.value;

	if (!token) {
		return NextResponse.redirect(new URL("/login", req.url));
	}

	const decoded = await verifyJWT(token);

	if (!decoded) {
		const response = NextResponse.redirect(new URL("/login", req.url));
		response.cookies.delete("token");
		return response;
	}

	// ✅ token valid → allow access
	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!_next|favicon.ico).*)"],
};
