import { Button, Image } from "react-bootstrap";
import { Author } from "../API/models/Author";
import * as AuthorService from "../API/services/AuthorService";
import { SearchBar } from "../components/SearchBar";
import defaultAuthorAvatar from "../placeholders/default-avatar.jpg"
import { useState } from "react";
import AuthorAddModal from "../components/Author/Modals/AuthorAddModal";
import { ImageWithTitle } from "../components/ImageWithTitle";

export function Testing(){
    const [author, setAuthor] = useState<Author | null>(null);
    const [authorModalShow, setAuthorModalShow] = useState<boolean>(false);

    function searchAuthorElement(author: Author){
        return (
            <div
                className="d-flex"
            >
                <div
                    className="me-2 d-flex justify-content-center"
                    style={{
                        height: 40,
                        width: 40,
                    }}
                >
                    <Image
                        src={author.author_img ?? defaultAuthorAvatar}
                        className="mh-100 mw-100"
                    />
                </div>
                <p>{author.author_name}</p>
            </div>
        )
    }

    return (
        <>
            <ImageWithTitle 
                src={author?.author_img ?? ""}
                title={author?.author_name ?? ""}
            />

            <AuthorAddModal 
                onAuthorAdded={setAuthor}
                show={true}
                onClose={() => {setAuthorModalShow(false)}}
            />
            
            <SearchBar 
                element={searchAuthorElement}
                onElementClick={() => {}}
                search={((name) => AuthorService.searchAuthors({name}))}
            >
                <Button
                    onClick={() => setAuthorModalShow(true)}
                >
                    Add New Author
                </Button>
            </SearchBar>
        </>
    )
}

export default Testing;