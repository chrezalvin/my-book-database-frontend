import { Badge, Form } from "react-bootstrap";
import { GenreCreate, createGenreSchema } from "../../../API/schemas/GenreSchema";
import { SubmitEvent, useState } from "react";
import ArrayInput from "../../ArrayInput";
import z, { treeifyError } from "zod";

export interface GenreCreateFormProps{
  onCreate: (genreCreate: GenreCreate) => void

  initialGenre: GenreCreate;
  isLoading: boolean;

  id?: string;
}

export function GenreCreateForm(props: GenreCreateFormProps){
  const [genreCreate, setGenreCreate] = useState<GenreCreate>(props.initialGenre);
  const [error, setError] = useState<ReturnType<typeof treeifyError<GenreCreate>>>()

  function handleSubmit(e: SubmitEvent<HTMLFormElement>){
    e.preventDefault();
    e.stopPropagation();

    const {error, data} = createGenreSchema.safeParse(genreCreate);

    if(error)
      setError(z.treeifyError(error)); 
    
    if(data)
      props.onCreate(data);
  }

  function handleGenreChange<_T extends keyof GenreCreate["genre"]>(key: _T, value: GenreCreate["genre"][_T]){
    const newObj: GenreCreate = {...genreCreate, genre: {...genreCreate.genre, [key]: value}};

    setGenreCreate(newObj);
  }

  return (
    <Form 
      onSubmit={handleSubmit} 
      onKeyDown={(e) => { e.key === 'Enter' && e.preventDefault(); }}
      id={props.id}
    >
      <Form.Group className="mb-3" controlId="formNewGenreName">
        <Form.Label>Genre Name</Form.Label>
        <Form.Control
          name="newGenreName"
          value={genreCreate.genre.genre_name}
          disabled={props.isLoading}
          onChange={(e) => handleGenreChange("genre_name", e.target.value)}
        />
        <p className="text-danger">
          {error?.properties?.genre?.properties?.genre_name?.errors[0]}
        </p>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formNewGenreDescription">
        <Form.Label>Genre Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          name="newGenreDescription"
          value={genreCreate.genre.genre_description ?? ""}
          disabled={props.isLoading}
          onChange={(e) => handleGenreChange("genre_description", e.target.value)}
        />
        <p className="text-danger">
          {error?.properties?.genre?.properties?.genre_description?.errors[0]}
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
        elements={genreCreate.genre.genre_aliases ?? []}
        onArrayChange={(aliases) => handleGenreChange("genre_aliases", aliases)}
        title="Genre Aliases"
      >
        <p className="text-danger">
          {error?.properties?.genre?.properties?.genre_aliases?.errors[0]}
        </p>
      </ArrayInput>

      <Form.Group className="mb-3">
        <Form.Label>Cover Image</Form.Label>

        {genreCreate.image && (
          <div className="mb-2">
            <img
              src={URL.createObjectURL(genreCreate.image)}
              alt="Genre Cover Preview"
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
            setGenreCreate({...genreCreate, image: e.target.files?.[0] ?? undefined});
          }}
        />
        <p className="text-danger">
          {error?.properties?.image?.errors[0]}
        </p>
      </Form.Group>
    </Form>
  );
}

export default GenreCreateForm;