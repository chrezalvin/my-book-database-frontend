import { Button, Modal } from "react-bootstrap";
import { Author } from "../../../API/models/Author";
import { useState } from "react";
import * as AuthorService from "../../../API/services/AuthorService";
import { AxiosError } from "axios";

export interface AuthorDeleteModalProps{
    author: Author;

    onClose: () => void;
    onAuthorDeleted: (author: Author) => void;

    show?: boolean;
}

export function AuthorDeleteModal(props: AuthorDeleteModalProps){
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [apiError, setApiError] = useState<string | null>(null);

    async function deleteAuthor(){
        try{
            setIsLoading(true);
            await AuthorService.deleteAuthor(props.author.author_id);

            props.onAuthorDeleted(props.author);
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
            size="lg"
            centered
        >
            <Modal.Header closeButton>
            <Modal.Title>
                Confirm Delete Author {props.author.author_name}
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Are you sure you want to delete this author?</p>
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