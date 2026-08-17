import { Badge, Form } from "react-bootstrap";
import { PublisherCreate, createPublisherSchema } from "../../../API/schemas/PublisherSchema";
import { SubmitEvent, useState } from "react";
import ArrayInput from "../../ArrayInput";
import z, { treeifyError } from "zod";

export interface PublisherCreateFormProps{
  onCreate: (publisherCreate: PublisherCreate) => void

  initialPublisher: PublisherCreate;
  isLoading: boolean;

  id?: string;
}

export function PublisherCreateForm(props: PublisherCreateFormProps){
  const [publisherCreate, setPublisherCreate] = useState<PublisherCreate>(props.initialPublisher);
  const [error, setError] = useState<ReturnType<typeof treeifyError<PublisherCreate>>>()

  function handleSubmit(e: SubmitEvent<HTMLFormElement>){
    e.preventDefault();
    e.stopPropagation();

    const {error, data} = createPublisherSchema.safeParse(publisherCreate);

    if(error)
      setError(z.treeifyError(error)); 
    
    if(data)
      props.onCreate(data);
  }

  function handlePublisherChange<_T extends keyof PublisherCreate["publisher"]>(key: _T, value: PublisherCreate["publisher"][_T]){
    const newObj: PublisherCreate = {...publisherCreate, publisher: {...publisherCreate.publisher, [key]: value}};

    setPublisherCreate(newObj);
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
          value={publisherCreate.publisher.publisher_name}
          disabled={props.isLoading}
          onChange={(e) => handlePublisherChange("publisher_name", e.target.value)}
        />
        <p className="text-danger">
          {error?.properties?.publisher?.properties?.publisher_name?.errors[0]}
        </p>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formNewPublisherDescription">
        <Form.Label>Publisher Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          name="newPublisherDescription"
          value={publisherCreate.publisher.publisher_description ?? ""}
          disabled={props.isLoading}
          onChange={(e) => handlePublisherChange("publisher_description", e.target.value)}
        />
        <p className="text-danger">
          {error?.properties?.publisher?.properties?.publisher_description?.errors[0]}
        </p>
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
        elements={publisherCreate.publisher.publisher_aliases ?? []}
        onArrayChange={(aliases) => handlePublisherChange("publisher_aliases", aliases)}
        title="Publisher Aliases"
      >
        <p className="text-danger">
          {error?.properties?.publisher?.properties?.publisher_aliases?.errors[0]}
        </p>
      </ArrayInput>

      <Form.Group className="mb-3">
        <Form.Label>Cover Image</Form.Label>

        {publisherCreate.image && (
          <div className="mb-2">
            <img
              src={URL.createObjectURL(publisherCreate.image)}
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
          disabled={props.isLoading}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setPublisherCreate({...publisherCreate, image: e.target.files?.[0]});
          }}
        />
        <p className="text-danger">
          {error?.properties?.image?.errors[0]}
        </p>
      </Form.Group>
    </Form>
  );
}

export default PublisherCreateForm;