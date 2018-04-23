import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as d3 from "d3";
declare var $: any;
@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnChanges {
  @Input() 
  data: Object
  //graphData : any

  constructor() { }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      $(".chart").smiCharts({
        data: this.data['points'],
        type: this.data['type'],
        complete: function(){
          //console.log("complete") 
        }
      });
    }
    
  }
}
