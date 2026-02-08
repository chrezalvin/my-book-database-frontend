import { axiosInstance } from "../axiosConfig";
import { User } from "../models/User";
import { isUserPublicData, UserPublicData } from "../models/UserPublicData";

export async function authenticateUser(email: string, password: string): Promise<boolean> {
    // if header is already set, cancel authentication
    if(localStorage.getItem("jwt"))
        return false;

    const res = await axiosInstance.post("/users/login", {
        email: email,
        password: password
    });

    if(!("jwt" in res.data))
        throw new Error(`Response data does not contain 'jwt' property: ${JSON.stringify(res.data)}`);

    if(typeof res.data.jwt !== "string")
        throw new Error(`Response jwt is not a string: ${JSON.stringify(res.data.jwt)}`);

    localStorage.setItem("jwt", res.data.jwt);

    return true;
}

export async function logoutUser(): Promise<boolean> {
    localStorage.removeItem("jwt");

    return true;
}

export async function signUpUser(email: string, password: string): Promise<boolean> {
    // if header is already set, cancel signup
    if(localStorage.getItem("jwt"))
        return false;

    const res = await axiosInstance.post("/users/signup", {
        email,
        password
    });

    if(!("jwt" in res.data))
        throw new Error(`Response data does not contain 'jwt' property: ${JSON.stringify(res.data)}`);

    if(typeof res.data.jwt !== "string")
        throw new Error(`Response jwt is not a string: ${JSON.stringify(res.data.jwt)}`);

    localStorage.setItem("jwt", res.data.jwt);

    return true;
}

export const isUserAuthenticated = (): boolean => {
    const jwt = localStorage.getItem("jwt");

    return jwt !== null;
}

export async function getUserData(): Promise<UserPublicData> {
    const res = await axiosInstance.get("/users/me");

    const data = res.data as unknown;

    if(!isUserPublicData(data))
        throw new Error(`Response data is not a valid UserPublicData: ${JSON.stringify(data)}`);

    return data;
}