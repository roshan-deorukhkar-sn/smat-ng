import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Rx';
import * as d3 from "d3";
import {SlimLoadingBarService} from "ng2-slim-loading-bar";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { DataTable, DataTableResource } from 'angular5-data-table';

import { DetailPage, GraphData } from '../interactive-data';

@Component({
  selector: 'app-interactive',
  templateUrl: './interactive.component.html',
  styleUrls: ['./interactive.component.css']
})
export class InteractiveComponent implements OnInit {
  public data: Observable<any[]>
  detailPage: DetailPage
  graphData : GraphData<Object>
  sliderCreated: Function
  tableHeaders = []
  tableData = []
  sliderData = []
  sliderData1 = {}
  sysId = ""
  propId = ""
  //dataUrl = '/assets/json/data.json';
  dataUrl = "";

  constructor(private route: ActivatedRoute, private dataService:DataService, private loader: SlimLoadingBarService, public toastr: ToastsManager, vcr: ViewContainerRef) { 
    this.toastr.setRootViewContainerRef(vcr);
  }
  
  ngOnInit(){
    this.loader.start()
    this.route.params.subscribe( (params:any ) => {
      this.propId = params.propertyName
      this.sysId = params.systemId
      this.dataUrl = `http://sm-interactive-dev.dev.cf.private.springer.com/interactive?systemId=${this.sysId}&propertyId=${this.propId}`
    });

    this.dataService.getData(this.dataUrl, [])
      .subscribe(
        (result:any) => {
          this.detailPage = result

          this.graphData = { points: result.rows, type: "line" }

          result.columnHeaders.map(column => {
            this.tableHeaders.push({"key" : column.name.toLowerCase().replace(" ", "-"), "value": column.name });
          });
          
          this.tableData = this.getTableRows(result.rows, this.tableHeaders);

          this.getAllProperties(result).map(current => {
            this.sliderData.push(this.getSliderDataForProperty(current, this.getDataByProperty(result, current)))
          });
          this.loader.complete()
          this.toastr.success('Data loaded!', 'Success!');
        },
        error => {
          
          this.loader.complete()
          this.toastr.error('This is not good!', 'Oops!');
        }
      );
  }

  getSliderDataForProperty = function( property, dataByProperty ) {
    /* {
      "name": "slidername",
      "title": "Slider title 3",
      "options": {
        "range": true,
        "min": 0,
        "max": 750,
        "values": [0, 750]
      }
    } */
    let range = this.getMinMaxForProperty(dataByProperty)
    let dataObject = {}
    dataObject['name'] = property.role + "-" + property.id
    dataObject['title'] = property.name
    dataObject['options'] = {}
    dataObject['options']['range'] = true
    dataObject['options']['min'] = range[0]
    dataObject['options']['max'] = range[1]
    dataObject['options']['values'] = range
    return dataObject
  }

  getTableRows = function(rows, headers) {
    let tableRows = []
    rows.map(current => {
      tableRows.push(this.getTableRow(current, headers))
    });
    
    return tableRows
  }

  getTableRow = function(row, headers) {
    let generatedRow = {}
    headers.map(column => {
      if(column.key == "system") {
        generatedRow[column.key] = row.substance
      }
      if(column.key == "reference") {
        generatedRow[column.key] = row.reference.externalAuthorName
      }
      if(column.key == "compilation") {
        generatedRow[column.key] = " - "
      }
      if(column.key == "comment") {
        generatedRow[column.key] = " "
      }
      if(column.key == "adsorption") {
        generatedRow[column.key] = row.property.value
      }
      if(column.key == "system-pressure") {
        generatedRow[column.key] = " - "
      }
      if(column.key == "system-temperature") {
        generatedRow[column.key] = " - "
      }
    });
    return generatedRow
  }

  slides = function(event, element) {
    console.log("slide")
  }

  changes = function(event, element) {
    console.log("change")
  }

  getConditionalProperties = function(data) {
    return data.conditionalPropHeaders
  }

  getPrimaryProperty = function(data) {
    return data.rows[0].property
  }

  getAllProperties = function(data) {
    let properties = []
    let conditionalProperties = this.getConditionalProperties(data)
    let primaryProperty = this.getPrimaryProperty(data)
    
    for (let key in conditionalProperties) {
      conditionalProperties[key].role = "conditional";
      properties.push(conditionalProperties[key]);
    }

    primaryProperty.role = "primary"
    properties.push(primaryProperty)
    return properties
  }

  getDataByProperty = function(data:object, propertyObject: any){
    let listOfPointsForProperty
    if(propertyObject){
      if(propertyObject.role == "conditional") {
          listOfPointsForProperty = d3.nest()
            .key(function (d){ 
              let matchedId
              d.conditionalProperties.map(function(o){ 
                if(o.id == propertyObject.id) {
                  matchedId =  o.value
                }
              })
              return matchedId
            })
            .sortKeys(function(a, b) { 
              return a - b
            })
            .entries(data["rows"]);
      } else {
        listOfPointsForProperty = d3.nest()
          .key(function (d){ return d.property.value })
          .sortKeys(function(a, b) { 
            return a - b
          })
          .entries(data["rows"]);
      }
      
    }    
    return listOfPointsForProperty
  }

  getMinMaxForProperty = function(dataByProperty) {
    return [Number(d3.min(dataByProperty, function (d){ return Number(d.key); })), Number(d3.max(dataByProperty, function (d){ return Number(d.key); }))]
  }
  graphLoaded = function(el) {
    console.log(el)
  }
}