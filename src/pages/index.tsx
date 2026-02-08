import { createBrowserRouter } from "react-router-dom";
import BooksPage from "./books/BooksPage";
import BooksCreatePage from "./books/BooksCreatePage";
import RedirectToBooks from "./RedirectToBooks";
import LoginPage from "./LoginPage";
import BooksLayout from "./books/BooksLayout";
import BooksEditPage from "./books/BooksEditPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RedirectToBooks />,
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        element: <BooksLayout />,
        children: [
            {
                path: "/books",
                element: <BooksPage />
            },
            {
                path: "/books/page/:page",
                element: <BooksPage />
            },
            {
                path: "/books/create",
                element: <BooksCreatePage />
            },
            {
                path: "/books/edit/:book_id",
                element: <BooksEditPage />
            }
        ]
    }
]);