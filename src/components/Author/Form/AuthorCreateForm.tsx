import { Badge, Form } from "react-bootstrap";
import { AuthorCreate, createAuthorSchema } from "../../../API/schemas/AuthorSchema";
import { SubmitEvent, useState } from "react";
import ArrayInput from "../../ArrayInput";
import z, { treeifyError } from "zod";

export interface AuthorCreateFormProps{
  onCreate: (authorCreate: AuthorCreate) => void

  initialAuthor: AuthorCreate;
  isLoading: boolean;

  id?: string;
}

export function AuthorCreateForm(props: AuthorCreateFormProps){
  const [authorCreate, setAuthorCreate] = useState<AuthorCreate>(props.initialAuthor);
  const [error, setError] = useState<ReturnType<typeof treeifyError<AuthorCreate>>>()

  function handleSubmit(e: SubmitEvent<HTMLFormElement>){
    e.preventDefault();
    e.stopPropagation();

    const {error, data} = createAuthorSchema.safeParse(authorCreate);

    if(error)
      setError(z.treeifyError(error)); 
    
    if(data)
      props.onCreate(data);
  }

  function handleAuthorChange<_T extends keyof AuthorCreate["author"]>(key: _T, value: AuthorCreate["author"][_T]){
    const newObj: AuthorCreate = {...authorCreate, author: {...authorCreate.author, [key]: value}};

    setAuthorCreate(newObj);
  }

  return (
    <Form 
      onSubmit={handleSubmit} 
      onKeyDown={(e) => { e.key === 'Enter' && e.preventDefault(); }}
      id={props.id}
    >
      <Form.Group className="mb-3" controlId="formNewAuthorName">
        <Form.Label>Author Name</Form.Label>
        <Form.Control
          name="newAuthorName"
          value={authorCreate.author.author_name}
          disabled={props.isLoading}
          onChange={(e) => handleAuthorChange("author_name", e.target.value)}
        />
        <p className="text-danger">
          {error?.properties?.author?.properties?.author_name?.errors[0]}
        </p>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formNewAuthorDescription">
        <Form.Label>Author Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          name="newAuthorDescription"
          value={authorCreate.author.author_description ?? ""}
          disabled={props.isLoading}
          onChange={(e) => handleAuthorChange("author_description", e.target.value)}
        />
        <p className="text-danger">
          {error?.properties?.author?.properties?.author_description?.errors[0]}
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
        elements={authorCreate.author.author_aliases ?? []}
        onArrayChange={(aliases) => handleAuthorChange("author_aliases", aliases)}
        title="Author Aliases"
      >
        <p className="text-danger">
          {error?.properties?.author?.properties?.author_aliases?.errors[0]}
        </p>
      </ArrayInput>

      <Form.Group className="mb-3">
        <Form.Label>Cover Image</Form.Label>

        {authorCreate.image && (
          <div className="mb-2">
            <img
              src={URL.createObjectURL(authorCreate.image)}
              alt="Author Cover Preview"
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
            setAuthorCreate({...authorCreate, image: e.target.files?.[0] ?? undefined});
          }}
        />
        <p className="text-danger">
          {error?.properties?.image?.errors[0]}
        </p>
      </Form.Group>
    </Form>
  );
}

export default AuthorCreateForm;