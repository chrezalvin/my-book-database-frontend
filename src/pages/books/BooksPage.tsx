import { Button } from "react-bootstrap";
import { useAppSelector } from "../../hooks/customRedux";
import Dashboard from "../Dashboard";
import { useCustomPath } from "../useCustomPath";

export function BooksPage() {
    const user = useAppSelector((state) => state.user);
    const {gotoBooksCreate} = useCustomPath();

    return (
        <>
            {
                user && (
                    <Button
                        className="mb-3"
                        onClick={() => gotoBooksCreate()}
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