import { Badge, Button, Card } from "react-bootstrap";
import { Publisher } from "../../API/models/Publisher";

export interface PublisherCardProps{
    publisher: Publisher;

    onEdit?: (publisher: Publisher) => void;
    onDelete?: (publisher: Publisher) => void;
    onView?: (publisher: Publisher) => void;
}

export function PublisherCard(props: PublisherCardProps){
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
            {props.publisher.publisher_img ? (
                <img
                src={props.publisher.publisher_img}
                alt={`${props.publisher.publisher_name} cover`}
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
                    {props.publisher.publisher_name}
                </Card.Title>

                <div className="mb-2 d-flex flex-wrap gap-1">
                {
                    props.publisher.publisher_aliases.map((alias) => (
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
                    onClick={() => props.onView?.(props.publisher)}
                >
                    View
                </Button>

                {/* Future CRUD */}
                {
                    props.onEdit && (
                    <Button 
                        size="sm" 
                        variant="outline-secondary" 
                        onClick={() => props.onEdit?.(props.publisher)}
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
                        onClick={() => props.onDelete?.(props.publisher)}
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