import { Button, Modal } from "react-bootstrap";
import { useState } from "react";
import * as GenreService from "../../../API/services/GenreService";
import { AxiosError } from "axios";
import { Genre } from "../../../API/models/Genre";

export interface GenreDeleteModalProps{
    genre: Genre;

    onClose: () => void;
    onGenreDeleted: (genre: Genre) => void;

    show?: boolean;
}

export function GenreDeleteModal(props: GenreDeleteModalProps){
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [apiError, setApiError] = useState<string | null>(null);

    async function deleteGenre(){
        try{
            setIsLoading(true);
            await GenreService.deleteGenre(props.genre.genre_id);

            props.onGenreDeleted(props.genre);
            props.onClose();
        }
        catch(error){
            if(error instanceof AxiosError)
                setApiError(error.response?.data.error);
            else{
                console.error("Error adding genre:", error);
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
                Confirm Delete Genre {props.genre.genre_name}
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Are you sure you want to delete this genre?</p>
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
                    onClick={deleteGenre} 
                >
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
    )
}