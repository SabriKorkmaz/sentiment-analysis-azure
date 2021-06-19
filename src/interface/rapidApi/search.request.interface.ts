export interface SearchRequestModel{
    term:string,
    store:string,
    language:string,
}
export interface SearchResponseModel{
    id:string,
    url:string,
    name:string,
}