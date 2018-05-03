import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
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

  @Output() 
  onLoaded: EventEmitter<any> = new EventEmitter()

  constructor() { }
  
  ngOnChanges(changes: SimpleChanges) {
    let el = this
    if (changes['data']) {
      $(".chart").smiCharts({
        data: this.data['points'],
        chartData: this.data['graphData'],
        type: this.data['type'],
        xAxis: this.data['xAxis'],
        yAxis: this.data['yAxis'],
        lineAxis: this.data['lineAxis'],
        colorTheme: this.data['colorTheme'],
        complete: function(ui){
          el.onLoaded.emit(ui);
        }
      });
    }
    
  }
}
