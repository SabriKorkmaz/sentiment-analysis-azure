export interface SentimentRequestModel {
    documents:DocumentModel[]
}
export interface SentimentResponseModel{
    document: DocumentModel[]
}

export interface DocumentModel {
    id:string
    language:string,
    text:string,
    title:string;
}