import { useNavigate, useParams } from "react-router-dom";
import { Author } from "../../API/models/Author";
import { useEffect, useState } from "react";
import { AuthorService } from "../../API/services/AuthorService";
import Dashboard from "../Dashboard";
import CardSimple from "../../components/CardSimple";
import defaultAvatar from "../../placeholders/default-avatar.jpg";
import { Button } from "react-bootstrap";
import AuthorEditModal, { AuthorEdit } from "../../components/Author/AuthorEditModal";
import { useAppSelector } from "../../hooks/customRedux";

export function AuthorPage() {
    const user = useAppSelector((state) => state.user);
    const navigate = useNavigate();

    const {author_id} = useParams<{author_id: string}>();

    const [author, setAuthor] = useState<Author | null>(null);
    const [isAuthorLoading, setAuthorLoading] = useState<boolean>(true);

    const [showEditAuthorModal, setShowEditAuthorModal] = useState(false);
    const [isEditingAuthor, setIsEditingAuthor] = useState(false);

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

    async function handleEditAuthor(updatedAuthor: AuthorEdit){
        if(!author_id)
            return;

        try{
            setIsEditingAuthor(true);
            const newAuthor = await AuthorService.editAuthor(
                author_id, 
                {
                    author_description: updatedAuthor.author_description,
                    author_name: updatedAuthor.author_name
                },
                updatedAuthor.file
            );

            setAuthor(newAuthor);
            setShowEditAuthorModal(false);
        }
        catch(error){
            console.error("Error editing author:", error);
        }
        finally{
            setIsEditingAuthor(false);
        }
    }

    function handleEditAuthorModalOpen(){
        setShowEditAuthorModal(true);
    }

    function handleEditAuthorModalClose(){
        if(!isEditingAuthor)
            setShowEditAuthorModal(false);
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
                        onClick={handleEditAuthorModalOpen}
                    >
                        Edit Author
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
                        onClose={handleEditAuthorModalClose}
                        onEdit={handleEditAuthor}
                        isLoading={isEditingAuthor}
                        show={showEditAuthorModal && user !== null}
                    />
                )
            }
        </>
    );
}