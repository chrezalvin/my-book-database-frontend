import { Badge, Form } from "react-bootstrap";
import { AuthorUpdate, updateAuthorSchema } from "../../../API/schemas/AuthorSchema";
import { SubmitEvent, useState } from "react";
import ArrayInput from "../../ArrayInput";
import z, { treeifyError } from "zod";
import { Author } from "../../../API/models/Author";

export interface AuthorUpdateFormProps{
  onUpdate: (currentAuthor: Author, authorUpdate: AuthorUpdate) => void

  initialAuthor: Author;
  
  disabled?: boolean;
  id?: string;
}

export function AuthorUpdateForm(props: AuthorUpdateFormProps){
  const [authorUpdate, setAuthorUpdate] = useState<AuthorUpdate>({});
  const [error, setError] = useState<ReturnType<typeof treeifyError<AuthorUpdate>>>()

  const currentAuthorUpdate: AuthorUpdate = {
    author: {
      ...props.initialAuthor,
      ...authorUpdate.author, 
    },
    image: authorUpdate.image
  }

  const authorImageUrl: Author["author_img"] = authorUpdate.image ? URL.createObjectURL(authorUpdate.image) : props.initialAuthor.author_img

  function handleSubmit(e: SubmitEvent<HTMLFormElement>){
    e.preventDefault();
    e.stopPropagation();

    const {error, data} = updateAuthorSchema.safeParse(authorUpdate);

    if(error){
      setError(z.treeifyError(error)); 
      console.log(error);
    }
    
    if(data)
      props.onUpdate(props.initialAuthor, data);
  }

  function handleAuthorChange<_T extends keyof NonNullable<AuthorUpdate["author"]>>(key: _T, value: NonNullable<AuthorUpdate["author"]>[_T]){
    const newObj: AuthorUpdate = {...authorUpdate, author: {...authorUpdate.author, [key]: value}};

    setAuthorUpdate(newObj);
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
          value={currentAuthorUpdate.author?.author_name}
          disabled={props.disabled}
          onChange={(e) => handleAuthorChange("author_name", e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formNewAuthorDescription">
        <Form.Label>Author Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          name="newAuthorDescription"
          value={currentAuthorUpdate.author?.author_description ?? ""}
          disabled={props.disabled}
          onChange={(e) => handleAuthorChange("author_description", e.target.value)}
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
        elements={currentAuthorUpdate.author?.author_aliases ?? []}
        onArrayChange={(aliases) => handleAuthorChange("author_aliases", aliases)}
        title="Author Aliases"
      />

      <Form.Group className="mb-3">
        <Form.Label>Cover Image</Form.Label>

        {authorImageUrl && (
          <div className="mb-2">
            <img
              src={authorImageUrl}
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
          disabled={props.disabled}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setAuthorUpdate({...authorUpdate, image: e.target.files?.[0] ?? undefined});
          }}
        />
      </Form.Group>
    </Form>
  );
}

export default AuthorUpdateForm;