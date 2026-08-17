import { Button, Col, Row } from "react-bootstrap";
import { useAppSelector } from "../../hooks/customRedux";
import { useEffect, useState } from "react";
import * as GenreService from "../../API/services/GenreService";
import { Genre } from "../../API/models/Genre";
import { GenreCard } from "../../components/Genre/GenreCard";
import GenreAddModal from "../../components/Genre/Modals/GenreAddModal";
import GenreEditModal from "../../components/Genre/Modals/GenreEditModal";
import { GenreDeleteModal } from "../../components/Genre/Modals/GenreDeleteModal";
import { useCustomPath } from "../useCustomPath";

export function GenresPage() {
    const {gotoGenre} = useCustomPath();

    const user = useAppSelector((state) => state.user);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);

    const [showGenreAddModal, setShowGenreAddModal] = useState<boolean>(false);
    const [genreToEdit, setGenreToEdit] = useState<Genre | null>(null);
    const [genreToDelete, setGenreToDelete] = useState<Genre | null>(null);

    async function fetchGenres(page?: number){
        const genres = await GenreService.getGenres({page})

        setGenres(genres);
    }

    function resetPage(){
        fetchGenres();
    }

    useEffect(() => {
        fetchGenres();
    }, [])

    return (
        <>
            <GenreAddModal 
                onGenreAdded={resetPage}
                onClose={() => setShowGenreAddModal(false)}
                show={showGenreAddModal}
            />

            {
                genreToEdit && (
                    <GenreEditModal 
                        initialGenre={genreToEdit}
                        onClose={() => setGenreToEdit(null)}
                        onGenreEdited={resetPage}
                        show={genreToEdit !== null}
                    />
                )
            }

            {
                genreToDelete && (
                    <GenreDeleteModal
                        genre={genreToDelete}
                        onClose={() => setGenreToDelete(null)}
                        onGenreDeleted={resetPage}
                        show={genreToDelete !== null}
                    />
                )
            }

            {
                user && (
                    <Button
                        className="mb-3"
                        onClick={() => setShowGenreAddModal(true)}
                    >
                        Add New Genre
                    </Button>
                )
            }
            
            <Row xs={1} sm={2} md={3} lg={3} className="g-4">
                {genres.map((genre) => (
                    <Col key={genre.genre_id}>
                        <GenreCard 
                            genre={genre}
                            onView={(genre) => gotoGenre(genre.genre_id)}
                            onDelete={user ? setGenreToDelete: undefined}
                            onEdit={user ? setGenreToEdit : undefined}
                        />
                    </Col>
                ))}
            </Row>
        </>
    );
}

export default GenresPage;