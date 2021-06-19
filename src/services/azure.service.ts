import {BaseService} from "./base/base.service";
import {SourceEnum} from "./base/source.enum";
import {SentimentRequestModel} from "../interface/azure/sentiment.request.interface";

export abstract class AzureService {

    static async sentimentRequest(request:SentimentRequestModel) {
        const response:any = await BaseService.getInstance(SourceEnum.azure)!.post(
            "",request)
        return response;
    }
}
