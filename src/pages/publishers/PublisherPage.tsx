import { useParams } from "react-router-dom";
import { Publisher } from "../../API/models/Publisher";
import { useEffect, useState } from "react";
import * as PublisherService from "../../API/services/PublisherService";
import Dashboard from "../Dashboard";
import CardSimple from "../../components/CardSimple";
import defaultImage from "../../placeholders/default-image.jpg";
import { useAppSelector } from "../../hooks/customRedux";
import { Button } from "react-bootstrap";
import PublisherEditModal from "../../components/Publisher/Modals/PublisherEditModal";
import { PublisherDeleteModal } from "../../components/Publisher/Modals/PublisherDeleteModal";
import { useCustomPath } from "../useCustomPath";

export function PublisherPage() {
    const user = useAppSelector((state) => state.user);
    
    const {publisher_id} = useParams<{publisher_id: string}>();
    const {gotoBooks, gotoBooksCreate} = useCustomPath();

    const [publisher, setPublisher] = useState<Publisher | null>(null);

    const [publisherToEdit, setPublisherToEdit] = useState<Publisher | null>(null);
    const [publisherToDelete, setPublisherToDelete] = useState<Publisher | null>(null);

    async function fetchPublisher(){
        if(!publisher_id)
            return;

        try{
            setPublisher(null);
            const res = await PublisherService.getPublisherById(publisher_id);
            setPublisher(res);
        }
        catch(error){
            console.error("Error fetching publisher:", error);
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
                isLoading={publisher !== null}
            />

            {
                user && (
                    <Button
                        onClick={() => setPublisherToEdit(publisher)}
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
                        onClick={() => setPublisherToDelete(publisher)}
                    >
                        Delete Publisher
                    </Button>
                )
            }
            {
                user && (
                    <Button
                        className="ms-2"
                        onClick={() => gotoBooksCreate({publisher_id})}
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
                publisherToEdit && (
                    <PublisherEditModal 
                        initialPublisher={publisherToEdit}
                        onClose={() => setPublisherToEdit(null)}
                        onPublisherEdited={setPublisher}
                        show={publisherToEdit !== null}
                    />
                )
            }

            {
                publisherToDelete && (
                    <PublisherDeleteModal 
                        publisher={publisherToDelete}
                        onPublisherDeleted={() => gotoBooks()}
                        onClose={() => setPublisherToDelete(null)}
                        show={publisherToDelete !== null}
                    />
                )
            }

        </>
    )
}

export default PublisherPage;