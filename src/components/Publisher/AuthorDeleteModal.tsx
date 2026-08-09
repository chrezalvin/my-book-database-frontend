import { Button, Modal } from "react-bootstrap";
import { useState } from "react";
import * as PublisherService from "../../API/services/PublisherService";
import { Publisher } from "../../API/models/Publisher";

export interface PublisherDeleteModalProps{
    publisher: Publisher;

    onClose: () => void;
    onPublisherDeleted: (publisher: Publisher) => void;

    show?: boolean;
}

export function PublisherDeleteModal(props: PublisherDeleteModalProps){
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    async function deletePublisher(){
        try{
            setIsLoading(true);
            await PublisherService.deletePublisher(props.publisher.publisher_id);

            props.onPublisherDeleted(props.publisher);
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
                Confirm Delete Publisher {props.publisher.publisher_name}
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete this publisher?
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
                    onClick={deletePublisher} 
                >
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
    )
}