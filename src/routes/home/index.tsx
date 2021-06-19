import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./style.module.css";
import {observer} from "mobx-react";
import {RapidApiService} from "../../services/rapid.service";
import {Button} from "@material-ui/core";
import mainStore from "../../stores";
import TextField from '@material-ui/core/TextField';
import {IHomeState} from "./IHomeState";
import {ReviewModel} from "../../interface/rapidApi/review.interface";
import {DocumentModel} from "../../interface/azure/sentiment.request.interface";
import {AzureService} from "../../services/azure.service";


@observer
export class Home extends React.Component<{},IHomeState> {
  constructor(props: any) {
    super(props);
    this.state = { firstProduct: "", secondProduct: "false" };
  }

  get firstProduct(){
    return mainStore.firstProduct;
  }
  get secondProduct(){
    return mainStore.secondProduct;
  }
  handleChangeFirst(event:any){
    mainStore.setFirstProduct(event.target.value as any)
  }

  handleChangeSecond(event:any){
    mainStore.setSecondProduct(event.target.value as any)
  }
  async getKeywords(){
    let store = "apple";
    let responseFirstProduct = await RapidApiService.searchApp({
      store:store,
      language:"en",
      term:mainStore.getFirstProduct
    })
    let responseSecondProduct = await RapidApiService.searchApp({
      store:store,
      language:"en",
      term:mainStore.getFirstProduct
    })
    let id1 = responseFirstProduct[0].id
    let id2 = responseSecondProduct[0].id
    if(responseSecondProduct.length && responseFirstProduct.length){
      mainStore.setFirstProductId(id1)
      mainStore.setSecondProductId(id2)
    }
    let firstProductReviews = await RapidApiService.getReviews({
      store:store,
      language:"en",
      id:id1
    })
    console.log("firt",firstProductReviews)
    let secondProductReviews = await RapidApiService.getReviews({
      store:store,
      language:"en",
      id:id2
    })
    console.log("tort",secondProductReviews)

    if(secondProductReviews != null){
      let documentModel:DocumentModel[] = secondProductReviews.map((item:ReviewModel)=>{
        return {
          id:item.id,
          language:"en",
          title :item.content.title,
          text:item.content.body
        } as DocumentModel
      })
      for (let i = 0 ;i<=4;i++){
        let slicedData = documentModel.slice(i*10,(i+1)*10);

        let result2 = await AzureService.sentimentRequest({
          documents:slicedData
        })
        console.log(result2)

      }
    }
    if(firstProductReviews != null){
      let documentModel2:DocumentModel[] = firstProductReviews.map((item:ReviewModel)=>{
        return {
          id:item.id,
          language:"en",
          title :item.content.title,
          text:item.content.body
        } as DocumentModel
      })
     for (let i = 0 ;i<= 4;i++){
       let slicedData = documentModel2.slice(i*10,(i+1)*10);

       let result2 = await AzureService.sentimentRequest({
         documents:slicedData
       })
console.log(result2)
     }

    }

  }
  async componentDidMount() {

  }

  render() {

    return (
      <div className={styles.container}>
      <h1>Sentiment Analysis</h1>
        <div style={{display:"flex",flexDirection:"column",maxWidth:300}}>
          <TextField id="outlined-basic" label="Product 1"
                     value={this.firstProduct}
                     onChange={this.handleChangeFirst}
                     variant="outlined" />
          <TextField id="outlined-basic"

                     value={this.secondProduct}
                     onChange={this.handleChangeSecond}
                     label="Product 2 " variant="outlined" />
          <br/>
          <Button variant="contained" onClick={this.getKeywords} color="primary">Get</Button>

        </div>
      </div>
    );
  }

}


