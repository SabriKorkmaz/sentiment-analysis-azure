import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./style.module.css";
import {observer} from "mobx-react";
import {Button} from "@material-ui/core";
import mainStore from "../../stores";
import {IHomeState} from "./IHomeState";
import {DocumentModel, DocumentResponseModel} from "../../interface/azure/sentiment.request.interface";
import {AzureService} from "../../services/azure.service";
import MenuItem from '@material-ui/core/MenuItem';
import {Bar} from 'react-chartjs-2';
import {CircleToBlockLoading} from 'react-loadingg';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import Select from '@material-ui/core/Select';
import {DateRange} from 'react-date-range';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import {LocalService} from "../../services/db.service";
import {LocalModel} from "../../interface/local/local.interface";
import {TableList} from "../../components/table";
import {BaseMapper} from "../../mapper/base.mapper";



const options = {
    scales: {
        yAxes: [
            {
                ticks: {
                    beginAtZero: true,
                },
            },
        ],
    },
};
const bgColor = ['rgb(255, 99, 132)', 'rgb(0, 255, 0)', 'rgb(0, 72, 255)', 'rgb(0, 255, 255)', 'rgb(255, 255, 0)', 'rgb(255, 255, 128)']

@observer
export class Home extends React.Component<{}, IHomeState> {
    constructor(props: any) {
        super(props);
        this.state = {
            firstProduct: "", secondProduct: "false",
            firstNegativeProductMean: 0,
            firstPositiveProductMean: 0,
            firstNeutralProductMean: 0,
            secondPositiveProductMean: 0,
            secondNegativeProductMean: 0,
            secondNeutralProductMean: 0,
            isReady: false,

            isLoading: false,
            data: {
                labels: ["", ""],
                datasets: [],

            },
            outliers1: [] as DocumentResponseModel[],
            outliers2: [] as DocumentResponseModel[],
            extremeNegative1: [] as DocumentResponseModel[],
            extremeNegative2: [] as DocumentResponseModel[],
            extremePositive1: [] as DocumentResponseModel[],
            extremePositive2: [] as DocumentResponseModel[],
        };
        this.handleSelect = this.handleSelect.bind(this)
        this.getKeywords = this.getKeywords.bind(this);

    }

    get firstProduct() {
        return mainStore.firstProduct;
    }

    get secondProduct() {
        return mainStore.secondProduct;
    }

    get firstActiveRegion() {
        return mainStore.getFirstActiveRegion
    }

    get secondActiveRegion() {
        return mainStore.getSecondActiveRegion
    }

    get getSelectionRange() {
        return mainStore.getSelectionRange
    }

    handleSelect(date: any) {
        mainStore.setSelectionRange(date.selection.startDate, date.selection.endDate)
    }

    handleChangeFirst(event: any) {
        mainStore.setFirstProduct(event.target.value as any)
    }

    handleChangeSecond(event: any) {
        mainStore.setSecondProduct(event.target.value as any)
    }

