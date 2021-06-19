import {ContentModel} from "./content.interface";

export interface ReviewModel  {
    id: string,
    link: string,
    rating:number,
    content:ContentModel,

}
