// components/BookSearch.tsx
import { Form, InputGroup } from "react-bootstrap";

interface BookSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function BookSearch({ value, onChange }: BookSearchProps) {
  return (
    <InputGroup className="mb-3">
      <InputGroup.Text>🔍</InputGroup.Text>
      <Form.Control
        placeholder="Search books..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </InputGroup>
  );
}
