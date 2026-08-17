import { Modal } from "react-bootstrap";
import { Author } from "../../../API/models/Author";

export interface AuthorDetailsModalProps {
    author: Author;
    onClose: () => void;
}

export default function AuthorDetailsModal(props: AuthorDetailsModalProps) {
    return (
    <Modal
        show={props.author !== null}
        onHide={props.onClose}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {props.author.author_name}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* image */}
          {
            props.author.author_img && (
              <div className="text-center mb-3">
                <img 
                  src={props.author.author_img} 
                  alt={props.author.author_name} 
                  style={{ maxWidth: "100%", maxHeight: "400px", objectFit: "contain" }} 
                />
              </div>
            )
          }

          <p className="mt-3">{props.author.author_description}</p>
        </Modal.Body>
      </Modal>
    )
}