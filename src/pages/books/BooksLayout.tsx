import { Container } from "react-bootstrap";
import Header from "../../components/Header";
import { Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/customRedux";
import * as AuthenticationService from "../../API/services/AuthenticationService";
import { assignUser, resetUser } from "../../store/User";
import { useEffect } from "react";
import { useCustomPath } from "../useCustomPath";

export function BooksLayout() {
    const user = useAppSelector((state) => state.user);
    const {gotoBooks, gotoLogin} = useCustomPath();
    const dispatch = useAppDispatch();

    async function logout(){
        await AuthenticationService.logoutUser();
        dispatch(resetUser());

        gotoBooks();
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
                onGoToLogin={() => gotoLogin()}
                onLogout={logout}
                onGoToBooks={() => gotoBooks()}
            />

            <main className="container mt-4">
                <Outlet />
            </main>
        </Container>
    )
}

export default BooksLayout;