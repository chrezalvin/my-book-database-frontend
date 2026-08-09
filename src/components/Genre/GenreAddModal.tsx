import { useEffect, useState } from "react";
import { GenreCreate, createGenreSchema } from "../../API/schemas/GenreSchema";
import { Button, Form, Modal } from "react-bootstrap";
import { Genre } from "../../API/models/Genre";
import * as GenreService from "../../API/services/GenreService";
import { ZodError } from "zod";

export interface GenreAddModalProps{
  initialGenre?: GenreCreate;
  onClose: () => void;
  onGenreAdded: (newGenre: Genre) => void;

  show?: boolean;
}

export default function GenreAddModal(props: GenreAddModalProps){
    const [genreName, setGenreName] = useState<GenreCreate["genre_name"]>("");
    const [genreDescription, setGenreDescription] = useState<GenreCreate["genre_description"]>("");
    const [genreImg, setGenreImg] = useState<File | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [zodError, setZodError] = useState<ZodError | null>();

    async function addGenre(){
      try{
        setIsLoading(true);

        const parsed = createGenreSchema.parse({ 
          genre_name: genreName, 
          genre_description: genreDescription 
        });
        
        const newGenre = await GenreService.addNewGenre(parsed, genreImg ?? undefined);

        props.onGenreAdded(newGenre);
        props.onClose();
      }
      catch(error){
        if(error instanceof ZodError)
          setZodError(error);
        else if(error instanceof Error)
          setApiError(error.message);
        else
          console.error("Error adding genre:", error);
      }
      finally{
        setIsLoading(false);
      }
    }

    function handleClose(){
      if(!isLoading)
        props.onClose();
    }

    useEffect(() => {
      if (props.show) {
        setGenreName(props.initialGenre?.genre_name ?? "");
        setGenreDescription(props.initialGenre?.genre_description ?? "");
      }
    }, [props.show]);

    return (
      <Modal 
        show={props.show ?? false} 
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add A New Genre</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formNewGenreName">
            <Form.Label>Genre Name</Form.Label>
            <Form.Control
              name="newGenreName"
              value={genreName}
              disabled={isLoading}
              onChange={(e) => setGenreName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formNewGenreDescription">
            <Form.Label>Genre Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="newGenreDescription"
              value={genreDescription ?? ""}
              disabled={isLoading}
              onChange={(e) => setGenreDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Cover Image</Form.Label>

            {genreImg && (
              <div className="mb-2">
                <img
                  src={URL.createObjectURL(genreImg)}
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
              disabled={isLoading}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files && e.target.files.length > 0) {
                    setGenreImg(e.target.files[0]);
                } else {
                    setGenreImg(null);
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
            onClick={addGenre}
            disabled={isLoading}
          >
            Add Genre
          </Button>
        </Modal.Footer>
      </Modal>
    );
}