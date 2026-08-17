import { Button, Modal } from "react-bootstrap";
import { useState } from "react";
import * as PublisherService from "../../../API/services/PublisherService";
import { AxiosError } from "axios";
import { Publisher } from "../../../API/models/Publisher";

export interface PublisherDeleteModalProps{
    publisher: Publisher;

    onClose: () => void;
    onPublisherDeleted: (publisher: Publisher) => void;

    show?: boolean;
}

export function PublisherDeleteModal(props: PublisherDeleteModalProps){
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [apiError, setApiError] = useState<string | null>(null);

    async function deletePublisher(){
        try{
            setIsLoading(true);
            await PublisherService.deletePublisher(props.publisher.publisher_id);

            props.onPublisherDeleted(props.publisher);
            props.onClose();
        }
        catch(error){
            if(error instanceof AxiosError)
                setApiError(error.response?.data.error);
            else{
                console.error("Error adding publisher:", error);
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
                Confirm Delete Publisher {props.publisher.publisher_name}
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Are you sure you want to delete this publisher?</p>
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
                    onClick={deletePublisher} 
                >
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
    )
}