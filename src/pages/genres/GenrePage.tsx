import { useParams } from "react-router-dom";
import { Genre } from "../../API/models/Genre";
import { useEffect, useState } from "react";
import * as GenreService from "../../API/services/GenreService";
import Dashboard from "../Dashboard";
import CardSimple from "../../components/CardSimple";
import defaultAvatar from "../../placeholders/default-avatar.jpg";
import { Button } from "react-bootstrap";
import GenreEditModal from "../../components/Genre/Modals/GenreEditModal";
import { useAppSelector } from "../../hooks/customRedux";
import { GenreDeleteModal } from "../../components/Genre/Modals/GenreDeleteModal";
import { useCustomPath } from "../useCustomPath";

export function GenreBookPage() {
    const user = useAppSelector((state) => state.user);
    const {gotoBooksCreate,gotoBooks} = useCustomPath();

    const {genre_id} = useParams<{genre_id: string}>();

    const [genre, setGenre] = useState<Genre | null>(null);

    const [showEditGenreModal, setShowEditGenreModal] = useState(false);
    const [showDeleteGenreModal, setShowDeleteGenreModal] = useState<boolean>(false);

    async function fetchGenre(){
        if(!genre_id)
            return;

        try{
            setGenre(null);
            const res = await GenreService.getGenre(genre_id);
            setGenre(res);
        }
        catch(error){
            console.error("Error fetching genre:", error);
        }
    }

    useEffect(() => {
        fetchGenre();
    }, [])
    
    return (
        <>
            <CardSimple 
                title={genre?.genre_name}
                description={genre?.genre_description ?? "No description"}
                imageUrl={genre?.genre_img ?? undefined}
                defaultImageUrl={defaultAvatar}
                isLoading={genre !== null}
            />
            {
                user && (
                    <Button 
                        onClick={() => setShowEditGenreModal(true)}
                    >
                        Edit Genre
                    </Button>
                )
            }
            {
                user && (
                    <Button 
                        className="ms-2"
                        variant="danger"
                        onClick={() => setShowDeleteGenreModal(true)}
                    >
                        Delete Genre
                    </Button>
                )
            }
            {
                user && (
                    <Button
                        className="ms-2"
                        variant="success"
                        onClick={() => gotoBooksCreate({genre_id})}
                    >
                        Add book with this genre
                    </Button>
                )
            }


            <h2 className="text-center my-5">Books with genre {genre?.genre_name}</h2>

            <Dashboard 
                additionalParams={{ genre_id: genre_id }}
            />

            {
                genre && (
                    <GenreEditModal 
                        initialGenre={genre}
                        onClose={() => setShowEditGenreModal(false)}
                        onGenreEdited={setGenre}
                        show={showEditGenreModal && user !== null}
                    />
                )
            }

            {
                genre && (
                    <GenreDeleteModal 
                        genre={genre}
                        onGenreDeleted={() => gotoBooks()}
                        onClose={() => setShowDeleteGenreModal(false)}
                        show={showDeleteGenreModal && user !== null}
                    />
                )
            }
        </>
    );
}

export default GenreBookPage;