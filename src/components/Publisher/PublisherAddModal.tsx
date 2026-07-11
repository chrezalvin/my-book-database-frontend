import { useEffect, useState } from "react";
import { PublisherCreate, createPublisherSchema } from "../../API/schemas/PublisherSchema";
import { Button, Form, Modal } from "react-bootstrap";

export interface PublisherCreateAdd extends PublisherCreate{
    file?: File;
}

export interface PublisherAddModalProps{
    initialPublisher?: PublisherCreate;
    onAdd: (publisher: PublisherCreateAdd) => void;
    onClose: () => void;

    show?: boolean;
    isLoading?: boolean;
}

export default function PublisherAddModal(props: PublisherAddModalProps){
    const [publisherName, setPublisherName] = useState<PublisherCreate["publisher_name"]>("");
    const [publisherDescription, setPublisherDescription] = useState<PublisherCreate["publisher_description"]>("");
    const [publisherImg, setPublisherImg] = useState<File | null>(null);

    function addPublisher(){
        try{
            const parsed = createPublisherSchema.parse({ 
                publisher_name: publisherName, 
                publisher_description: publisherDescription 
            });
    
            props.onAdd({...parsed, file: publisherImg ?? undefined});
        }
        catch(error){
            console.error("Error adding publisher:", error);
        }
    }

    useEffect(() => {
        if (props.show) {
            setPublisherName(props.initialPublisher?.publisher_name ?? "");
            setPublisherDescription(props.initialPublisher?.publisher_description ?? "");
        }
    }, [props.show]);

    return (
      <Modal 
        show={props.show ?? false} 
        onHide={props.onClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add A New Publisher</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formNewPublisherName">
            <Form.Label>Publisher Name</Form.Label>
            <Form.Control
              name="newPublisherName"
              value={publisherName}
              onChange={(e) => setPublisherName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formNewPublisherDescription">
            <Form.Label>Publisher Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="newPublisherDescription"
              value={publisherDescription ?? ""}
              onChange={(e) => setPublisherDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Cover Image</Form.Label>

            {publisherImg && (
              <div className="mb-2">
                <img
                  src={URL.createObjectURL(publisherImg)}
                  alt="Publisher Cover Preview"
                  style={{
                    height: "120px",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}

            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files && e.target.files.length > 0) {
                    setPublisherImg(e.target.files[0]);
                } else {
                    setPublisherImg(null);
                }
                }}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={props.onClose}
            disabled={props.isLoading}
          >
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={addPublisher}
            disabled={props.isLoading}
          >
            Add Publisher
          </Button>
        </Modal.Footer>
      </Modal>
    );
}