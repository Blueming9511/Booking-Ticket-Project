import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const Home = () => {
    const [user, setUser] = useState(null);
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    useEffect(() => {
        if (token) {
            fetch("http://localhost:8080/api/user", {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((data) => setUser(data));
        }
    }, [token]);

    return (
        <div>
            <h1>Welcome, {user ? user.username : "Guest"}!</h1>
        </div>
    );
};

export default Home;
