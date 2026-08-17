import { axiosInstance } from "../axiosConfig";
import { Genre, genreModel } from "../models/Genre";
import { GenreCreate, GenreUpdate } from "../schemas/GenreSchema";

export async function getGenres(params: {keyword?: string, exclude_genre_ids?: string[], page?: number}): Promise<Genre[]> {
    const res = await axiosInstance.get(`/genres`, { params: {...params, exclude_genre_ids: params.exclude_genre_ids?.join(",")} });

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

export async function addNewGenre(genreCreate: GenreCreate): Promise<Genre> {
    const formData = new FormData();
    formData.append("genre", JSON.stringify(genreCreate.genre));

    if(genreCreate.image)
        formData.append("image", genreCreate.image);

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
): Promise<Genre> {
    const formData = new FormData();
    formData.append("genre", JSON.stringify(genreUpdate.genre));

    if(genreUpdate.image)
        formData.append("image", genreUpdate.image);

    const res = await axiosInstance.patch(`/genres/${genre_id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    const parsed = genreModel.parse(res.data);

    return parsed;
}

export async function deleteGenre(genre_id: Genre["genre_id"]): Promise<true> {
    await axiosInstance.delete(`/genres/${genre_id}`);

    return true;
}