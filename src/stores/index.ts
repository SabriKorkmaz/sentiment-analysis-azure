import {action, computed, observable} from "mobx";
//import { toJS } from "mobx";
class MainStore {


  @observable firstProductReview: any = [];
  @observable secondProductReview: any = [];
  @observable reviews: any = [];
  @observable loading: boolean = false;
  @observable firstProductId:string = "";
  @observable secondProductId:string = "";
  @observable firstProduct:string = "Youtube";
  @observable secondProduct:string = "Amazon";

  @computed
  get getReviews() {
    return this.reviews
  }
  @computed
  get getFirstProduct(){
    return this.firstProduct;
  }
  @computed
  get getSecondProduct(){
    return this.secondProduct;
  }
  @action
  setFirstProdcuctReviews(reviews:any) {
    this.reviews = reviews;
  }
  @action
  setSecondProductReviews(reviews:any) {
    this.reviews = reviews;
  }
  @action
  setFirstProductId(key:string){
    this.firstProductId= key
  }
  @action
  setSecondProductId(key:string){
    this.secondProductId= key
  }
  @action
  setFirstProduct(key:string){
    this.firstProduct= key
  }
  @action
  setSecondProduct(key:string){
    this.secondProduct= key
  }
}

const mainStore = new MainStore();
export default mainStore;
