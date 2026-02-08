import debug from "debug";
import { User } from "./User";

const log = debug("app:Models:UserPublicData");

export interface UserPublicData extends Omit<User, "created_at" | "password"> {}

export function isUserPublicData(value: unknown): value is UserPublicData {
    if(typeof value !== "object" || value === null){
        log("Value is not an object or is null");
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

    if(typeof value.user_id !== "string"){
        log("'user_id' property is not a string");
        return false;
    }

    if(typeof value.email !== "string"){
        log("'email' property is not a string");
        return false;
    }

    return true;
}