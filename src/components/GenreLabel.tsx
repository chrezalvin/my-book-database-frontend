import { Badge } from "react-bootstrap";
import { Genre } from "../API/models/Genre";
import { Book } from "../API/models/Book";
import { JSX } from "react";

interface GenreLabelProps {
    genre: Genre | Book["genres"][number];
    onClick?: (genre: Genre | Book["genres"][number]) => void;
    children?: JSX.Element;
}

export default function GenreLabel(props: GenreLabelProps) {
    return (
        <Badge 
            bg="secondary"
            className="d-inline-flex align-items-center py-2"
            onClick={() => props.onClick?.(props.genre)}
        >
            {props.genre.genre_name}
            {props.children}
        </Badge>
    )
}