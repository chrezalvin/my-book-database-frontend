import { useEffect } from "react";
import { useCustomPath } from "./useCustomPath";

function RedirectToBooks(){
    const {gotoBooks} = useCustomPath();

    useEffect(() => {
        gotoBooks();
    }, [])

    return (
        <div>
            Redirecting to books, please wait...
        </div>
    );
}

export default RedirectToBooks;