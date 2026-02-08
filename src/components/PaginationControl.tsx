import { Button } from "react-bootstrap";

interface PaginationControlsProps {
  currentPage: number;
  isLoading: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export default function PaginationControls(props: PaginationControlsProps) {
  return (
    <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
      <Button
        variant="outline-secondary"
        size="sm"
        disabled={props.currentPage === 0 || props.isLoading}
        onClick={props.onPrevious}
      >
        ‹
      </Button>

      <span className="fw-medium">
        Page {props.currentPage}
      </span>

      <Button
        variant="outline-secondary"
        size="sm"
        disabled={props.isLoading}
        onClick={props.onNext}
      >
        ›
      </Button>
    </div>
  );
}
