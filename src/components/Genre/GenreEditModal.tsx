import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { Genre } from "../../API/models/Genre";
import { GenreUpdate, updateGenreSchema } from "../../API/schemas/GenreSchema";
import * as GenreService from "../../API/services/GenreService";

export interface GenreEditModalProps{
  initialGenre: Genre;
  onGenreEdit: (genre: Genre) => void;
  onClose: () => void;

  show?: boolean;
}

export default function GenreEditModal(props: GenreEditModalProps){
    const [genreName, setGenreName] = useState<GenreUpdate["genre_name"] | undefined>(undefined);
    const [genreDescription, setGenreDescription] = useState<GenreUpdate["genre_description"] | undefined>(undefined);
    const [genreImg, setGenreImg] = useState<File | null | undefined>(undefined);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function updateGenre(){
        try{
          setIsLoading(true);

          const parsed = updateGenreSchema.parse({ 
            genre_name: genreName, 
            genre_description: genreDescription 
          });

          const editedGenre = await GenreService.editGenre(props.initialGenre.genre_id, parsed, genreImg ?? undefined);
          props.onGenreEdit(editedGenre);
          props.onClose();
        }
        catch(error){
          console.error("Error updating genre:", error);
        }
        finally{
          setIsLoading(false);
        }
    }

    function handleReset(){
      setGenreName(undefined);
      setGenreDescription(undefined);
      setGenreImg(undefined);
    }

    return (
      <Modal 
        show={props.show ?? false} 
        onHide={props.onClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Genre {props.initialGenre.genre_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formNewGenreName">
            <Form.Label>Genre Name</Form.Label>
            <Form.Control
              name="newGenreName"
              disabled={isLoading}
              value={genreName ?? props.initialGenre.genre_name}
              onChange={(e) => setGenreName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formNewGenreDescription">
            <Form.Label>Genre Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="newGenreDescription"
              disabled={isLoading}
              value={genreDescription ?? props.initialGenre.genre_description ?? ""}
              onChange={(e) => setGenreDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Cover Image</Form.Label>

            <div className="mb-2">
              <img
                src={genreImg ? URL.createObjectURL(genreImg) : props.initialGenre.genre_img ?? ""}
                alt="Genre Cover Preview"
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
                    setGenreImg(e.target.files[0]);
                } else {
                    setGenreImg(undefined);
                }
                }}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={props.onClose}
            disabled={isLoading}
          >
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={updateGenre}
            disabled={isLoading}
          >
            Edit Genre
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