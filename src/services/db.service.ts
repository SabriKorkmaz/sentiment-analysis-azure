import alibaba_uk from "./../db/alibaba_uk.json"
import alibaba_us from "./../db/alibaba_us.json"
import amazon_us from "./../db/amazon_us.json"
import amazon_uk from "./../db/amazon_uk.json"
import {LocalModel} from "../interface/local/local.interface";

export abstract class LocalService {

    public static local: any = {
        "alibaba_uk": alibaba_uk,
        "alibaba_us": alibaba_us,
        "amazon_uk": amazon_uk,
        "amazon_us": amazon_us
    }

    static async getDataFromLocal(source: string, startDate: any, endDate: any) {
        let data = this.local[source] as LocalModel[]

        let filtered =  data.filter((item)=>{
            return new Date(item.date) >= new Date(startDate) && new Date(item.date) <= new Date(endDate)
        })
        return filtered.slice(0,50)

    }
}
