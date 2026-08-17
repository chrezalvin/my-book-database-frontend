import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Author } from "../../../API/models/Author";
import { AuthorUpdate } from "../../../API/schemas/AuthorSchema";
import * as AuthorService from "../../../API/services/AuthorService";
import AuthorUpdateForm from "../Form/AuthorUpdateForm";
import { AxiosError } from "axios";

export interface AuthorEditModalProps{
  initialAuthor: Author;
  onAuthorEdited: (author: Author) => void;
  onClose: () => void;

  show?: boolean;
}

export default function AuthorEditModal(props: AuthorEditModalProps){
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  async function updateAuthor(author_id: Author["author_id"], authorUpdate: AuthorUpdate){
    try{
      setIsLoading(true);
      setApiError(null);

      const editedAuthor = await AuthorService.editAuthor(author_id, authorUpdate);
      props.onAuthorEdited(editedAuthor);
      props.onClose();
    }
    catch(error){
      if(error instanceof AxiosError)
        setApiError(error.response?.data.error);
      else{
        console.error("Error adding author:", error);
        setApiError("Unknown error occured!");
      }
    }
    finally{
      setIsLoading(false);
    }
  }

  return (
    <Modal 
      show={props.show} 
      onHide={props.onClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit Author {props.initialAuthor.author_name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <AuthorUpdateForm 
          initialAuthor={props.initialAuthor}
          disabled={isLoading}
          onUpdate={(author, authorUpdate) => updateAuthor(author.author_id, authorUpdate)}
          id="author-update"
        />
        <p className="text-danger">
          {apiError}
        </p>
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
          type="submit"
          variant="primary"
          disabled={isLoading}
          form="author-update"
        >
          Edit Author
        </Button>
      </Modal.Footer>
    </Modal>
  );
}