    async getKeywords() {
        this.setState({
            isReady: false,
            data: {
                datasets:[],
                labels:[]
            },
            isLoading: true,
        })
        let labels: string[] = []
        const data = {
            labels: ['', ''],
            datasets: [],
        } as any;
        let keyword1 = this.firstProduct + "_" + this.firstActiveRegion
        let keyword2 = this.secondProduct + "_" + this.secondActiveRegion;
        let startDate = mainStore.getSelectionRange.startDate
        let endDate = mainStore.getSelectionRange.endDate

        let firstProductReviews = await LocalService.getDataFromLocal(keyword1, startDate, endDate)
        let secondProductReviews = await LocalService.getDataFromLocal(keyword2, startDate, endDate)

        if (secondProductReviews == null) {
            return
        }
        if (firstProductReviews == null) {
            return;
        }
        try {
            let documentModel: DocumentModel[] = BaseMapper.mapFromReviewToDocument(secondProductReviews, this.secondProduct)

            let graphData2: DocumentResponseModel[] = await BaseMapper.mapToGraphData(documentModel);


            let documentModel2: DocumentModel[] = BaseMapper.mapFromReviewToDocument(firstProductReviews, this.firstProduct)


            let graphData1: DocumentResponseModel[] = await BaseMapper.mapToGraphData(documentModel2);

            //How many types of the result / positives,negatives and mixed
            graphData1.forEach((item: DocumentResponseModel) => {
                if (!labels.includes(item.sentiment)) {
                    labels.push(item.sentiment)
                }
            })

            //We need to push the data we calculated to dataset to show graph
            labels.forEach((item, index) => {
                data.datasets.push({
                    label: item,
                    backgroundColor: bgColor[index],
                    borderColor: bgColor[index],
                    data: [graphData1.filter(k => k.sentiment == item).length, graphData2.filter(k => k.sentiment == item).length] as number[],
                })
            })

            //preparing the data of the tables
            let outliers1 = graphData1.filter((item) => {
                return (item.rating == 5 && item.confidenceScores.negative > 0.7) || (item.rating == 1 && item.confidenceScores.positive > 0.7)
            })
            let outliers2 = graphData2.filter((item) => {
                return (item.rating == 5 && item.confidenceScores.negative > 0.7) || (item.rating == 1 && item.confidenceScores.positive > 0.7)
            })
            let extremesPositive1 = graphData1.sort((a, b) =>
                b.confidenceScores.positive - a.confidenceScores.positive).slice(0, 5)
            let extremesPositive2 = graphData2.sort((a, b) =>
                b.confidenceScores.positive - a.confidenceScores.positive).slice(0, 5)
            let extremesNegative1 = graphData1.sort((a, b) =>
                b.confidenceScores.negative - a.confidenceScores.negative).slice(0, 5)
            let extremesNegative2 = graphData2.sort((a, b) =>
                b.confidenceScores.negative - a.confidenceScores.negative).slice(0, 5)

            //preparing the last state of the page
            this.setState({
                isReady: true,
                isLoading: false,
                firstNegativeProductMean: graphData1.map(l => l.confidenceScores.negative).reduce((a, b) => a + b, 0) / graphData1.length,
                firstPositiveProductMean: graphData1.map(l => l.confidenceScores.positive).reduce((a, b) => a + b, 0) / graphData1.length,
                firstNeutralProductMean: graphData1.map(l => l.confidenceScores.neutral).reduce((a, b) => a + b, 0) / graphData1.length,
                secondNegativeProductMean: graphData2.map(l => l.confidenceScores.negative).reduce((a, b) => a + b, 0) / graphData2.length,
                secondPositiveProductMean: graphData2.map(l => l.confidenceScores.positive).reduce((a, b) => a + b, 0) / graphData2.length,
                secondNeutralProductMean: graphData2.map(l => l.confidenceScores.neutral).reduce((a, b) => a + b, 0) / graphData2.length,
                data: {
                    labels: [mainStore.getFirstProduct.toUpperCase(), mainStore.getSecondProduct.toUpperCase()],
                    datasets: data.datasets
                },
                outliers1: outliers1,
                outliers2: outliers2,
                extremePositive1: extremesPositive1,
                extremePositive2: extremesPositive2,
                extremeNegative1: extremesNegative1,
                extremeNegative2: extremesNegative2
            })

        } catch (e) {
            alert(e)
        }

    }

    async componentDidMount() {

    }

    handleChangeFirstActiveRegion = (event) => {
        mainStore.setFirstActiveRegion(event.target.value);
    };
    handleChangeSecondActiveRegion = (event) => {
        mainStore.setSecondActiveRegion(event.target.value);
    };

