import { useEffect, useState } from "react";
import { AuthorCreate, createAuthorSchema } from "../../API/schemas/AuthorSchema";
import { Button, Form, Modal } from "react-bootstrap";

export interface AuthorCreateAdd extends AuthorCreate{
    file?: File;
}

export interface AuthorAddModalProps{
    initialAuthor?: AuthorCreate;
    onAdd: (author: AuthorCreateAdd) => void;
    onClose: () => void;

    show?: boolean;
    isLoading?: boolean;
}

export default function AuthorAddModal(props: AuthorAddModalProps){
    const [authorName, setAuthorName] = useState<AuthorCreate["author_name"]>("");
    const [authorDescription, setAuthorDescription] = useState<AuthorCreate["author_description"]>("");
    const [authorImg, setAuthorImg] = useState<File | null>(null);

    function addAuthor(){
        try{
            const parsed = createAuthorSchema.parse({ 
                author_name: authorName, 
                author_description: authorDescription 
            });
    
            props.onAdd({...parsed, file: authorImg ?? undefined});
        }
        catch(error){
            console.error("Error adding author:", error);
        }
    }

    useEffect(() => {
        if (props.show) {
            setAuthorName(props.initialAuthor?.author_name ?? "");
            setAuthorDescription(props.initialAuthor?.author_description ?? "");
        }
    }, [props.show]);

    return (
      <Modal 
        show={props.show ?? false} 
        onHide={props.onClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add A New Author</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formNewAuthorName">
            <Form.Label>Author Name</Form.Label>
            <Form.Control
              name="newAuthorName"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formNewAuthorDescription">
            <Form.Label>Author Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="newAuthorDescription"
              value={authorDescription ?? ""}
              onChange={(e) => setAuthorDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Cover Image</Form.Label>

            {authorImg && (
              <div className="mb-2">
                <img
                  src={URL.createObjectURL(authorImg)}
                  alt="Author Cover Preview"
                  style={{
                    height: "120px",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}

            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files && e.target.files.length > 0) {
                    setAuthorImg(e.target.files[0]);
                } else {
                    setAuthorImg(null);
                }
                }}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={props.onClose}
            disabled={props.isLoading}
          >
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={addAuthor}
            disabled={props.isLoading}
          >
            Add Author
          </Button>
        </Modal.Footer>
      </Modal>
    );
}