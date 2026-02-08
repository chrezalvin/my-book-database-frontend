import { Navbar, Container, Button, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserPublicData } from "../API/models/UserPublicData";

interface HeaderProps {
  user?: UserPublicData | null;
  onGoToLogin?: () => void;
  onLogout?: () => Promise<void>;
  onGoToBooks?: () => void;
}

export default function Header(props: HeaderProps) {
  return (
    <Navbar bg="light" expand="lg" className="shadow-sm" sticky={"top"}>
      <Container>
        {/* Left: Title */}
        <Navbar.Brand onClick={props.onGoToBooks} className="fw-bold">
          📚 Book Collection
        </Navbar.Brand>

        {/* Right */}
        <Nav className="ms-auto align-items-center">
          {!props.user ? (
            <Button
                onClick={props.onGoToLogin}
                variant="outline-primary"
            >
              Login
            </Button>
          ) : (
            <>
              <span className="me-3 text-muted">
                <strong>{props.user.email}</strong>
              </span>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={props.onLogout}
              >
                Logout
              </Button>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}
