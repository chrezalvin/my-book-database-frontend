import debug from "debug";
import { User } from "./User";

const log = debug("app:Models:Jwt");

export interface Jwt{
    user_id: User["user_id"];
    email: string;
    iat: number;
    exp: number;
}

export function isJwt(value: unknown): value is Jwt {
    if(typeof value !== "object" || value === null){
        return false;
    }

    if(!("user_id" in value)){
        log("Missing 'user_id' property");
        return false;
    }

    if(!("email" in value)){
        log("Missing 'email' property");
        return false;
    }

    if(!("iat" in value)){
        log("Missing 'iat' property");
        return false;
    }

    if(!("exp" in value)){
        log("Missing 'exp' property");
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

    if(typeof value.iat !== "number"){
        log("'iat' property is not a number");
        return false;
    }

    if(typeof value.exp !== "number"){
        log("'exp' property is not a number");
        return false;
    }

    return true;
}