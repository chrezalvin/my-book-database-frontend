import { Col, Container, Row, Image, Placeholder } from "react-bootstrap";

export interface CardSimpleProps {
    title?: string;
    description?: string;
    imageUrl?: string;
    defaultImageUrl?: string; // Optional default image URL if imageUrl is not provided

    isLoading?: boolean; // Optional loading state
}

export default function CardSimple(props: CardSimpleProps) {
    return (
        <Container className="py-5">
            <Row className="align-items-center md-align-items-start g-4">
                {/* Left Side: Image Column */}
                <Col xs={12} md={4} className="text-center text-md-start">
                    {
                        props.isLoading ? (
                            <Placeholder 
                                animation="glow" 
                                style={{ width: "200px", height: "200px", borderRadius: "0.25rem" }}
                            />
                        ) : (
                            <Image
                                src={props.imageUrl ?? props.defaultImageUrl}
                                alt={props.imageUrl ? props.title : "Default Image"}
                                rounded // Adds a slight border radius
                                fluid   // Makes it responsive, replacing rigid max-width styles
                                style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "cover" }}
                            />
                        )
                    }
                    
                </Col>
        
                {/* Right Side: Content Column */}
                <Col xs={12} md={8}>
                    {
                        props.isLoading ? (
                            <Placeholder as="h1" animation="glow" className="mb-3 display-5 fw-bold">
                                <Placeholder xs={6} />
                            </Placeholder>
                        ) : (
                            <h1 className="mb-3 display-5 fw-bold">{props.title}</h1>
                        )
                    }
                    {
                        props.isLoading ? (
                            <Placeholder as="p" animation="glow" className="text-muted lh-base">
                                <Placeholder xs={8} />
                            </Placeholder>
                        ) : (
                            <p className="text-muted lh-base">
                                {props.description}
                            </p>
                        )
                    }
                </Col>
            </Row>
        </Container>
    );
}