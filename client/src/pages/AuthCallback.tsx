import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch } from "../features/hooks";
import { setCredentials } from "../features/auth/authSlice";
import { authService } from "../services/api";
import { Spinner, Container } from "react-bootstrap";


export default function AuthCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        const token = searchParams.get("token");
        
        const loginWithGoogle = async () => {
            if (token) {
                try {
                    localStorage.setItem("token", token);
                    
                    const user = await authService.getProfile();

                    dispatch(setCredentials({ user, token }));

                    if (user.role === 'ADMIN') {
                        navigate("/admin");
                    } else {
                        navigate("/");
                    }
                } catch (error) {
                    console.error("Google login failed:", error);
                    navigate("/login");
                }
            } else {
                navigate("/login");
            }
        };

        loginWithGoogle();
        }, [navigate, searchParams, dispatch]);
        return (
            <Container className="d-flex justify-content-center align-items-center vh-100 flex-column">
                <Spinner animation="border" variant="primary" />
                <h5 className="mt-3 text-muted">מתחבר מאובטח דרך Google...</h5>
            </Container>
        );

     }