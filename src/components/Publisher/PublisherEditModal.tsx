import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { Publisher } from "../../API/models/Publisher";
import { PublisherUpdate, updatePublisherSchema } from "../../API/schemas/PublisherSchema";
import * as PublisherService from "../../API/services/PublisherService";

export interface PublisherAddModalProps{
    initialPublisher: Publisher;
    onPublisherEdited: (publisher: Publisher) => void;
    onClose: () => void;

    show?: boolean;
}

export default function PublisherEditModal(props: PublisherAddModalProps){
    const [publisherName, setPublisherName] = useState<PublisherUpdate["publisher_name"] | undefined>(undefined);
    const [publisherDescription, setPublisherDescription] = useState<PublisherUpdate["publisher_description"] | undefined>(undefined);
    const [publisherImg, setPublisherImg] = useState<File | null | undefined>(undefined);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function updatePublisher(){
        try{
          setIsLoading(true);

          const parsed = updatePublisherSchema.parse({ 
              publisher_name: publisherName, 
              publisher_description: publisherDescription 
          });
          
          const editedPublisher = await PublisherService.editPublisher(props.initialPublisher.publisher_id, parsed, publisherImg ?? undefined);

          props.onPublisherEdited(editedPublisher);
        }
        catch(error){
            console.error("Error updating publisher:", error);
        }
        finally{
          setIsLoading(false);
        }
    }

    function handleClose(){
      if(!isLoading)
        props.onClose();
    }

    function handleReset(){
        setPublisherName(undefined);
        setPublisherDescription(undefined);
        setPublisherImg(undefined);
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
          <Form.Group className="mb-3" controlId="formNewPublisherName">
            <Form.Label>Publisher Name</Form.Label>
            <Form.Control
              name="newPublisherName"
              disabled={isLoading}
              onChange={(e) => setPublisherName(e.target.value)}
              value={publisherName ?? props.initialPublisher.publisher_name}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formNewPublisherDescription">
            <Form.Label>Publisher Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="newPublisherDescription"
              disabled={isLoading}
              onChange={(e) => setPublisherDescription(e.target.value)}
              value={publisherDescription ?? props.initialPublisher.publisher_description ?? ""}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Cover Image</Form.Label>

            <div className="mb-2">
              <img
                src={publisherImg ? URL.createObjectURL(publisherImg) : props.initialPublisher.publisher_img ?? ""}
                alt="Publisher Cover Preview"
                style={{
                  height: "120px",
                  objectFit: "cover",
                }}
              />
            </div>

            <Form.Control
              type="file"
              accept="image/*"
              disabled={isLoading}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files && e.target.files.length > 0) {
                    setPublisherImg(e.target.files[0]);
                } else {
                    setPublisherImg(undefined);
                }
                }}
            />
          </Form.Group>
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
            onClick={updatePublisher}
            disabled={isLoading}
          >
            Edit Publisher
          </Button>
          <Button
            variant="warning"
            onClick={handleReset}
            disabled={isLoading}
          >
            Reset
          </Button>
        </Modal.Footer>
      </Modal>
    );
}