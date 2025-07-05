import Head from "next/head";
import { gql, useQuery } from "@apollo/client";

// User type declaration
type Users = {
    users: {
        _id: string;
        username: string;
    }[];
};

// GQL query to get list of users
const GET_USERS = gql`
    query {
        users {
            _id
            username
        }
    }
`;

export default function Home() {
    const { data, error } = useQuery<Users>(GET_USERS); // Run GQL query

    // Log error if GQL query fails
    if (error) {
        console.error(error.message);
    }

    return (
        <>
            <Head>
                <title>Notilo - Full-Stack Note App</title>
                <link rel="icon" href="/icon_white.png" />
            </Head>
            <main>
                <p>Next.Js App</p>
                {/* Show "No Users Registered" if no users returned from db call */}
                {data?.users.length === 0 && <p>No Users Registered</p>}
                {/* Print list of all users if fetched from db */}
                {data?.users.map((user) => (
                    <p key={user._id}>{user.username}</p>
                ))}
            </main>
        </>
    );
}
