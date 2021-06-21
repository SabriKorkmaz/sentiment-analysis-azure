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
    rating:number;
}
export interface DocumentResponseModel {
    id:string
    sentiment:string;
    review:any;
    rating:any;
    confidenceScores:ConfidenceScoresModel
}

export interface ConfidenceScoresModel{
    negative:number,
    positive:number,
    neutral:number,
}
