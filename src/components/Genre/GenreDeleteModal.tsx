import { Button, Modal } from "react-bootstrap";
import { Genre } from "../../API/models/Genre";
import { useState } from "react";
import * as GenreService from "../../API/services/GenreService";

export interface GenreDeleteModalProps{
    genre: Genre;

    onClose: () => void;
    onGenreDeleted: (genre: Genre) => void;

    show?: boolean;
}

export function GenreDeleteModal(props: GenreDeleteModalProps){
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    async function deleteGenre(){
        try{
            setIsLoading(true);
            await GenreService.deleteGenre(props.genre.genre_id);

            props.onGenreDeleted(props.genre);
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
                Confirm Delete Genre {props.genre.genre_name}
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete this genre? Deleting the genre also deletes all associated genre from the books
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