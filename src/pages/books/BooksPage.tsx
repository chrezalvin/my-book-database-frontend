import { Button } from "react-bootstrap";
import { useAppSelector } from "../../hooks/customRedux";
import Dashboard from "../Dashboard";
import { useNavigate } from "react-router-dom";

export function BooksPage() {
    const user = useAppSelector((state) => state.user);
    const navigate = useNavigate();

    return (
        <>
            {
                user && (
                    <Button
                        className="mb-3"
                        onClick={() => navigate("/books/create")}
                    >
                        Add New Book
                    </Button>
                )
            }
            
            <Dashboard />
        </>
    );
}

export default BooksPage;