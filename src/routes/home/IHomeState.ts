import {DocumentResponseModel} from "../../interface/azure/sentiment.request.interface";

export interface IHomeState {
    firstPositiveProductMean:number,
    firstNegativeProductMean:number,
    firstNeutralProductMean:number,
    secondPositiveProductMean:number,
    secondNeutralProductMean:number,
    secondNegativeProductMean:number,
    firstProduct:string;
    secondProduct:string;
    data:any,
    isReady:boolean,
    isLoading:boolean,
    outliers1:DocumentResponseModel[]
    outliers2:DocumentResponseModel[]
    extremePositive1:DocumentResponseModel[]
    extremePositive2:DocumentResponseModel[]
    extremeNegative1:DocumentResponseModel[]
    extremeNegative2:DocumentResponseModel[]
}