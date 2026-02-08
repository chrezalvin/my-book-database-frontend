import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function RedirectToBooks(){
    const navigate = useNavigate();

    useEffect(() => {
        navigate("/books");
    }, [])

    return (
        <div>
            Redirecting to books, please wait...
        </div>
    );
}

export default RedirectToBooks;