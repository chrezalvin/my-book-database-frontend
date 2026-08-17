import { Button, Col, Row } from "react-bootstrap";
import { useAppSelector } from "../../hooks/customRedux";
import { useEffect, useState } from "react";
import * as PublisherService from "../../API/services/PublisherService";
import { Publisher } from "../../API/models/Publisher";
import { PublisherCard } from "../../components/Publisher/PublisherCard";
import PublisherAddModal from "../../components/Publisher/Modals/PublisherAddModal";
import PublisherEditModal from "../../components/Publisher/Modals/PublisherEditModal";
import { PublisherDeleteModal } from "../../components/Publisher/Modals/PublisherDeleteModal";
import { useCustomPath } from "../useCustomPath";


export function PublishersPage() {
    const user = useAppSelector((state) => state.user);
    const {gotoPublisher} = useCustomPath();

    const [publishers, setPublishers] = useState<Publisher[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);

    const [showPublisherAddModal, setShowPublisherAddModal] = useState<boolean>(false);
    const [publisherToEdit, setPublisherToEdit] = useState<Publisher | null>(null);
    const [publisherToDelete, setPublisherToDelete] = useState<Publisher | null>(null);

    async function fetchPublishers(page?: number){
        const publishers = await PublisherService.getPublishers({page})

        setPublishers(publishers);
    }

    function resetPage(){
        fetchPublishers();
    }

    useEffect(() => {
        fetchPublishers();
    }, [])

    return (
        <>
            <PublisherAddModal 
                onPublisherAdded={(_) => fetchPublishers()}
                onClose={() => setShowPublisherAddModal(false)}
                show={showPublisherAddModal}
            />

            {
                publisherToEdit && (
                    <PublisherEditModal 
                        initialPublisher={publisherToEdit}
                        onClose={() => setPublisherToEdit(null)}
                        onPublisherEdited={resetPage}
                        show={publisherToEdit !== null}
                    />
                )
            }

            {
                publisherToDelete && (
                    <PublisherDeleteModal
                        publisher={publisherToDelete}
                        onClose={() => setPublisherToDelete(null)}
                        onPublisherDeleted={resetPage}
                        show={publisherToDelete !== null}
                    />
                )
            }

            {
                user && (
                    <Button
                        className="mb-3"
                        onClick={() => setShowPublisherAddModal(true)}
                    >
                        Add New Publisher
                    </Button>
                )
            }
            
            <Row xs={1} sm={2} md={3} lg={3} className="g-4">
                {publishers.map((publisher) => (
                    <Col key={publisher.publisher_id}>
                        <PublisherCard 
                            publisher={publisher}
                            onView={(publisher) => gotoPublisher(publisher.publisher_id)}
                            onEdit={user ?  setPublisherToEdit : undefined}
                            onDelete={user ? setPublisherToDelete : undefined}
                        />
                    </Col>
                ))}
            </Row>
        </>
    );
}

export default PublishersPage;