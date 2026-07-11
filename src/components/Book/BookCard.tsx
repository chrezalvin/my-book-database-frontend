import { Card, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Book } from "../../API/models/Book";
import GenreLabel from "../GenreLabel";
import { Publisher } from "../../API/models/Publisher";
import { Author } from "../../API/models/Author";

interface BookCardProps {
  book: Book;
  onView?: (book: Book) => void;
  onEdit?: (book: Book) => void;
  onDelete?: (book: Book) => void;
  onPublisherClick?: (publisher_id: Publisher["publisher_id"]) => void;
  onAuthorClick?: (author_id: Author["author_id"]) => void;
  allowedToEdit?: boolean;
  allowedToDelete?: boolean;
}

export default function BookCard(props: BookCardProps) {
  const genreLabels = props.book.genres?.map((genre) => (
    <GenreLabel 
      key={genre.genre_id} 
      genre_id={genre.genre_id}
      genre_name={genre.genre_name}
    />
  ));

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
      {props.book.cover_img ? (
        <img
          src={props.book.cover_img}
          alt={`${props.book.title} cover`}
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
          {props.book.title}
        </Card.Title>

        <OverlayTrigger
          placement="top-start"
          overlay={<Tooltip>
            {props.book.author_name ?? "No Author"}
          </Tooltip>}
        >
          <Card.Subtitle 
            className={`mb-2 ${props.onAuthorClick && props.book.author_id ? "text-primary" : "text-muted"}`}
            onClick={props.onAuthorClick && props.book.author_id ? () => props.onAuthorClick!(props.book.author_id!) : undefined}
          >
            {props.book.author_name ?? "No Author"}
          </Card.Subtitle>
        </OverlayTrigger>

        <Card.Text 
          className={`small mb-2 ${props.onPublisherClick && props.book.publisher_id ? "text-primary" : "text-muted"}`}
          onClick={props.onPublisherClick && props.book.publisher_id ? () => props.onPublisherClick!(props.book.publisher_id!) : undefined}
        >
          {props.book.publisher_name ?? "No Publisher"} • {props.book.publication_year}
        </Card.Text>

        <div className="mb-2 d-flex flex-wrap gap-1">
          {genreLabels}
        </div>

        <div className="mt-auto d-flex gap-2">
          <Button
            size="sm"
            variant="primary"
            onClick={() => props.onView?.(props.book)}
          >
            View
          </Button>

          {/* Future CRUD */}
          {
            props.allowedToEdit && (
              <Button 
                size="sm" 
                variant="outline-secondary" 
                onClick={() => props.onEdit?.(props.book)}
                disabled={props.onEdit === undefined}
              >
                Edit
              </Button>
            )
          }

          {
            props.allowedToDelete && (
              <Button 
                size="sm" 
                variant="outline-danger" 
                disabled={props.onDelete === undefined}
                onClick={() => props.onDelete?.(props.book)}
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
