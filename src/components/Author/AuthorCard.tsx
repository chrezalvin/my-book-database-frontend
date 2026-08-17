import { Card, Button } from "react-bootstrap";
import { Author } from "../../API/models/Author";

export interface AuthorCardProps {
  author: Author;
  onView?: (author: Author) => void;
  onEdit?: (author: Author) => void;
  onDelete?: (author: Author) => void;
}

export function AuthorCard(props: AuthorCardProps) {
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
      {props.author.author_img ? (
        <img
          src={props.author.author_img}
          alt={`${props.author.author_name} cover`}
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
          {props.author.author_name}
        </Card.Title>
        <div className="mt-auto d-flex gap-2">
          
          <Button
            size="sm"
            variant="primary"
            onClick={() => props.onView?.(props.author)}
          >
            View
          </Button>

          {/* Future CRUD */}
          {
            props.onEdit && (
              <Button 
                size="sm" 
                variant="outline-secondary" 
                onClick={() => props.onEdit?.(props.author)}
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
                onClick={() => props.onDelete?.(props.author)}
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
