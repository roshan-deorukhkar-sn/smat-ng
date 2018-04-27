import { Component, Input, Output, ViewChild, ElementRef, EventEmitter, OnChanges, SimpleChanges, AfterViewChecked } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-rangeslider',
  templateUrl: './rangeslider.component.html',
  styleUrls: ['./rangeslider.component.css']
})

export class RangesliderComponent implements OnChanges, AfterViewChecked {
  @Input()
  silderData: Object

  @ViewChild('sliderElem') sliderEle:ElementRef;
  @ViewChild('sliderTitle') sliderTitle:ElementRef;
  @ViewChild('sliderMin') sliderMin:ElementRef;
  @ViewChild('sliderMax') sliderMax:ElementRef;

  sliderName : String
  title: String
  min: string
  max: string
  options: Object

  @Output() 
  onSlide: EventEmitter<any> = new EventEmitter()
  onChange: EventEmitter<any> = new EventEmitter()
  
  constructor() { }

/*
  sample object for slider
  {
    "name":"slidername",
    "options": {
      "range": true,
      "min": 0,
      "max": 750
    }
  }
*/

  ngAfterViewChecked() {
    if(Object.keys(this.silderData).length > 0) {
      let slider = this.initilizeSlider(this.sliderEle.nativeElement, this.getSliderOptions(this.silderData));
      let el =this
      $( slider ).on( "slide", function( event, ui ) {
        el.onSlide.emit([event, ui]);
        el.setSliderRangeToInputBox(ui)
      });
      
      $( slider ).on( "change", function( event, ui ) {
        el.onChange.emit([event, ui]);
        el.setSliderRangeToInputBox(ui)
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['silderData']) {
      if(Object.keys(this.silderData).length > 0) {
        this.sliderName = this.getSliderName(this.silderData)
        this.title = this.getSliderTitle(this.silderData)
        this.min = this.getMinForSlider(this.silderData)
        this.max = this.getMaxForSlider(this.silderData)
      }
    }
  }

  initilizeSlider = function(ele, data) {
    return $(ele).slider(data);
  }

  getSliderName = function(data) {
    return data.name
  }

  getSliderOptions = function(data) {
    return data.options
  }

  getSliderTitle = function(data) {
    return data.title
  }

  getMinForSlider = function(data) {
    return data.options.values[0]
  }

  getMaxForSlider = function(data) {
    return data.options.values[1]
  }

  setMinVal = function(min) {
    this.min = min
  }

  setMaxVal = function(max) {
    this.max = max
  }

  setSliderRangeToInputBox = function(ele) {
    this.setMinVal(ele.values[0])
    this.setMaxVal(ele.values[1])
  }

}
