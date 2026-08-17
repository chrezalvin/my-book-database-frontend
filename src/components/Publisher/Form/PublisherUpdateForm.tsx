import { Badge, Form } from "react-bootstrap";
import { PublisherUpdate, updatePublisherSchema } from "../../../API/schemas/PublisherSchema";
import { SubmitEvent, useState } from "react";
import ArrayInput from "../../ArrayInput";
import z, { treeifyError } from "zod";
import { Publisher } from "../../../API/models/Publisher";

export interface PublisherUpdateFormProps{
  onUpdate: (currentPublisher: Publisher, publisherUpdate: PublisherUpdate) => void

  initialPublisher: Publisher;
  
  disabled?: boolean;
  id?: string;
}

export function PublisherUpdateForm(props: PublisherUpdateFormProps){
  const [publisherUpdate, setPublisherUpdate] = useState<PublisherUpdate>({});
  const [error, setError] = useState<ReturnType<typeof treeifyError<PublisherUpdate>>>()

  const currentPublisherUpdate: PublisherUpdate = {
    publisher: {
      ...props.initialPublisher,
      ...publisherUpdate.publisher, 
    },
    image: publisherUpdate.image
  }

  const publisherImageUrl: Publisher["publisher_img"] = publisherUpdate.image ? URL.createObjectURL(publisherUpdate.image) : props.initialPublisher.publisher_img

  function handleSubmit(e: SubmitEvent<HTMLFormElement>){
    e.preventDefault();
    e.stopPropagation();

    const {error, data} = updatePublisherSchema.safeParse(publisherUpdate);

    if(error){
      setError(z.treeifyError(error)); 
      console.log(error);
    }
    
    if(data)
      props.onUpdate(props.initialPublisher, data);
  }

  function handlePublisherChange<_T extends keyof NonNullable<PublisherUpdate["publisher"]>>(key: _T, value: NonNullable<PublisherUpdate["publisher"]>[_T]){
    const newObj: PublisherUpdate = {...publisherUpdate, publisher: {...publisherUpdate.publisher, [key]: value}};

    setPublisherUpdate(newObj);
  }

  return (
    <Form 
      onSubmit={handleSubmit} 
      onKeyDown={(e) => { e.key === 'Enter' && e.preventDefault(); }}
      id={props.id}
    >
      <Form.Group className="mb-3" controlId="formNewPublisherName">
        <Form.Label>Publisher Name</Form.Label>
        <Form.Control
          name="newPublisherName"
          value={currentPublisherUpdate.publisher?.publisher_name}
          disabled={props.disabled}
          onChange={(e) => handlePublisherChange("publisher_name", e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formNewPublisherDescription">
        <Form.Label>Publisher Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          name="newPublisherDescription"
          value={currentPublisherUpdate.publisher?.publisher_description ?? ""}
          disabled={props.disabled}
          onChange={(e) => handlePublisherChange("publisher_description", e.target.value)}
        />
      </Form.Group>

      <ArrayInput 
        arrToJSX={(aliases, triggerRemove) => (
          <div className="d-flex mb-2 gap-1">
            {
              aliases.map(alias => (
                <Badge
                  bg="secondary"
                  className="d-inline-flex align-items-center py-2"
                  onClick={() => triggerRemove?.(alias)}
                  style={triggerRemove && {
                      cursor: "pointer"
                  }}
                >
                  {alias}
                  <span 
                    className="ms-2"
                  >
                    &times;
                  </span>
                </Badge>
              ))
            }
          </div>
        )}
        elements={currentPublisherUpdate.publisher?.publisher_aliases ?? []}
        onArrayChange={(aliases) => handlePublisherChange("publisher_aliases", aliases)}
        title="Publisher Aliases"
      />

      <Form.Group className="mb-3">
        <Form.Label>Cover Image</Form.Label>

        {publisherImageUrl && (
          <div className="mb-2">
            <img
              src={publisherImageUrl}
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
          disabled={props.disabled}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setPublisherUpdate({...publisherUpdate, image: e.target.files?.[0] ?? undefined});
          }}
        />
      </Form.Group>
    </Form>
  );
}

export default PublisherUpdateForm;