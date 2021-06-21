import {BaseService} from "./base/base.service";
import {SourceEnum} from "./base/source.enum";
import {SearchRequestModel,
// SearchResponseModel
} from "../interface/rapidApi/search.request.interface";
import {ReviewRequestModel} from "../interface/rapidApi/review.request.interface";

export abstract class RapidApiService {
    static async searchApp(request:SearchRequestModel) {
        const response:any = await BaseService.getInstance(SourceEnum.rapidApi).get(
            "/search",{params:{
                    term:request.term,
                    store:request.store,
                    language:request.language
                }}
        );
        return response.data;
    }
    static async getReviews(request:ReviewRequestModel) {
        const response:any  = await BaseService.getInstance(SourceEnum.rapidApi)!.get(
            "/reviews",{params:{
                    id:request.id,
                    store:request.store,
                    language:request.language
                }}
        );
        return response.data;
    }
}
