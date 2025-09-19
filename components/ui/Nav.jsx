import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Navbar, NavbarContainer } from "../aspect-ui";
import DarkMode from "../DarkMode";

const Nav = () => {
	return (
		<Navbar>
			<NavbarContainer>
				Logo

				<div className="flex items-center gap-4">
          <DarkMode />
          <Link
            href="/editor/new"
            className="hover:underline hover:underline-offset-4 flex items-center gap-2">
            Create New Page
            <ArrowUpRight />
          </Link>
        </div>
			</NavbarContainer>
		</Navbar>
	);
};

export default Nav;
