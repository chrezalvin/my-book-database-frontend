import { Modal } from "react-bootstrap";
import { Book } from "../../API/models/Book";

export interface BookDetailsModalProps {
    book: Book | null;
    onClose: () => void;
}

export default function BookDetailsModal(props: BookDetailsModalProps) {
    return (
    <Modal
        show={props.book !== null}
        onHide={props.onClose}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {props.book?.title}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* image */}
          {
            props.book?.cover_img && (
              <div className="text-center mb-3">
                <img 
                  src={props.book?.cover_img} 
                  alt={props.book?.title} 
                  style={{ maxWidth: "100%", maxHeight: "400px", objectFit: "contain" }} 
                />
              </div>
            )
          }

          <p><strong>Author:</strong> {props.book?.author_name}</p>
          <p><strong>Publisher:</strong> {props.book?.publisher_name}</p>
          <p><strong>Year:</strong> {props.book?.publication_year}</p>
          <p><strong>Language:</strong> {props.book?.language}</p>
          <p><strong>Genre:</strong> {props.book?.genres?.map(g => g.genre_name).join(", ")}</p>
          <p className="mt-3">{props.book?.summary}</p>
        </Modal.Body>
      </Modal>
    )
}