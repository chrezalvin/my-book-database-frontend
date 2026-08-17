import { useState } from "react";
import { PublisherCreate } from "../../../API/schemas/PublisherSchema";
import { Button, Modal } from "react-bootstrap";
import { Publisher } from "../../../API/models/Publisher";
import * as PublisherService from "../../../API/services/PublisherService";
import PublisherCreateForm from "../Form/PublisherCreateForm";
import { AxiosError } from "axios";

export interface PublisherAddModalProps{
  initialPublisher?: PublisherCreate;
  onClose: () => void;
  onPublisherAdded: (newPublisher: Publisher) => void;

  show?: boolean;
}

export default function PublisherAddModal(props: PublisherAddModalProps){
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [apiError, setApiError] = useState<string | null>(null);
    
    async function addPublisher(publisherCreate: PublisherCreate){
      try{
        setIsLoading(true);  

        const newPublisher = await PublisherService.addNewPublisher(publisherCreate);

        props.onPublisherAdded(newPublisher);
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
        show={props.show ?? false} 
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add A New Publisher</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PublisherCreateForm 
            id="publisher-create"
            onCreate={addPublisher}
            initialPublisher={props.initialPublisher ?? {
              publisher: {
                publisher_name: ""
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
            form="publisher-create"
            type="submit"
          >
            Add Publisher
          </Button>
        </Modal.Footer>
      </Modal>
    );
}