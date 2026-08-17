import { useState } from "react";
import { AuthorCreate } from "../../../API/schemas/AuthorSchema";
import { Button, Modal } from "react-bootstrap";
import { Author } from "../../../API/models/Author";
import * as AuthorService from "../../../API/services/AuthorService";
import AuthorCreateForm from "../Form/AuthorCreateForm";
import { AxiosError } from "axios";

export interface AuthorAddModalProps{
  initialAuthor?: AuthorCreate;
  onClose: () => void;
  onAuthorAdded: (newAuthor: Author) => void;

  show?: boolean;
}

export default function AuthorAddModal(props: AuthorAddModalProps){
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [apiError, setApiError] = useState<string | null>(null);

    async function addAuthor(authorCreate: AuthorCreate){
      try{
        setIsLoading(true);
        
        const newAuthor = await AuthorService.addNewAuthor(authorCreate);

        props.onAuthorAdded(newAuthor);
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

    function handleClose(){
      if(!isLoading)
        props.onClose();
    }

    return (
      <Modal 
        show={props.show}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add A New Author</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AuthorCreateForm 
            id="author-create"
            onCreate={addAuthor}
            initialAuthor={props.initialAuthor ?? {
              author: {
                author_name: ""
              }
            }}
            isLoading={isLoading}
          />
          <p className="text-danger">
            {apiError}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={handleClose}
            disabled={isLoading}
          >
            Close
          </Button>
          <Button 
            variant="primary" 
            disabled={isLoading}
            type="submit"
            form="author-create"
          >
            Add Author
          </Button>
        </Modal.Footer>
      </Modal>
    );
}