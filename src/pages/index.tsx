import { createBrowserRouter } from "react-router-dom";

import RedirectToBooks from "./RedirectToBooks";
import LoginPage from "./LoginPage";
import Testing from "./Testing";

import {
    BooksPage,
    BooksCreatePage,
    BooksEditPage,
    BooksLayout
} from "./books";

import {
    GenreBookPage,
    GenresPage
} from "./genres";

import {
    AuthorPage,
    AuthorsPage
} from "./authors";

import {
    PublisherPage,
    PublishersPage
} from "./publishers";

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
                children: [
                    {
                        path: "",
                        element: <BooksPage />
                    },
                    {
                        path: "page/:page",
                        element: <BooksPage />
                    },
                    {
                        path: "create",
                        element: <BooksCreatePage />
                    },
                    {
                        path: "edit/:book_id",
                        element: <BooksEditPage />
                    },
                ]
            },
            {
                path: "/authors",
                children: [
                    {
                        path: "",
                        element: <AuthorsPage />
                    },
                    {
                        path: ":author_id",
                        element: <AuthorPage />
                    },
                ]
            },
            {
                path: "/publishers",
                children: [
                    {
                        path: "",
                        element: <PublishersPage />
                    },
                    {
                        path: ":publisher_id",
                        element: <PublisherPage />
                    },
                ]
            },
            {
                path: "/genres",
                children: [
                    {
                        path: "",
                        element: <GenresPage />
                    },
                    {
                        path: ":genre_id",
                        element: <GenreBookPage />
                    }
                ]
            },
        ]
    }
]);