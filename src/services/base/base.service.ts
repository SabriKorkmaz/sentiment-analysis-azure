import axios, {AxiosInstance} from 'axios';
import {SourceEnum} from "./source.enum";

export abstract class BaseService {
    static rapidApiInstance?: AxiosInstance = undefined
    static azureInstance?: AxiosInstance = undefined;

    static rapidApi() {
        return axios.create({
            baseURL: 'https://app-stores.p.rapidapi.com',
            timeout: 10000,
            headers: {
                'x-rapidapi-key': '**************************************',
                'x-rapidapi-host': 'app-stores.p.rapidapi.com',
            }
        })
    }

    static azure() {
        return axios.create({
            baseURL: 'https://cgservices.cognitiveservices.azure.com/text/analytics/v3.0/sentiment',
            timeout: 10000,
            headers: {
                'Ocp-Apim-Subscription-Key': '7521b416ec6d47148f1ddbf6429d28af',
                'Content-Type': 'application/json',
                'Accept':'application/json'
            }
        })
    }

    static getInstance(source: SourceEnum) {
        if (source == SourceEnum.rapidApi) {
            if (this.rapidApiInstance === undefined) {
               this.rapidApiInstance =  this.rapidApi()
                return this.rapidApiInstance
            }else{
                return this.rapidApiInstance;
            }
        } else{
            if (this.azureInstance === undefined) {
                this.azureInstance = this.azure()
                return this.azureInstance;
            }else{
                return this.azureInstance;
            }
        }
    }
}

