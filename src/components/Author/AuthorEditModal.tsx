import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { Author } from "../../API/models/Author";
import { AuthorUpdate, updateAuthorSchema } from "../../API/schemas/AuthorSchema";
import * as AuthorService from "../../API/services/AuthorService";

export interface AuthorEditModalProps{
  initialAuthor: Author;
  onAuthorEdit: (author: Author) => void;
  onClose: () => void;

  show?: boolean;
}

export default function AuthorEditModal(props: AuthorEditModalProps){
    const [authorName, setAuthorName] = useState<AuthorUpdate["author_name"] | undefined>(undefined);
    const [authorDescription, setAuthorDescription] = useState<AuthorUpdate["author_description"] | undefined>(undefined);
    const [authorImg, setAuthorImg] = useState<File | null | undefined>(undefined);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function updateAuthor(){
        try{
          setIsLoading(true);

          const parsed = updateAuthorSchema.parse({ 
            author_name: authorName, 
            author_description: authorDescription 
          });

          const editedAuthor = await AuthorService.editAuthor(props.initialAuthor.author_id, parsed, authorImg ?? undefined);
          props.onAuthorEdit(editedAuthor);
          props.onClose();
        }
        catch(error){
          console.error("Error updating author:", error);
        }
        finally{
          setIsLoading(false);
        }
    }

    function handleReset(){
      setAuthorName(undefined);
      setAuthorDescription(undefined);
      setAuthorImg(undefined);
    }

    return (
      <Modal 
        show={props.show ?? false} 
        onHide={props.onClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Author {props.initialAuthor.author_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formNewAuthorName">
            <Form.Label>Author Name</Form.Label>
            <Form.Control
              name="newAuthorName"
              disabled={isLoading}
              value={authorName ?? props.initialAuthor.author_name}
              onChange={(e) => setAuthorName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formNewAuthorDescription">
            <Form.Label>Author Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="newAuthorDescription"
              disabled={isLoading}
              value={authorDescription ?? props.initialAuthor.author_description ?? ""}
              onChange={(e) => setAuthorDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Cover Image</Form.Label>

            <div className="mb-2">
              <img
                src={authorImg ? URL.createObjectURL(authorImg) : props.initialAuthor.author_img ?? ""}
                alt="Author Cover Preview"
                style={{
                  height: "120px",
                  objectFit: "cover",
                }}
              />
            </div>

            <Form.Control
              type="file"
              accept="image/*"
              disabled={isLoading}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files && e.target.files.length > 0) {
                    setAuthorImg(e.target.files[0]);
                } else {
                    setAuthorImg(undefined);
                }
                }}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={props.onClose}
            disabled={isLoading}
          >
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={updateAuthor}
            disabled={isLoading}
          >
            Edit Author
          </Button>
          <Button
            variant="warning"
            onClick={handleReset}
            disabled={isLoading}
          >
            Reset
          </Button>
        </Modal.Footer>
      </Modal>
    );
}