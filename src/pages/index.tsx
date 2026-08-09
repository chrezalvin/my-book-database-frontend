import { createBrowserRouter } from "react-router-dom";

import BooksPage from "./books/BooksPage";
import BooksCreatePage from "./books/BooksCreatePage";
import RedirectToBooks from "./RedirectToBooks";
import LoginPage from "./LoginPage";
import BooksLayout from "./books/BooksLayout";
import BooksEditPage from "./books/BooksEditPage";
import AuthorPage from "./books/AuthorPage";
import PublisherPage from "./books/PublisherPage";
import Testing from "./Testing";
import GenrePage from "./books/GenrePage";

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
        path: "/testing",
        element: <Testing />
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
            },
            {
                path: "/authors/:author_id",
                element: <AuthorPage />
            },
            {
                path: "/publishers/:publisher_id",
                element: <PublisherPage />
            },
            {
                path: "/genres/:genre_id",
                element: <GenrePage />
            }
        ]
    }
]);