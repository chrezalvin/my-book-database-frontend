import { Card, Button, OverlayTrigger, Tooltip, Badge } from "react-bootstrap";
import { Book } from "../../API/models/Book";

interface BookCardProps {
  book: Book;
  onView?: (book: Book) => void;
  onEdit?: (book: Book) => void;
  onDelete?: (book: Book) => void;
  onPublisherClick?: (publisher: NonNullable<Book["publisher"]>) => void;
  onAuthorClick?: (author: NonNullable<Book["author"]>) => void;
  onGenreClick?: (genre: NonNullable<Book["genres"][number]>) => void;
}

export default function BookCard(props: BookCardProps) {
  const publisher = props.book.publisher;
  const author = props.book.author;

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
        {
          author && (
            <OverlayTrigger
              placement="top-start"
              overlay={<Tooltip>
                {author.author_name}
              </Tooltip>}
            >
              <Card.Subtitle 
                className={`mb-2 ${props.onAuthorClick  ? "text-primary" : "text-muted"}`}
                onClick={() => props.onAuthorClick?.(author)}
              >
                {author.author_name}
              </Card.Subtitle>
            </OverlayTrigger>
          )
        }

        {
          publisher && (
            <Card.Text 
              className={`small mb-2 ${props.onPublisherClick ? "text-primary" : "text-muted"}`}
              onClick={() => props.onPublisherClick?.(publisher)}
            >
              {props.book.publisher?.publisher_name ?? "No Publisher"} • {props.book.publication_year}
            </Card.Text>
          )
        }

        <div className="mb-2 d-flex flex-wrap gap-1">
          {
            props.book.genres.map((g) => (
              <Badge 
                key={g.genre_id}
                bg="secondary"
                className="align-items-center py-2"
                onClick={() => props.onGenreClick?.(g)}
              >
                {g.genre_name}
              </Badge>
            ))
          }
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
            props.onEdit && (
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
            props.onDelete && (
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
