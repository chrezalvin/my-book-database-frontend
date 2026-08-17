import { Badge, Button, Card } from "react-bootstrap";
import { Genre } from "../../API/models/Genre";

export interface GenreCardProps{
    genre: Genre;

    onEdit?: (genre: Genre) => void;
    onDelete?: (genre: Genre) => void;
    onView?: (genre: Genre) => void;
}

export function GenreCard(props: GenreCardProps){
    return (
        <Card className="h-100 shadow-sm">
            {/* Cover */}
            <div
            style={{
                height: "220px",
                backgroundColor: "#e9ecef",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
            }}
            >
            {props.genre.genre_img ? (
                <img
                src={props.genre.genre_img}
                alt={`${props.genre.genre_name} cover`}
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                }}
                loading="lazy"
                />
            ) : (
                <span
                style={{
                    fontSize: "0.9rem",
                    color: "#6c757d",
                }}
                >
                No Cover
                </span>
            )}
            </div>

            <Card.Body className="d-flex flex-column">
                <Card.Title className="text-truncate">
                    {props.genre.genre_name}
                </Card.Title>

                <div className="mb-2 d-flex flex-wrap gap-1">
                {
                    props.genre.genre_aliases.map((alias) => (
                    <Badge 
                        key={alias}
                        bg="secondary"
                        className="align-items-center py-2"
                    >
                        {alias}
                    </Badge>
                    ))
                }
                </div>

                <div className="mt-auto d-flex gap-2">
                <Button
                    size="sm"
                    variant="primary"
                    onClick={() => props.onView?.(props.genre)}
                >
                    View
                </Button>

                {/* Future CRUD */}
                {
                    props.onEdit && (
                    <Button 
                        size="sm" 
                        variant="outline-secondary" 
                        onClick={() => props.onEdit?.(props.genre)}
                        disabled={props.onEdit === undefined}
                    >
                        Edit
                    </Button>
                    )
                }

                {
                    props.onDelete && (
                    <Button 
                        size="sm" 
                        variant="outline-danger" 
                        disabled={props.onDelete === undefined}
                        onClick={() => props.onDelete?.(props.genre)}
                    >
                        Delete
                    </Button>
                    )
                }
                </div>
            </Card.Body>
        </Card>
    );
}