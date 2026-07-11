import { axiosInstance } from "../axiosConfig";
import { Publisher, publisherModel } from "../models/Publisher";
import { PublisherCreate, PublisherUpdate } from "../schemas/PublisherSchema";

export class PublisherService {
    static async getPublishers(name?: string): Promise<Publisher[]> {
        const res = await axiosInstance.get(`/publishers`, {
            params: {
                name: name || "",
            }
        });

        const data = res.data as unknown;

        if(!Array.isArray(data))
            throw new Error(`Response data is not an array: ${JSON.stringify(data)}`);

        const publishers: Publisher[] = [];
        for(const item of data){
            const parsed = publisherModel.parse(item);

            publishers.push(parsed);
        }

        return publishers;
    }

    static async getPublisherById(publisher_id: Publisher["publisher_id"]): Promise<Publisher> {
        const res = await axiosInstance.get(`/publishers/${publisher_id}`);

        const parsed = publisherModel.parse(res.data);

        return parsed;
    }

    static async addNewPublisher(publisher: PublisherCreate, publisher_img?: File): Promise<Publisher> {
        const formData = new FormData();
        formData.append("publisher", JSON.stringify(publisher));

        if(publisher_img)
            formData.append("image", publisher_img);

        const res = await axiosInstance.post(`/publishers`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        const parsed = publisherModel.parse(res.data);

        return parsed;
    }

    static async editPublisher(
        publisher_id: Publisher["publisher_id"], 
        publisherUpdate: PublisherUpdate,
        publisher_img?: File
    ): Promise<Publisher> {
        const formData = new FormData();
        formData.append("publisher", JSON.stringify(publisherUpdate));

        if(publisher_img)
            formData.append("image", publisher_img);

        const res = await axiosInstance.patch(`/publishers/${publisher_id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        const parsed = publisherModel.parse(res.data);

        return parsed;
    }

    static async deletePublisher(publisher_id: Publisher["publisher_id"]): Promise<boolean> {
        const res = await axiosInstance.delete(`/publishers/${publisher_id}`);

        if(!("success" in res.data))
            throw new Error(`Response data does not contain 'success' field: ${JSON.stringify(res.data)}`);

        return res.data.success;
    }
}