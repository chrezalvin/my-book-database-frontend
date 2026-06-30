import { axiosInstance } from "../axiosConfig";
import { Author, AuthorCreate, authorModel, AuthorUpdate } from "../models/Author";

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

    static async addNewAuthor(authorCreate: AuthorCreate): Promise<Author> {
        const res = await axiosInstance.post(`/authors`, authorCreate);

        const parsed = authorModel.parse(res.data);

        return parsed;
    }

    static async editAuthor(author_id: Author["author_id"], authorUpdate: AuthorUpdate): Promise<Author> {
        const res = await axiosInstance.patch(`/authors/${author_id}`, authorUpdate);

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