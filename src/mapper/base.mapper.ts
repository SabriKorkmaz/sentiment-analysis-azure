import {LocalModel} from "../interface/local/local.interface";
import {DocumentModel, DocumentResponseModel} from "../interface/azure/sentiment.request.interface";
import {AzureService} from "../services/azure.service";

export abstract class BaseMapper {


    static  mapFromReviewToDocument(secondProductReviews:LocalModel[],id:string) {
        return secondProductReviews.map((item: LocalModel) => {
            return {
                id: id + "_" + item.id,
                language: "en",
                title: item.title,
                text: item.review,
                rating: item.rating
            } as DocumentModel
        }) as DocumentModel[]

    }
    static async mapToGraphData(documentModel:DocumentModel[]) {
        let loopCount = Math.floor(documentModel.length / 10)
        let graphData: DocumentResponseModel[] = []
        for (let i = 0; i < loopCount; i++) {
            let slicedData = documentModel.slice(i * 10, (i + 1) * 10);
            let result2 = await AzureService.sentimentRequest({
                documents: slicedData
            })
            result2.documents.forEach(k => {
                let item = slicedData.find(z => z.id == k.id)
                if (item) {
                    graphData.push({
                        id: k.id,
                        review: item.text,
                        rating: item.rating,
                        confidenceScores: k.confidenceScores,
                        sentiment: k.sentiment
                    })
                }

            })
        }
        return graphData;
    }
}
