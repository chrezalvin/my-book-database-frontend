import { Badge } from "react-bootstrap";
import { Genre } from "../API/models/Genre";

interface GenreLabelProps {
    genre_id: Genre["genre_id"];
    genre_name: Genre["genre_name"];
    onDelete?: (genre_id: Genre["genre_id"]) => void;
}

export default function GenreLabel(props: GenreLabelProps) {
    return (
        <Badge 
            bg="secondary"
            className="d-inline-flex align-items-center py-2"
        >
            {props.genre_name}
            {
                props.onDelete && (
                    <span 
                        className="ms-2"
                        style={{ cursor: "pointer" }}
                        onClick={() => props.onDelete!(props.genre_id)}
                    >
                        &times;
                    </span>
                )
            }
        </Badge>
    )
}