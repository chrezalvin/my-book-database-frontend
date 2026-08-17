import { useState } from "react";
import { GenreCreate } from "../../../API/schemas/GenreSchema";
import { Button, Modal } from "react-bootstrap";
import { Genre } from "../../../API/models/Genre";
import * as GenreService from "../../../API/services/GenreService";
import GenreCreateForm from "../Form/GenreCreateForm";
import { AxiosError } from "axios";

export interface GenreAddModalProps{
  initialGenre?: GenreCreate;
  onClose: () => void;
  onGenreAdded: (newGenre: Genre) => void;

  show?: boolean;
}

export default function GenreAddModal(props: GenreAddModalProps){
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [apiError, setApiError] = useState<string | null>(null);
    
    async function addGenre(genreCreate: GenreCreate){
      try{
        setIsLoading(true);  

        const newGenre = await GenreService.addNewGenre(genreCreate);

        props.onGenreAdded(newGenre);
        props.onClose();
      }
      catch(error){
        if(error instanceof AxiosError)
          setApiError(error.response?.data.error);
        else{
          console.error("Error adding author:", error);
          setApiError("Unknown error occured!");
        }
      }
      finally{
        setIsLoading(false);
      }
    }

    function handleClose(){
      if(!isLoading)
        props.onClose();
    }

    return (
      <Modal 
        show={props.show ?? false} 
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add A New Genre</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <GenreCreateForm 
            id="genre-create"
            onCreate={addGenre}
            initialGenre={props.initialGenre ?? {
              genre: {
                genre_name: ""
              }
            }}
            isLoading={isLoading}
          />
          <p className="text-danger">
            {apiError}
          </p>
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
            disabled={isLoading}
            form="genre-create"
            type="submit"
          >
            Add Genre
          </Button>
        </Modal.Footer>
      </Modal>
    );
}