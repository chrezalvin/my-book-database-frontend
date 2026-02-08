import debug from "debug";

const log = debug("app:Models:User");

export interface User{
    user_id: string;
    created_at: string;
    email: string;
    password: string;
}

export function isUser(value: unknown): value is User {
    if(typeof value !== "object" || value === null){
        log("Value is not an object or is null");
        return false;
    }

    if(!("user_id" in value)){
        log("Missing 'user_id' property");
        return false;
    }

    if(!("created_at" in value)){
        log("Missing 'created_at' property");
        return false;
    }

    if(!("email" in value)){
        log("Missing 'email' property");
        return false;
    }

    if(!("password" in value)){
        log("Missing 'password' property");
        return false;
    }

    if(typeof value.user_id !== "string"){
        log("'user_id' property is not a string");
        return false;
    }

    if(typeof value.email !== "string"){
        log("'email' property is not a string");
        return false;
    }

    if(typeof value.password !== "string"){
        log("'password' property is not a string");
        return false;
    }

    if(typeof value.created_at !== "string"){
        log("'created_at' property is not a string");
        return false;
    }    

    return true;
}