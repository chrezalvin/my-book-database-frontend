import { axiosInstance } from "../axiosConfig";
import { Author, authorModel } from "../models/Author";
import { AuthorCreate, AuthorUpdate } from "../schemas/AuthorSchema";

export async function searchAuthors(params?: {name?: string, page?: number}): Promise<Author[]> {
const res = await axiosInstance.get(`/authors`, {params});

    const data = res.data as unknown;

    if(!Array.isArray(data))
        throw new Error(`Response data is not an array: ${JSON.stringify(data)}`);

    const authors: Author[] = [];
    for(const item of data){
        const parsed = authorModel.parse(item);

        authors.push(parsed);
    }

    return authors;
}

export async function getAuthorById(author_id: Author["author_id"]): Promise<Author> {
    const res = await axiosInstance.get(`/authors/${author_id}`);

    const parsed = authorModel.parse(res.data);

    return parsed;
} 

export async function addNewAuthor(authorCreate: AuthorCreate): Promise<Author> {
    const formData = new FormData();

    formData.append("author", JSON.stringify(authorCreate.author));

    if(authorCreate.image)
        formData.append("image", authorCreate.image);

    const res = await axiosInstance.post(`/authors`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    const parsed = authorModel.parse(res.data);

    return parsed;
}

export async function editAuthor(
    author_id: Author["author_id"], 
    authorUpdate: AuthorUpdate,
): Promise<Author> {
    const formData = new FormData();
    formData.append("author", JSON.stringify(authorUpdate.author));

    if(authorUpdate.image)
        formData.append("image", authorUpdate.image);

    const res = await axiosInstance.patch(`/authors/${author_id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    const parsed = authorModel.parse(res.data);

    return parsed;
}

export async function deleteAuthor(author_id: Author["author_id"]): Promise<true> {
    await axiosInstance.delete(`/authors/${author_id}`);

    return true;
}