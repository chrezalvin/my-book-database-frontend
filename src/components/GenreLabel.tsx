import { Badge } from "react-bootstrap";
import { Genre } from "../API/models/Genre";

interface GenreLabelProps {
    genre: Genre;
    onDelete?: (genre: Genre) => void;
}

export default function GenreLabel(props: GenreLabelProps) {
    return (
        <Badge 
            bg="secondary"
            className="d-inline-flex align-items-center py-2"
        >
            {props.genre.genre_name}
            {
                props.onDelete && (
                    <span 
                        className="ms-2"
                        style={{ cursor: "pointer" }}
                        onClick={() => props.onDelete!(props.genre)}
                    >
                        &times;
                    </span>
                )
            }
        </Badge>
    )
}