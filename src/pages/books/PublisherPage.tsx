import { useNavigate, useParams } from "react-router-dom";
import { Publisher } from "../../API/models/Publisher";
import { useEffect, useState } from "react";
import * as PublisherService from "../../API/services/PublisherService";
import Dashboard from "../Dashboard";
import CardSimple from "../../components/CardSimple";
import defaultImage from "../../placeholders/default-image.jpg";
import { useAppSelector } from "../../hooks/customRedux";
import { Button } from "react-bootstrap";
import PublisherEditModal from "../../components/Publisher/PublisherEditModal";
import { PublisherDeleteModal } from "../../components/Publisher/AuthorDeleteModal";

export function PublisherPage() {
    const user = useAppSelector((state) => state.user);
    const {publisher_id} = useParams<{publisher_id: string}>();
    const navigate = useNavigate();

    const [publisher, setPublisher] = useState<Publisher | null>(null);
    const [isPublisherLoading, setPublisherLoading] = useState<boolean>(true);

    const [showEditPublisherModal, setShowEditPublisherModal] = useState(false);
    const [showDeletePublisherModal, setShowDeletePublisherModal] = useState<boolean>(false);

    async function fetchPublisher(){
        if(!publisher_id)
            return;

        try{
            setPublisherLoading(true);
            const res = await PublisherService.getPublisherById(publisher_id);
            setPublisher(res);
        }
        catch(error){
            console.error("Error fetching publisher:", error);
        }
        finally{
            setPublisherLoading(false);
        }
    }

    useEffect(() => {
        fetchPublisher();
    }, [])

    return(
        <>
            <CardSimple 
                title={publisher?.publisher_name}
                description={publisher?.publisher_description ?? "No description"}
                imageUrl={publisher?.publisher_img ?? undefined}
                defaultImageUrl={defaultImage}
                isLoading={isPublisherLoading}
            />

            {
                user && (
                    <Button
                        onClick={() => setShowEditPublisherModal(true)}
                        variant="primary"
                    >
                        Edit Publisher
                    </Button>
                )
            }
            {
                user && (
                    <Button 
                        className="ms-2"
                        variant="danger"
                        onClick={() => setShowDeletePublisherModal(true)}
                    >
                        Delete Publisher
                    </Button>
                )
            }
            {
                user && (
                    <Button
                        className="ms-2"
                        onClick={() => navigate(`/books/create?publisher_id=${publisher_id}`)}
                        variant="success"
                    >
                        Add book by this publisher
                    </Button>
                )
            }

            <h2 className="text-center my-5">Books by {publisher?.publisher_name}</h2>

            <Dashboard 
                additionalParams={{ publisher_id: publisher_id }}
            />

            {
                publisher && user && (
                    <PublisherEditModal 
                        initialPublisher={publisher}
                        onClose={() => setShowEditPublisherModal(false)}
                        onPublisherEdited={setPublisher}
                        show={showEditPublisherModal}
                    />
                )
            }

            {
                publisher && (
                    <PublisherDeleteModal 
                        publisher={publisher}
                        onPublisherDeleted={() => navigate("/books")}
                        onClose={() => setShowDeletePublisherModal(false)}
                        show={showDeletePublisherModal && user !== null}
                    />
                )
            }

        </>
    )
}

export default PublisherPage;