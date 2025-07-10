/**
 * UserButton component to be used in Header component
 */
export default function UserButton() {
    return (
        <div className="flex cursor-pointer items-center gap-5">
            <div>
                <p className="text-sm text-textSecondary">test-1234</p>
            </div>
            <div className="flex size-8 items-center justify-center rounded-full border border-green-400 bg-green-200">
                <p className="text-xs font-semibold">TE</p>
            </div>
        </div>
    );
}
