export class SubstanceDetails {
    constructor(public substanceId:number, public substanceName : String) {}
}
export class DetailPage {
    constructor(public title:String, public conditionalPropHeaders:Object) {}
}

export interface GraphData<Object> {
    points: any;
    graphData: any;
    type: string;
    xAxis: string,
    yAxis: string,
    lineAxis: string,
    colorTheme: any
}