    render() {
        let {isReady, isLoading} = this.state;

        const renderLoading = () => {
            if (!isReady && isLoading) {
                return (
                    <CircleToBlockLoading/>
                )
            } else {
                return
            }

        }
        return (
            <div className={styles.container}>
                <h1>Sentiment Analysis</h1>
                <br/>
                <div style={{display: "flex", justifyContent: "space-evenly"}}>
                    <div style={{display: "flex", flexDirection: "column",}}>
                        <div style={{display: "flex", flexDirection: "row", justifyContent: "space-evenly"}}>
                            <div style={{display: "flex", flexDirection: "row"}}>
                                <div style={{display: "flex", flexDirection: "column"}}>
                                    <FormControl style={{minWidth: 120, margin: 10}}>
                                        <InputLabel shrink id="demo-simple-select-placeholder-label-label">1.Product
                                        </InputLabel>
                                        <Select
                                            label={"First Product"}
                                            id="demo-simple-select"
                                            value={this.firstProduct}
                                            onChange={this.handleChangeFirst}
                                        >
                                            <MenuItem value={'alibaba'}>Alibaba</MenuItem>
                                            <MenuItem value={'amazon'}>Amazon</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl style={{minWidth: 120, margin: 10}}>
                                        <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                                            2.Product
                                        </InputLabel>
                                        <Select
                                            id="demo-simple-select"
                                            label={"Second Product"}
                                            value={this.secondProduct}
                                            onChange={this.handleChangeSecond}
                                        >
                                            <MenuItem value={'alibaba'}>Alibaba</MenuItem>
                                            <MenuItem value={'amazon'}>Amazon</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                <div style={{display: "flex", flexDirection: "column"}}>
                                    <FormControl style={{minWidth: 120, margin: 10}}>
                                        <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                                            1.Country
                                        </InputLabel>
                                        <Select
                                            label={"Country"}
                                            id="demo-simple-select"
                                            value={this.firstActiveRegion}
                                            onChange={this.handleChangeFirstActiveRegion}
                                        >
                                            <MenuItem value={'uk'}>United Kingdom</MenuItem>
                                            <MenuItem value={'us'}>United States</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl style={{minWidth: 120, margin: 10}}>
                                        <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                                            2.Country
                                        </InputLabel>
                                        <Select
                                            label={"Country"}
                                            id="demo-simple-select"
                                            value={this.secondActiveRegion}
                                            onChange={this.handleChangeSecondActiveRegion}
                                        >
                                            <MenuItem value={'uk'}>United Kingdom</MenuItem>
                                            <MenuItem value={'us'}>United States</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>
                            <DateRange
                                ranges={[this.getSelectionRange]}
                                editableDateInputs={true}
                                moveRangeOnFirstSelection={false}
                                onChange={this.handleSelect}
                            />
                        </div>
                        <Button variant="contained" onClick={this.getKeywords} color="primary">Get</Button>
                        <Bar data={this.state.data} options={options} type={"bar"}/>
                        <div style={{display: "flex", flexDirection: "column"}}>
                            <h6>Average Confidence Scores</h6>
                            <div style={{display: "flex", flexDirection: "row"}}>
                                <div>
                                    <h6>{this.firstProduct}</h6>
                                    <ul>
                                        <li>Positive:{this.state.firstPositiveProductMean.toFixed(2)}
                                        </li>
                                        <li>Negative:{this.state.firstNegativeProductMean.toFixed(2)}</li>
                                        <li>Neutral:{this.state.firstNeutralProductMean.toFixed(2)}</li>
                                    </ul>
                                </div>
                                <div>
                                    <h6>{this.secondProduct}</h6>
                                    <ul>
                                        <li>Positive:{this.state.secondPositiveProductMean.toFixed(2)}
                                        </li>
                                        <li>Negative:{this.state.secondNegativeProductMean.toFixed(2)}</li>
                                        <li>Neutral:{this.state.secondNeutralProductMean.toFixed(2)}</li>

                                    </ul>
                                </div>

                            </div>
                        </div>

                        <br/>
                    </div>
                    <div style={{display: "flex", width: "50%", flexDirection: "column"}}>

                        <TableList title={'Highest Ratings-Negative Sentiment ' + this.firstProduct.toUpperCase()}
                                   rows={this.state.outliers1.filter(k => k.rating == 5).slice(0, 5)}/>
                        <TableList title={'Lowest Rating-Positive Sentiment ' + this.firstProduct.toUpperCase()}
                                   rows={this.state.outliers1.filter(k => k.rating == 1).slice(0, 5)}/>
                        <TableList title={'Highest Ratings-Negative Sentiment ' + this.secondProduct.toUpperCase()}
                                   rows={this.state.outliers2.filter(k => k.rating == 5).slice(0, 5)}/>
                        <TableList title={'Lowest Rating-Positive Sentiment ' + this.secondProduct.toUpperCase()}
                                   rows={this.state.outliers2.filter(k => k.rating == 1).slice(0, 5)}/>
                        <br/>
                        <TableList title={'Highest Positive Scores ' + this.firstProduct.toUpperCase()}
                                   rows={this.state.extremePositive1}/>
                        <TableList title={'Highest Negative Scores ' + this.firstProduct.toUpperCase()}
                                   rows={this.state.extremeNegative1}/>
                        <TableList title={'Highest Positive Scores ' + this.secondProduct.toUpperCase()}
                                   rows={this.state.extremePositive2}/>
                        <TableList title={'Highest Negative Scores ' + this.secondProduct.toUpperCase()}
                                   rows={this.state.extremeNegative2}/>
                        {renderLoading()}

                    </div>
                </div>

            </div>
        );
    }

}


