import SearchBar from "./header/SearchBar";
import UserButton from "./header/UserButton";

/**
 * Header component to be used in Layout component
 */
export default function Navbar() {
    return (
        <header className="flex h-16 w-full items-center justify-between border-b border-border bg-surface p-3">
            <SearchBar />
            <UserButton />
        </header>
    );
}
