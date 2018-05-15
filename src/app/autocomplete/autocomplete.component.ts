import { Component, OnInit,ViewChild, Input, Output, ElementRef, EventEmitter,OnChanges, SimpleChanges, AfterViewChecked } from '@angular/core';
import { ElementDef } from '@angular/core/src/view';
declare var $: any;

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css']
})
export class AutocompleteComponent implements OnInit, OnChanges, AfterViewChecked {
  @Input()
  dataOptions:Object

  @ViewChild('autocompleteElem') autocompleteElem:ElementRef
  @Output() 
  onSelect: EventEmitter<any> = new EventEmitter()

  source: any
  minLength: number
  constructor() { }

  ngOnInit() {
    let instance = this
    if(Object.keys(this.dataOptions).length > 0) {
      let pop = $( this.autocompleteElem.nativeElement ).autocomplete({
        source: instance.source,
        minLength: instance.minLength,
        appendTo: $(this.autocompleteElem.nativeElement).parent(),
        focus: function( event, ui ) {
          return false;
        },
        select: function( event, ui ) {
          instance.onSelect.emit([event, ui]);
          return false;
        }
      })
      pop.autocomplete().data("uiAutocomplete")._renderItem = function( ul, item ) {
        return $("<li></li>")
          .data("item.autocomplete", item)
          .append('<a>'+ item.SystemName + '</a>')
          .appendTo( ul );
      };
      
    }
  }

  ngAfterViewChecked() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['dataOptions']) {
      if(Object.keys(this.dataOptions).length > 0) {
        this.source = this.dataOptions["source"],
        this.minLength = this.dataOptions["minLength"]
      }
    }
  }

}
