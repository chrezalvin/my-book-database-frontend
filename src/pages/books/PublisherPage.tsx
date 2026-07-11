import { useNavigate, useParams } from "react-router-dom";
import { Publisher } from "../../API/models/Publisher";
import { useEffect, useState } from "react";
import { PublisherService } from "../../API/services/PublisherService";
import Dashboard from "../Dashboard";
import CardSimple from "../../components/CardSimple";
import defaultImage from "../../placeholders/default-image.jpg";
import { useAppSelector } from "../../hooks/customRedux";
import { Button } from "react-bootstrap";
import PublisherEditModal, { PublisherEdit } from "../../components/Publisher/PublisherEditModal";

export function PublisherPage() {
    const user = useAppSelector((state) => state.user);
    const {publisher_id} = useParams<{publisher_id: string}>();
    const navigate = useNavigate();

    const [publisher, setPublisher] = useState<Publisher | null>(null);
    const [isPublisherLoading, setPublisherLoading] = useState<boolean>(true);

    const [showEditPublisherModal, setShowEditPublisherModal] = useState(false);
    const [isEditingPublisher, setIsEditingPublisher] = useState(false);

    async function fetchPublisher(){
        if(!publisher_id)
            return;

        try{
            setPublisherLoading(true);
            const res = await PublisherService.getPublisherById(publisher_id);
            setPublisher(res);
        }
        catch(error){
            console.error("Error fetching author:", error);
        }
        finally{
            setPublisherLoading(false);
        }
    }

    async function editPublisher(publisherData: PublisherEdit){
        if(!publisher_id)
            return;

        try{
            setIsEditingPublisher(true);
            const newPublisher = await PublisherService.editPublisher(
                publisher_id, 
                {
                    publisher_description: publisherData.publisher_description,
                    publisher_name: publisherData.publisher_name
                },
                publisherData.file
            );

            setPublisher(newPublisher);
            setShowEditPublisherModal(false);
        }
        catch(error){
            console.error("Error editing publisher:", error);
        }
        finally{
            setIsEditingPublisher(false);
        }
    }

    function handleEditPublisherModalOpen(){
        setShowEditPublisherModal(true);
    }

    function handleEditPublisherModalClose(){
        if (!isEditingPublisher)
            setShowEditPublisherModal(false);
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
                        onClick={handleEditPublisherModalOpen}
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
                        onClose={handleEditPublisherModalClose}
                        onEdit={editPublisher}
                        isLoading={isEditingPublisher}
                        show={showEditPublisherModal}
                    />
                )
            }

        </>
    )
}