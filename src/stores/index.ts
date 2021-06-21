import {action, computed, observable} from "mobx";

//import { toJS } from "mobx";
class MainStore {

    @observable firstProductReview: any = [];
    @observable secondProductReview: any = [];
    @observable reviews: any = [];
    @observable loading: boolean = false;
    @observable firstProductId: string = "";
    @observable secondProductId: string = "";
    @observable firstProduct: string = "alibaba";
    @observable secondProduct: string = "amazon";
    @observable firstActiveRegion: string = "uk";
    @observable secondActiveRegion: string = "us";
    @observable selectionRange: any = {
        startDate: new Date("01/01/2018"),
        endDate: new Date(),
        key: 'selection',
    }

    @computed
    get getReviews() {
        return this.reviews
    }

    @computed
    get getFirstProduct() {
        return this.firstProduct;
    }
    @computed
    get getFirstActiveRegion() {
        return this.firstActiveRegion;
    }
    @computed
    get getSecondActiveRegion() {
        return this.secondActiveRegion;
    }

    @computed
    get getSecondProduct() {
        return this.secondProduct;
    }
    @computed
    get getSelectionRange() {
        return this.selectionRange;
    }

    @action
    setFirstProductReviews(reviews: any) {
        this.reviews = reviews;
    }

    @action
    setSecondProductReviews(reviews: any) {
        this.reviews = reviews;
    }

    @action
    setFirstProductId(key: string) {
        this.firstProductId = key
    }

    @action
    setSecondProductId(key: string) {
        this.secondProductId = key
    }

    @action
    setFirstProduct(key: string) {
        this.firstProduct = key
    }

    @action
    setSecondProduct(key: string) {
        this.secondProduct = key
    }

    @action
    setFirstActiveRegion(key: string) {
        this.firstActiveRegion = key
    }
    @action
    setSecondActiveRegion(key: string) {
        this.secondActiveRegion = key
    }
    @action
    setSelectionRange(startDate: any,endDate:any) {
        this.selectionRange.startDate = startDate;
        this.selectionRange.endDate = endDate
    }


}

const mainStore = new MainStore();
export default mainStore;
