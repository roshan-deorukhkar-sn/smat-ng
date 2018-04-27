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
  //graphData : any

  @Output() 
  onLoaded: EventEmitter<any> = new EventEmitter()

  constructor() { }
  
  ngOnChanges(changes: SimpleChanges) {
    let el = this
    if (changes['data']) {
      $(".chart").smiCharts({
        data: this.data['points'],
        type: this.data['type'],
        complete: function(ui){
          el.onLoaded.emit(ui);
        }
      });
    }
    
  }
}
