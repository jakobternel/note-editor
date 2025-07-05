import Head from "next/head";
import { useEffect, useState } from "react";

// User type declaration
type User = {
    username: string;
    password: string;
};

export default function Home() {
    const [users, setUsers] = useState<User[]>([]); // Array of users stored in db

    useEffect(() => {
        // Connect to db to fetch users
        async function fetchUsers() {
            try {
                const res = await fetch("/api/user");
                if (!res.ok) throw new Error("Failed to fetch users");
                const data = await res.json();
                setUsers(data.users);
            } catch (error: unknown) {
                console.error(
                    error instanceof Error ? error.message : "Unknown error"
                );
            }
        }

        fetchUsers();
    }, []);

    return (
        <>
            <Head>
                <title>Notilo - Full-Stack Note App</title>
                <link rel="icon" href="/icon_white.png" />
            </Head>
            <main>
                <p>Next.Js App</p>
                {/* Show "No Users Registered" if no users returned from db call */}
                {users.length === 0 && <p>No Users Registered</p>}
                {/* Print list of all users if fetched from db */}
                {users.map((user, index) => (
                    <p key={index}>{user.username}</p>
                ))}
            </main>
        </>
    );
}
