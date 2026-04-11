import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ApiClient from "../api";

export default function AuthCallback() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (!token) {
            navigate("/login");
            return;
        }

        // Store token
        localStorage.setItem("token", token);

        // Fetch profile using the new token
        const api = new ApiClient();
        api.getProfile()
            .then((profile) => {
                if (profile) {
                    login({
                        user_name: profile.user_name || "",
                        email: profile.email || "",
                        phone: profile.phone || "",
                        profile_picture: profile.profile_picture || "",
                    });
                }
                navigate("/");
            })
            .catch(() => {
                navigate("/");
            });
    }, []);

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#0F0121",
                color: "white",
                fontFamily: "'Outfit', sans-serif",
                fontSize: "1.1rem",
            }}
        >
        </div>
    );
}