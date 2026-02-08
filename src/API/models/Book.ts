import debug from "debug";

const log = debug("app:Models:Book");

export interface Book{
    book_id: string;
    created_at: string;
    title: string;
    author: string;
    publisher: string;
    publication_year: number;
    language: string;
    genre: string;
    summary: string;
    
    cover_img: string | null;
    isbn: string | null;
    edition: string | null;
}

export function isBook(value: unknown): value is Book {
    if(typeof value !== "object" || value === null){
        log("Value is not an object or is null");
        return false;
    }

    if(!("book_id" in value)){
        log("Missing 'book_id' property");
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

    if(!("title" in value)){
        log("Missing 'title' property");
        return false;
    }

    if(!("author" in value)){
        log("Missing 'author' property");
        return false;
    }

    if(!("publication_year" in value)){
        log("Missing 'publication_year' property");
        return false;
    }

    if(!("language" in value)){
        log("Missing 'language' property");
        return false;
    }

    if(!("genre" in value)){
        log("Missing 'genre' property");
        return false;
    }

    if(!("summary" in value)){
        log("Missing 'summary' property");
        return false;
    }

    if(("isbn" in value) && value.isbn !== null && typeof value.isbn !== "string"){
        log("'isbn' property is not a string or null");
        return false;
    }

    if(("edition" in value) && value.edition !== null && typeof value.edition !== "string"){
        log("'edition' property is not a string or null");
        return false;
    }

    if(("cover_img" in value) && value.cover_img !== null && typeof value.cover_img !== "string"){
        log("'cover_img' property is not a string or null");
        return false;
    }

    if(typeof value.book_id !== "string"){
        log("'book_id' property is not a string");
        return false;
    }

    if(typeof value.created_at !== "string"){
        log("'created_at' property is not a string");
        return false;
    }

    if(typeof value.title !== "string"){
        log("'title' property is not a string");
        return false;
    }

    if(typeof value.author !== "string"){
        log("'author' property is not a string");
        return false;
    }

    if(typeof value.publication_year !== "number"){
        log("'publication_year' property is not a number");
        return false;
    }

    if(typeof value.language !== "string"){
        log("'language' property is not a string");
        return false;
    }

    if(typeof value.genre !== "string"){
        log("'genre' property is not a string");
        return false;
    }

    if(typeof value.summary !== "string"){
        log("'summary' property is not a string");
        return false;
    }

    return true;
}

export function isBookWithoutId(value: unknown): value is Omit<Book, "book_id" | "created_at" | "cover_img"> {
    if(typeof value !== "object" || value === null){
        log("Value is not an object or is null");
        return false;
    }

    if("book_id" in value){
        log("Should not have 'book_id' property");
        return false;
    }

    if("created_at" in value){
        log("Should not have 'created_at' property");
        return false;
    }

    if("cover_img" in value){
        log("Should not have 'cover_img' property");
        return false;
    }

    if(!("title" in value)){
        log("Missing 'title' property");
        return false;
    }

    if(!("author" in value)){
        log("Missing 'author' property");
        return false;
    }

    if(!("publication_year" in value)){
        log("Missing 'publication_year' property");
        return false;
    }

    if(!("language" in value)){
        log("Missing 'language' property");
        return false;
    }

    if(!("genre" in value)){
        log("Missing 'genre' property");
        return false;
    }

    if(!("summary" in value)){
        log("Missing 'summary' property");
        return false;
    }

    if(("isbn" in value) && value.isbn !== null && typeof value.isbn !== "string"){
        log("'isbn' property is not a string or null");
        return false;
    }

    if(("edition" in value) && value.edition !== null && typeof value.edition !== "string"){
        log("'edition' property is not a string or null");
        return false;
    }

    if(typeof value.title !== "string"){
        log("'title' property is not a string");
        return false;
    }

    if(typeof value.author !== "string"){
        log("'author' property is not a string");
        return false;
    }

    if(typeof value.publication_year !== "number"){
        log("'publication_year' property is not a number");
        return false;
    }

    if(typeof value.language !== "string"){
        log("'language' property is not a string");
        return false;
    }

    if(typeof value.genre !== "string"){
        log("'genre' property is not a string");
        return false;
    }

    if(typeof value.summary !== "string"){
        log("'summary' property is not a string");
        return false;
    }

    return true;
}

export function isBookPartial(value: unknown): value is Partial<Omit<Book, "book_id" | "created_at" | "cover_img">> {
    if(typeof value !== "object" || value === null){
        log("Value is not an object or is null");
        return false;
    }

    if("book_id" in value){
        log("Should not have 'book_id' property");
        return false;
    }

    if("created_at" in value){
        log("Should not have 'created_at' property");
        return false;
    }

    if("cover_img" in value){
        log("Should not have 'cover_img' property");
        return false;
    }

    if("title" in value && typeof value.title !== "string"){
        log("'title' property is not a string");
        return false;
    }

    if("author" in value && typeof value.author !== "string"){
        log("'author' property is not a string");
        return false;
    }

    if("publication_year" in value && typeof value.publication_year !== "number"){
        log("'publication_year' property is not a number");
        return false;
    }

    if("language" in value && typeof value.language !== "string"){
        log("'language' property is not a string");
        return false;
    }

    if("genre" in value && typeof value.genre !== "string"){
        log("'genre' property is not a string");
        return false;
    }

    if("summary" in value && typeof value.summary !== "string"){
        log("'summary' property is not a string");
        return false;
    }

    if("isbn" in value && value.isbn !== null && typeof value.isbn !== "string"){
        log("'isbn' property is not a string or null");
        return false;
    }

    if("edition" in value && value.edition !== null && typeof value.edition !== "string"){
        log("'edition' property is not a string or null");
        return false;
    }

    return true;
}