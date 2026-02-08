import debug from "debug";

import axios from "axios";
import { BASE_URL } from "../config";
import { logoutUser } from "./services/Authentication";

const log = debug("app:axiosConfig");

export const axiosInstance = axios.create({
    baseURL: BASE_URL,

    // skipping throwing error when status is not 200
    // validateStatus: () => true,
    responseType: "json",
    withCredentials: false,
    headers: {
        "Content-Type": "application/json",
    }
});

axiosInstance.interceptors.request.use((config) => {
    log(`accessing ${config.method} ${config.url}`);
    log(`found body: ${JSON.stringify(config.data)}`);
    const jwt = localStorage.getItem("jwt");

    if(jwt){
        log("setting Authorization header");
        config.headers.Authorization = `Bearer ${jwt}`;
    }

    return config;
});

axiosInstance.interceptors.response.use(
    (response) => {
        log(`response from ${response.config.method} ${response.config.url}`);

        if(typeof response.data == "object" && "data" in response.data){
            log(`response data: ${JSON.stringify(response.data)}, setting to response.data.data`);
            response.data = response.data.data;
        }
        else{
            log("response data is not an object, setting to empty object");
            log(`response data: ${JSON.stringify(response.data)}`);
            response.data = {};
        }

        return response;
    },
    async (error) => {
        const status = error.response ? error.response.status : "No response";

        // unauthorized
        if (status === 401){
            log("unauthorized response, removing jwt from localStorage");
            await logoutUser();
        }

        if(error.response && error.response.error){
            log(`error: ${JSON.stringify(error.response.error)}`);
        }

        return Promise.reject(error);
    }
)

// axiosInstance.interceptors.response.use((response) => {
//     log(`response from ${response.config.method} ${response.config.url}`);

//     // check if unauthorized either due to missing/expired token or invalid token
//     if(response.status === 401){
//         log("unauthorized response, removing jwt from localStorage");
//         localStorage.removeItem("jwt");
//     }

//     if(response.data.error)
//         log(`error: ${JSON.stringify(response.data)}`);

//     if(typeof response.data == "object" && "data" in response.data){
//         log(`response data: ${JSON.stringify(response.data)}, setting to response.data.data`);
//         response.data = response.data.data;
//     }
//     else{
//         log("response data is not an object, setting to empty object");
//         log(`response data: ${JSON.stringify(response.data)}`);
//         response.data = {};
//     }

//     return response;
// });