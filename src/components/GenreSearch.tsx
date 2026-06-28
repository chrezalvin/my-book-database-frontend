import { useEffect, useState } from "react";
import { Genre } from "../API/models/Genre";
import { GenreService } from "../API/services/GenreService";
import { Button, Form, InputGroup, ListGroup, Spinner } from "react-bootstrap";
import { createGenreSchema } from "../API/schemas/GenreSchema";

export interface GenreSearchProps {
    show?: boolean;
    currentGenres?: Genre[];
    onGenreSelect: (genre: Genre) => void;
}

export default function GenreSearch(props: GenreSearchProps) {
    const [isWaiting, setIsWaiting] = useState(false);
    const [isAddingGenre, setIsAddingGenre] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [genres, setGenres] = useState<Genre[]>([]);

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const newKeyword = e.target.value;
        setKeyword(newKeyword);
    }

    async function addNewGenre(genreName: string) {
        try{
            setIsAddingGenre(true);

            const parsed = createGenreSchema.parse({genre_name: genreName});

            const newGenre = await GenreService.addNewGenre(parsed);

            props.onGenreSelect(newGenre);

            setKeyword("");
        }
        catch(err){
            console.error("Error adding new genre:", err);
        }
        finally{
            setIsAddingGenre(false);
        }
    }

    async function fetchGenres(keyword: string) {
        try{
            const exclude_genre_ids = props.currentGenres?.map(g => g.genre_id) || undefined;
            const foundGenres = await GenreService.getGenres({keyword, exclude_genre_ids});
            setGenres(foundGenres);
        }
        catch(err){
            console.error("Error fetching genres:", err);
        }
        finally{
            setIsWaiting(false);
        }
    }

    // basic debouncing for search
    useEffect(() => {
        setIsWaiting(true);
        const delayDebounceFn = setTimeout(() => {
            fetchGenres(keyword);
        }, 1000);
        return () => clearTimeout(delayDebounceFn);
    }, [keyword]);

    // refetch genre when show prop changes to true
    useEffect(() => {
        if(props.show){
            fetchGenres(keyword);
        }
    }, [props.show]);

    return (
        <div
            className={props.show ? "" : "d-none"}
            style={{ maxWidth: "300px", overflowY: "auto" }}
        >
            <InputGroup className="mb-3">
                <Form.Control
                    placeholder="Search genres..."
                    value={keyword}
                    onChange={handleInputChange}
                    disabled={isAddingGenre}
                />
                {(isAddingGenre || isWaiting) && (
                    <InputGroup.Text>
                      <Spinner animation="border" size="sm" variant="secondary" />
                    </InputGroup.Text>
                )}
                {
                    (genres.length == 0 && keyword.length != 0) && (
                        <Button 
                            type="button"
                            variant="outline-secondary" 
                            id="button-addon2"
                            onClick={() => {addNewGenre(keyword); setKeyword("")}}
                            disabled={isAddingGenre}
                        >
                            Add Genre
                        </Button>
                    )
                }
            </InputGroup>
            {
                (!isAddingGenre && !isWaiting) && (
                    <ListGroup>
                        {genres.map((genre) => (
                            <ListGroup.Item 
                                action
                                type="button"
                                key={genre.genre_id} 
                                onClick={() => props.onGenreSelect(genre)}
                            >
                                {genre.genre_name}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )
            }
        </div>
    )
}