import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Publisher } from "../../../API/models/Publisher";
import { PublisherUpdate } from "../../../API/schemas/PublisherSchema";
import * as PublisherService from "../../../API/services/PublisherService";
import PublisherUpdateForm from "../Form/PublisherUpdateForm";
import { AxiosError } from "axios";

export interface PublisherEditModalProps{
  initialPublisher: Publisher;
  onPublisherEdited?: (publisher: Publisher) => void;
  onClose: () => void;

  show?: boolean;
}

export default function PublisherEditModal(props: PublisherEditModalProps){
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  async function updatePublisher(publisher_id: Publisher["publisher_id"], publisherUpdate: PublisherUpdate){
    try{
      setIsLoading(true);
      setApiError(null);

      const editedPublisher = await PublisherService.editPublisher(publisher_id, publisherUpdate);
      props.onPublisherEdited?.(editedPublisher);
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

  return (
    <Modal 
      show={props.show} 
      onHide={props.onClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit Publisher {props.initialPublisher.publisher_name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <PublisherUpdateForm 
          initialPublisher={props.initialPublisher}
          disabled={isLoading}
          onUpdate={(publisher, publisherUpdate) => updatePublisher(publisher.publisher_id, publisherUpdate)}
          id="publisher-update"
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
          form="publisher-update"
        >
          Edit Publisher
        </Button>
      </Modal.Footer>
    </Modal>
  );
}