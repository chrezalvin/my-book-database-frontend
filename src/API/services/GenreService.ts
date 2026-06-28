import { axiosInstance } from "../axiosConfig";
import { Genre, genreModel } from "../models/Genre";
import { CreateGenre, UpdateGenre } from "../schemas/GenreSchema";

export class GenreService {
    static async getGenres(options: {keyword?: string, exclude_genre_ids?: string[]}): Promise<Genre[]> {
        const params: Record<string, string> = {};

        if(options.keyword)
            params.keyword = options.keyword;

        if(options.exclude_genre_ids && options.exclude_genre_ids.length > 0)
            params.exclude_genre_ids = options.exclude_genre_ids.join(",");

        const res = await axiosInstance.get(`/genres`, { params });

        const data = res.data as unknown;

        if(!Array.isArray(data))
            throw new Error(`Response data is not an array: ${JSON.stringify(data)}`);

        const genres: Genre[] = [];
        for(const item of data){
            const parsed = genreModel.parse(item);

            genres.push(parsed);
        }

        return genres;
    }

    static async addNewGenre(genre: CreateGenre): Promise<Genre> {
        const res = await axiosInstance.post(`/genres/add`, genre);

        const parsed = genreModel.parse(res.data);

        return parsed;
    }

    static async editGenre(genre_id: Genre["genre_id"], genreUpdate: UpdateGenre): Promise<Genre> {
        const res = await axiosInstance.put(`/genres/edit/${genre_id}`, genreUpdate);

        const parsed = genreModel.parse(res.data);

        return parsed;
    }

    static async deleteGenre(genre_id: Genre["genre_id"]): Promise<boolean> {
        const res = await axiosInstance.delete(`/genres/delete/${genre_id}`);

        if(!("success" in res.data))
            throw new Error(`Response data does not contain 'success' field: ${JSON.stringify(res.data)}`);

        return res.data.success;
    }
}