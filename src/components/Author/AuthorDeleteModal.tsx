import { Button, Modal } from "react-bootstrap";
import { Author } from "../../API/models/Author";
import { useState } from "react";
import * as AuthorService from "../../API/services/AuthorService";

export interface AuthorDeleteModalProps{
    author: Author;

    onClose: () => void;
    onAuthorDeleted: (author: Author) => void;

    show?: boolean;
}

export function AuthorDeleteModal(props: AuthorDeleteModalProps){
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    async function deleteAuthor(){
        try{
            setIsLoading(true);
            await AuthorService.deleteAuthor(props.author.author_id);

            props.onAuthorDeleted(props.author);
            props.onClose();
        }
        catch(err){
            if(err instanceof Error)
                setError(err.message);
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
            size="lg"
            centered
        >
            <Modal.Header closeButton>
            <Modal.Title>
                Confirm Delete Author {props.author.author_name}
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete this author?
            </Modal.Body>
            <Modal.Footer>
                <Button 
                    variant="secondary" 
                    onClick={handleClose}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button 
                    variant="danger" 
                    disabled={isLoading}
                    onClick={deleteAuthor} 
                >
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
    )
}