import { Button, Col, Row } from "react-bootstrap";
import { useAppSelector } from "../../hooks/customRedux";
import { useEffect, useState } from "react";
import * as AuthorService from "../../API/services/AuthorService";
import { Author } from "../../API/models/Author";
import {AuthorCard} from "../../components/Author/AuthorCard";
import AuthorAddModal from "../../components/Author/Modals/AuthorAddModal";
import AuthorEditModal from "../../components/Author/Modals/AuthorEditModal";
import { AuthorDeleteModal } from "../../components/Author/Modals/AuthorDeleteModal";
import { useCustomPath } from "../useCustomPath";


export function AuthorsPage() {
    const {gotoAuthor} = useCustomPath();

    const user = useAppSelector((state) => state.user);
    const [authors, setAuthors] = useState<Author[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);

    const [showAuthorAddModal, setShowAuthorAddModal] = useState<boolean>(false);
    const [authorToEdit, setAuthorToEdit] = useState<Author | null>(null);
    const [authorToDelete, setAuthorToDelete] = useState<Author | null>(null);

    async function fetchAuthors(page?: number){
        const authors = await AuthorService.searchAuthors({page});

        setAuthors(authors);
    }

    function resetPage(){
        fetchAuthors();
    }

    useEffect(() => {
        fetchAuthors();
    }, [])

    return (
        <>
            <AuthorAddModal 
                onAuthorAdded={resetPage}
                onClose={() => setShowAuthorAddModal(false)}
                show={showAuthorAddModal}
            />

            {
                authorToEdit && (
                    <AuthorEditModal 
                        initialAuthor={authorToEdit}
                        onClose={() => setAuthorToEdit(null)}
                        onAuthorEdited={resetPage}
                        show={authorToEdit !== null}
                    />
                )
            }

            {
                authorToDelete && (
                    <AuthorDeleteModal
                        author={authorToDelete}
                        onClose={() => setAuthorToDelete(null)}
                        onAuthorDeleted={resetPage}
                        show={authorToDelete !== null}
                    />
                )
            }

            {
                user && (
                    <Button
                        className="mb-3"
                        onClick={() => setShowAuthorAddModal(true)}
                    >
                        Add New Author
                    </Button>
                )
            }
            
            <Row xs={1} sm={2} md={3} lg={3} className="g-4">
                {authors.map((author) => (
                    <Col key={author.author_id}>
                        <AuthorCard 
                            author={author}
                            onView={(author) => gotoAuthor(author.author_id)}
                            onDelete={user ? setAuthorToDelete : undefined}
                            onEdit={user? setAuthorToEdit: undefined}
                        />
                    </Col>
                ))}
            </Row>
        </>
    );
}

export default AuthorsPage;