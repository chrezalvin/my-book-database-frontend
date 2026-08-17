import { Badge, Form } from "react-bootstrap";
import { GenreUpdate, updateGenreSchema } from "../../../API/schemas/GenreSchema";
import { SubmitEvent, useState } from "react";
import ArrayInput from "../../ArrayInput";
import z, { treeifyError } from "zod";
import { Genre } from "../../../API/models/Genre";

export interface GenreUpdateFormProps{
  onUpdate: (currentGenre: Genre, genreUpdate: GenreUpdate) => void

  initialGenre: Genre;
  
  disabled?: boolean;
  id?: string;
}

export function GenreUpdateForm(props: GenreUpdateFormProps){
  const [genreUpdate, setGenreUpdate] = useState<GenreUpdate>({});
  const [error, setError] = useState<ReturnType<typeof treeifyError<GenreUpdate>>>()

  const currentGenreUpdate: GenreUpdate = {
    genre: {
      ...props.initialGenre,
      ...genreUpdate.genre, 
    },
    image: genreUpdate.image
  }

  const genreImageUrl: Genre["genre_img"] = genreUpdate.image ? URL.createObjectURL(genreUpdate.image) : props.initialGenre.genre_img

  function handleSubmit(e: SubmitEvent<HTMLFormElement>){
    e.preventDefault();
    e.stopPropagation();

    const {error, data} = updateGenreSchema.safeParse(genreUpdate);

    if(error){
      setError(z.treeifyError(error)); 
      console.log(error);
    }
    
    if(data)
      props.onUpdate(props.initialGenre, data);
  }

  function handleGenreChange<_T extends keyof NonNullable<GenreUpdate["genre"]>>(key: _T, value: NonNullable<GenreUpdate["genre"]>[_T]){
    const newObj: GenreUpdate = {...genreUpdate, genre: {...genreUpdate.genre, [key]: value}};

    setGenreUpdate(newObj);
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
          value={currentGenreUpdate.genre?.genre_name}
          disabled={props.disabled}
          onChange={(e) => handleGenreChange("genre_name", e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formNewGenreDescription">
        <Form.Label>Genre Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          name="newGenreDescription"
          value={currentGenreUpdate.genre?.genre_description ?? ""}
          disabled={props.disabled}
          onChange={(e) => handleGenreChange("genre_description", e.target.value)}
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
        elements={currentGenreUpdate.genre?.genre_aliases ?? []}
        onArrayChange={(aliases) => handleGenreChange("genre_aliases", aliases)}
        title="Genre Aliases"
      />

      <Form.Group className="mb-3">
        <Form.Label>Cover Image</Form.Label>

        {genreImageUrl && (
          <div className="mb-2">
            <img
              src={genreImageUrl}
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
          disabled={props.disabled}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setGenreUpdate({...genreUpdate, image: e.target.files?.[0] ?? undefined});
          }}
        />
      </Form.Group>
    </Form>
  );
}

export default GenreUpdateForm;