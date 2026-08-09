import { axiosInstance } from "../axiosConfig";
import { Genre, genreModel } from "../models/Genre";
import { GenreCreate, GenreUpdate } from "../schemas/GenreSchema";

export async function getGenres(options: {keyword?: string, exclude_genre_ids?: string[]}): Promise<Genre[]> {
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

export async function getGenre(genre_id: Genre["genre_id"]): Promise<Genre>{
    const res = await axiosInstance.get(`/genres/${genre_id}`);

    const data = res.data as unknown;

    const parsed = genreModel.parse(data);

    return parsed;
}

export async function addNewGenre(genre: GenreCreate, genre_img?: File): Promise<Genre> {
    const formData = new FormData();
    formData.append("genre", JSON.stringify(genre));

    if(genre_img)
        formData.append("image", genre_img);

    const res = await axiosInstance.post(`/genres`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    const parsed = genreModel.parse(res.data);

    return parsed;
}

export async function editGenre(
    genre_id: Genre["genre_id"], 
    genreUpdate: GenreUpdate,
    genre_img?: File
): Promise<Genre> {
    const formData = new FormData();
    formData.append("genre", JSON.stringify(genreUpdate));

    if(genre_img)
        formData.append("image", genre_img);

    const res = await axiosInstance.patch(`/genres/${genre_id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    const parsed = genreModel.parse(res.data);

    return parsed;
}

export async function deleteGenre(genre_id: Genre["genre_id"]): Promise<boolean> {
    const res = await axiosInstance.delete(`/genres/${genre_id}`);

    if(!("success" in res.data))
        throw new Error(`Response data does not contain 'success' field: ${JSON.stringify(res.data)}`);

    return res.data.success;
}