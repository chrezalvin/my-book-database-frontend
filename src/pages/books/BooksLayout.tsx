import { Container } from "react-bootstrap";
import Header from "../../components/Header";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/customRedux";
import { AuthenticationService } from "../../API/services/AuthenticationService";
import { assignUser, resetUser } from "../../store/User";
import { useEffect } from "react";

function BooksLayout() {
    const user = useAppSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    async function logout(){
        await AuthenticationService.logoutUser();
        dispatch(resetUser());

        navigate("/books");
    }

    async function checkIfLoggedin(){
        if (user)
            return;

        try{
            const userData = await AuthenticationService.getUserData();
            dispatch(assignUser(userData));
        }
        catch(err){
            // not authenticated, do nothing
        }
    }

    useEffect(() => {
        checkIfLoggedin();
    }, []);

    return (
        <Container className="pb-4">
            <Header 
                user={user}
                onGoToLogin={() => navigate("/login")}
                onLogout={logout}
                onGoToBooks={() => navigate("/books")}
            />

            <main className="container mt-4">
                <Outlet />
            </main>
        </Container>
    )
}

export default BooksLayout;