// pages/LoginPage.tsx
import { FormEvent, useEffect, useState } from "react";
import { Card, Form, Button, Alert, Spinner, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { authenticateUser, getUserData } from "../API/services/Authentication";
import { useAppDispatch } from "../hooks/customRedux";
import { assignUser } from "../store/User";

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkAuthentication() {
        try{
            const userData = await getUserData();
            dispatch(assignUser(userData));
            navigate("/books");
        }
        catch(err){
            // not authenticated, do nothing
        }
    }

    checkAuthentication();
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      setIsLoading(true);

      const isLogin = await authenticateUser(email, password);

      if (!isLogin) 
        throw new Error("Authentication failed");

      const userData = await getUserData();
      dispatch(assignUser(userData));

      navigate("/books");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center flex-column p-3"
      style={{ minHeight: "100vh" }}
    >
      <Card style={{ width: "100%", maxWidth: "400px" }} className="shadow-sm">
        <Card.Body>
          <h4 className="mb-4 text-center">Login</h4>

          {error && (
            <Alert variant="danger">{error}</Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button
              type="submit"
              className="w-100"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    className="me-2"
                  />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </Form>

        </Card.Body>
      </Card>
        <Link 
            to={"/books"}
            className="mt-3 text-center"
            onClick={() => navigate("/books")}
            style={{ cursor: "pointer" }}
        >
            Go to Books Page
        </Link>
    </div>
  );
}

export default LoginPage;
