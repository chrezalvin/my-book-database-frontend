import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Genre } from "../../../API/models/Genre";
import { GenreUpdate } from "../../../API/schemas/GenreSchema";
import * as GenreService from "../../../API/services/GenreService";
import GenreUpdateForm from "../Form/GenreUpdateForm";
import { AxiosError } from "axios";

export interface GenreEditModalProps{
  initialGenre: Genre;
  onGenreEdited: (genre: Genre) => void;
  onClose: () => void;

  show?: boolean;
}

export default function GenreEditModal(props: GenreEditModalProps){
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  async function updateGenre(genre_id: Genre["genre_id"], genreUpdate: GenreUpdate){
    try{
      setIsLoading(true);
      setApiError(null);

      const editedGenre = await GenreService.editGenre(genre_id, genreUpdate);
      props.onGenreEdited(editedGenre);
      props.onClose();
    }
    catch(error){
      if(error instanceof AxiosError)
        setApiError(error.response?.data.error);
      else{
        console.error("Error adding genre:", error);
        setApiError("Unknown error occured!");
      }
    }
    finally{
      setIsLoading(false);
    }
  }

  return (
    <Modal 
      show={props.show} 
      onHide={props.onClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit Genre {props.initialGenre.genre_name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <GenreUpdateForm 
          initialGenre={props.initialGenre}
          disabled={isLoading}
          onUpdate={(genre, genreUpdate) => updateGenre(genre.genre_id, genreUpdate)}
          id="genre-update"
        />
        <p className="text-danger">
          {apiError}
        </p>
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
          type="submit"
          variant="primary"
          disabled={isLoading}
          form="genre-update"
        >
          Edit Genre
        </Button>
      </Modal.Footer>
    </Modal>
  );
}