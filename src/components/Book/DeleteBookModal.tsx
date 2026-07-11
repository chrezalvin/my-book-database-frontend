import { Alert, Modal } from "react-bootstrap";
import { Book } from "../../API/models/Book";

export interface DeleteBookModalProps {
    book: Book | null;
    onClose: () => void;
    onDelete: () => void;

    isDeleting: boolean;
    deleteError: string | null;
}

export default function DeleteBookModal(props: DeleteBookModalProps) {
    return (
    <Modal
        show={props.book !== null}
        onHide={() => { props.onClose(); }}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Confirm Delete {props.book?.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this book?
        </Modal.Body>
        <Modal.Footer>
          <button 
            className="btn btn-secondary" 
            onClick={() => { props.onClose(); }}
            disabled={props.isDeleting}
          >
            Cancel
          </button>
          <button 
            className="btn btn-danger" 
            onClick={() => { props.book && props.onDelete(); }} 
            disabled={props.isDeleting}
          >
            Delete
          </button>
          {props.deleteError && (
            <Alert variant="danger" className="mt-2">
              {props.deleteError}
            </Alert>
          )}
        </Modal.Footer>
      </Modal>
    )
}