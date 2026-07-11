import { axiosInstance } from "../axiosConfig";
import { Author, authorModel } from "../models/Author";
import { AuthorCreate, AuthorUpdate } from "../schemas/AuthorSchema";

export class AuthorService {
    static async searchAuthors(authorName: string): Promise<Author[]> {
        const res = await axiosInstance.get(`/authors`, {
            params: {
                name: authorName,
            }
        });

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

    static async getAuthorById(author_id: Author["author_id"]): Promise<Author> {
        const res = await axiosInstance.get(`/authors/${author_id}`);

        const parsed = authorModel.parse(res.data);

        return parsed;
    }

    static async addNewAuthor(authorCreate: AuthorCreate, authorImg?: File): Promise<Author> {
        const formData = new FormData();
        formData.append("author", JSON.stringify(authorCreate));

        if(authorImg)
            formData.append("image", authorImg);

        const res = await axiosInstance.post(`/authors`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        const parsed = authorModel.parse(res.data);

        return parsed;
    }

    static async editAuthor(
        author_id: Author["author_id"], 
        authorUpdate: AuthorUpdate,
        authorImg?: File
    ): Promise<Author> {
        const formData = new FormData();
        formData.append("author", JSON.stringify(authorUpdate));

        if(authorImg)
            formData.append("image", authorImg);

        const res = await axiosInstance.patch(`/authors/${author_id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        const parsed = authorModel.parse(res.data);

        return parsed;
    }

    static async deleteAuthor(author_id: Author["author_id"]): Promise<boolean> {
        const res = await axiosInstance.delete(`/authors/${author_id}`);

        if(!("success" in res.data))
            throw new Error(`Response data does not contain 'success' field: ${JSON.stringify(res.data)}`);

        return res.data.success;
    }
}