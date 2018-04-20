export class SubstanceDetails {
    constructor(public substanceId:number, public substanceName : String) {}
}
export class DetailPage {
    constructor(public title:String, public conditionalPropHeaders:Object) {}
}

export interface GraphData<Object> {
    points: any;
    type: string;
}