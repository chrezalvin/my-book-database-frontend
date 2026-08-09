import { useNavigate, useParams } from "react-router-dom";
import { Author } from "../../API/models/Author";
import { useEffect, useState } from "react";
import * as AuthorService from "../../API/services/AuthorService";
import Dashboard from "../Dashboard";
import CardSimple from "../../components/CardSimple";
import defaultAvatar from "../../placeholders/default-avatar.jpg";
import { Button } from "react-bootstrap";
import AuthorEditModal from "../../components/Author/AuthorEditModal";
import { useAppSelector } from "../../hooks/customRedux";
import { AuthorDeleteModal } from "../../components/Author/AuthorDeleteModal";

export function AuthorPage() {
    const user = useAppSelector((state) => state.user);
    const navigate = useNavigate();

    const {author_id} = useParams<{author_id: string}>();

    const [author, setAuthor] = useState<Author | null>(null);
    const [isAuthorLoading, setAuthorLoading] = useState<boolean>(true);

    const [showEditAuthorModal, setShowEditAuthorModal] = useState(false);
    const [showDeleteAuthorModal, setShowDeleteAuthorModal] = useState<boolean>(false);

    async function fetchAuthor(){
        if(!author_id)
            return;

        try{
            setAuthorLoading(true);
            const res = await AuthorService.getAuthorById(author_id);
            setAuthor(res);
        }
        catch(error){
            console.error("Error fetching author:", error);
        }
        finally{
            setAuthorLoading(false);
        }
    }

    useEffect(() => {
        fetchAuthor();
    }, [])
    
    return (
        <>
            <CardSimple 
                title={author?.author_name}
                description={author?.author_description ?? "No description"}
                imageUrl={author?.author_img ?? undefined}
                defaultImageUrl={defaultAvatar}
                isLoading={isAuthorLoading}
            />
            {
                user && (
                    <Button 
                        onClick={() => setShowEditAuthorModal(true)}
                    >
                        Edit Author
                    </Button>
                )
            }
            {
                user && (
                    <Button 
                        className="ms-2"
                        variant="danger"
                        onClick={() => setShowDeleteAuthorModal(true)}
                    >
                        Delete Author
                    </Button>
                )
            }
            {
                user && (
                    <Button
                        className="ms-2"
                        variant="success"
                        onClick={() => navigate(`/books/create?author_id=${author_id}`)}
                    >
                        Add book by this author
                    </Button>
                )
            }


            <h2 className="text-center my-5">Books by {author?.author_name}</h2>

            <Dashboard 
                additionalParams={{ author_id: author_id }}
            />

            {
                author && (
                    <AuthorEditModal 
                        initialAuthor={author}
                        onClose={() => setShowEditAuthorModal(false)}
                        onAuthorEdit={setAuthor}
                        show={showEditAuthorModal && user !== null}
                    />
                )
            }
            {
                author && (
                    <AuthorDeleteModal 
                        author={author}
                        onAuthorDeleted={() => navigate("/books")}
                        onClose={() => setShowDeleteAuthorModal(false)}
                        show={showDeleteAuthorModal && user !== null}
                    />
                )
            }
        </>
    );
}

export default AuthorPage;