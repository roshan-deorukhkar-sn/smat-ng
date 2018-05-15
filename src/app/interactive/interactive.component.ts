import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, RoutesRecognized } from '@angular/router';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Rx';
import * as d3 from "d3";
import * as _ from "lodash";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { DataTable, DataTableResource } from 'angular5-data-table';

declare var $: any;

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
  substanceList = []
  sysId1 = ""
  sysId2 = ""
  sysId3 = ""
  propId = ""
  properties = []
  originalData: DetailPage
  //dataUrl = '/assets/json/data.json';
  dataUrl = "";
  xAxis = ""
  compareUrl = "https://materials.springer.com/interactive/comparableSystems?term=prop&isPure=false&primaryProperty=63|53&conditionalProperties=3|5&conditionalProperties=2|25&systemId=32086&systemId=32223"
  lodaedGraphData = []
  autocompleteOptions = {};
  

  

  constructor(private route: ActivatedRoute, 
              private dataService:DataService, 
              private loader: SlimLoadingBarService, 
              public toastr: ToastsManager, 
              vcr: ViewContainerRef,
              private router: Router) 
  { 
    this.toastr.setRootViewContainerRef(vcr);
  }
  
  

  ngOnInit(){
    this.loader.start()
   // console.log(this.route.paramMap.getAll(""))
    this.route.params.subscribe( (params:any ) => {
      this.propId = params.propertyName
      this.sysId1 = params.systemId1
      this.dataUrl = `http://sm-interactive-dev.dev.cf.private.springer.com/interactive?systemId=${this.sysId1}&propertyId=${this.propId}`
      if(params.systemId2) {
        this.sysId2 = params.systemId2
        this.dataUrl = `http://sm-interactive-dev.dev.cf.private.springer.com/interactive?systemId=${this.sysId1}&systemId=${this.sysId2}&propertyId=${this.propId}`
      }

      if(params.systemId3) {
        this.sysId3 = params.systemId3
        this.dataUrl = `http://sm-interactive-dev.dev.cf.private.springer.com/interactive?systemId=${this.sysId1}&systemId=${this.sysId2}&systemId=${this.sysId3}&propertyId=${this.propId}`
      }

      //this.dataUrl = `http://sm-interactive-dev.dev.cf.private.springer.com/interactive?systemId=${this.sysId1}&propertyId=${this.propId}`
      //this.dataUrl = "http://sm-interactive-dev.dev.cf.private.springer.com/interactive?systemId=32070&systemId=32223&propertyId=Adsorption" */
    });

    this.dataService.getData(this.dataUrl, [])
      .subscribe(
        (result:any) => {
          this.detailPage = result
          this.originalData = result
          //console.log(this.originalData)
          result.columnHeaders.map(column => {
            this.tableHeaders.push({"key" : column.name.toLowerCase().replace(" ", "-"), "value": column.name });
          });
          
          this.tableData = this.getTableRows(result.rows, this.tableHeaders);
          
          this.getAllProperties(result).map(current => {
            this.sliderData.push(this.getSliderDataForProperty(current, this.getDataByProperty(result, current)))
            if(current.role == "conditional") {
              this.properties.push(current)
            }
          });
          
          this.xAxis = this.properties[0].name

          this.graphData = { 
            points: result.rows, 
            type: "line", 
            xAxis: this.xAxis,
            yAxis: "Adsorption",
            lineAxis: "System Temperature",
            colorTheme: ['#7DC215','#F5A623','#3FBAE4'],
            graphData: this.getRowsForGraph(result.rows, this.getAllProperties(result)) 
          }

          this.autocompleteOptions = {
            source: this.compareUrl,
            minLength: 3
          }

          this.substanceList = Object.keys( this.getSubstanceList(result) )

          this.loader.complete()
          this.toastr.success('Data loaded!', 'Success!');
          
        },
        error => {
          
          this.loader.complete()
          this.toastr.error('This is not good!', 'Oops!');
        }
      );
  }

  getPropertyName = function(propertyData) {
    return propertyData.name
  }

  getConditionalPropertyDataById = function(result, id) {
    return this.getConditionalProperties(result)[id]
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
    dataObject['options'] = {}
    dataObject['name'] = property.role + "-" + property.id
    dataObject['title'] = property.name
    dataObject['id'] = property.id   
    dataObject['role'] = property.role
    dataObject['options']['range'] = true
    dataObject['options']['min'] = range[0]
    dataObject['options']['max'] = range[1]
    dataObject['options']['values'] = range
    dataObject['options']['step'] = this.getStepValue(range[0], range[1])
    return dataObject
  }

  getStepValue = function(min, max) {
    let diff;
    diff = max-min
    return diff/1000;
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

  getRowsForGraph = function(data, properties) {
    let rows = [];
    
    let propertyList:any
    data.map(eachRow => {
      let row = {};
      properties.map(property => {
        if(property.role == "conditional") {
          propertyList = this.getConditionalPropertyFromRow(eachRow, property)
          row[property.name] = Number(propertyList.value);
          row["unit"] = "K"         
        }
        else {
          row[property.name] = Number(eachRow.property.value)
          row["unit"] = "K" 
        }
        
      });
      row["substance"] = eachRow.substance;
      rows.push(row)
    })
    return rows
  }

  getConditionalProperties = function(data) {
    return data.conditionalPropHeaders
  }

  getSelectedPropertyById = function(data, id) {
    let allProperties = this.getAllProperties(data)
  }

  getPrimaryProperty = function(data) {
    return data.rows[0].property
  }

  getConditionalPropertyFromRow = function (data, property) {
    for (let key in data.conditionalProperties) {
      if(data.conditionalProperties[key].id == property.id) {
        return data.conditionalProperties[key]
      }
    }
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

  getClosestPoint(point,points) {
    let sortedPoints = _.sortBy(points);
    let closestVal:any, isSelected:boolean
    isSelected = false
    sortedPoints.map(  (current) => {
      if((current >= Number(point) && !isSelected)){
        closestVal = current
        isSelected = true
      }
    })
    return closestVal;
  }

  sortNumber = function(a, b) {
    return (a - b)
  }
    

  graphLoaded = function(el) {
    this.lodaedGraphData = el

    this.resetXOverlay()
    this.resetYOverlay()
  }

  slides = function(element, event ) {
    if(element.target.getAttribute("data-sliderRole") == "primary") {
      let propertyData = this.getPrimaryProperty(this.detailPage)
      let range = this.getRangeFromDataByProperty(event.values, propertyData)
      this.createCurtainForPrimaryProperty(range)
    }
    if(element.target.getAttribute("data-sliderRole") == "conditional") {
      let conditionalPropertyData = this.getConditionalPropertyDataById(this.detailPage, this.onPropertySelectLoaded())
      let range = this.getRangeFromDataByProperty(event.values, conditionalPropertyData)    
      if(element.target.getAttribute("data-sliderId") == this.onPropertySelectLoaded()) {
        this.createCurtainForConditionalProperty(range)
      }
    }
  }

  getRangeFromDataByProperty = function(values, propertyData) {
    let dataPointsByProperty = []
    let dataPointsKeysByProperty = this.getDataByProperty(this.detailPage, propertyData)
    $.each(dataPointsKeysByProperty, (index, val) => {
      dataPointsByProperty.push(Number(val.key))
    });
    
    let minVal = this.getClosestPoint(values[0], dataPointsByProperty)
    let maxVal = this.getClosestPoint(values[1], dataPointsByProperty)

    return [minVal, maxVal]
  }

  createCurtainForPrimaryProperty = function(minMaxArray) {
    let closestYMinPosition = this.lodaedGraphData.scale[1](minMaxArray[0])
    let closestYMaxPosition = this.lodaedGraphData.scale[1](minMaxArray[1])
    let boxData = d3.select(this.lodaedGraphData[0]).selectAll(".domain").nodes()[0].getBBox()
    let xAxisDim = d3.select(this.lodaedGraphData[0]).selectAll(".legend-group").nodes()[0].getBBox()
    //console.log(boxData)
    let HeightYminOverlay = (boxData.height - closestYMinPosition)
    let HeightYmaxOverlay = closestYMaxPosition
    let minTop = (boxData.height - HeightYminOverlay) + (xAxisDim.height + 35);
    let maxTop = boxData.height

    $('.overlay-marker-y-min').width(boxData.width);
    $('.overlay-marker-y-min').height(HeightYminOverlay);
    $('.overlay-marker-y-min').css("left", (boxData.x + 80)  + "px");
    $('.overlay-marker-y-min').css("top", minTop + "px");

    $('.overlay-marker-y-max').width(boxData.width);
    $('.overlay-marker-y-max').height(HeightYmaxOverlay);
    $('.overlay-marker-y-max').css("left", (boxData.x + 80)  + "px");
    $('.overlay-marker-y-max').css("top", (xAxisDim.height + 35) + "px");
  }

  createCurtainForConditionalProperty = function(minMaxArray) {
    let closestXMinPosition = this.lodaedGraphData.scale[0](minMaxArray[0])
    let closestXMaxPosition = this.lodaedGraphData.scale[0](minMaxArray[1])
    let boxData = d3.select(this.lodaedGraphData[0]).selectAll(".domain").nodes()[0].getBBox()
    let xAxisDim = d3.select(this.lodaedGraphData[0]).selectAll(".legend-group").nodes()[0].getBBox()
    let EndXPosition = boxData.width
    let widthXminOverlay = closestXMinPosition - boxData.x
    let widthXmaxOverlay = EndXPosition - closestXMaxPosition
    let minLeft = boxData.x
    let top = boxData.y
    let maxLeft = (EndXPosition - widthXmaxOverlay) + 81


    $('.overlay-marker-x-min').width(widthXminOverlay);
    $('.overlay-marker-x-min').height(boxData.height);
    $('.overlay-marker-x-min').css("left", (81) + "px");
    $('.overlay-marker-x-min').css("top", (xAxisDim.height + 35) + "px");

    $('.overlay-marker-x-max').width(widthXmaxOverlay);
    $('.overlay-marker-x-max').height(boxData.height);
    $('.overlay-marker-x-max').css("left", (maxLeft) + "px");
    $('.overlay-marker-x-max').css("top", (xAxisDim.height + 35) + "px");
  }

  changes = function(event, element) {
    console.log("change")
  }
  onPropertySelect = function(event) {
    console.log(event.value);
  }
  onPropertySelectLoaded = function() {
    return $("select").val()
  }

  filter = function() {
    let conditionalPropertyId = this.onPropertySelectLoaded()
    let primaryProperty = this.getPrimaryProperty(this.detailPage)
    let conditionalPropertyValues = this.getConditionalPropertySliderValues(conditionalPropertyId)
    let primaryPropertyValues = this.getPrimaryPropertySliderValues(primaryProperty.id)

    let filteredData  = this.filterData(this.detailPage, conditionalPropertyValues,primaryPropertyValues)
    this.tableData = this.getTableRows(filteredData.rows, this.tableHeaders);
    
    this.graphData = { 
      points: filteredData.rows, 
      type: "line", 
      xAxis: this.xAxis,
      yAxis: "Adsorption",
      lineAxis: "System Temperature",
      colorTheme: ['#7DC215','#F5A623','#3FBAE4'],
      graphData: this.getRowsForGraph(filteredData.rows, this.getAllProperties(filteredData)) 
    }
    this.sliderData = []
    this.getAllProperties(filteredData).map(current => {
      this.sliderData.push(this.getSliderDataForProperty(current, this.getDataByProperty(filteredData, current)))
      if(current.role == "conditional") {
        this.properties.push(current)
      }
    });
    //console.log(this.originalData)
  }

  getConditionalPropertySliderValues = function(propertyId) {
    return $(`.conditional-${propertyId}`).slider( "option", "values" )
  }

  getPrimaryPropertySliderValues = function(propertyId) {
    return $(`.primary-${propertyId}`).slider( "option", "values" )
  }

  filterData = function(data, xRange, yRange) {
    let filteredRows = [];
    let instance = this
    $.each(data.rows, function(index, row) {
        let conditionalProperty, filterIndex, i, len, ref;
        filterIndex = false;

        
        if (Number(row.property.value) >= yRange[0] && Number(row.property.value) <= yRange[1]) {
          filterIndex = true;
          conditionalProperty = instance.getSelectedConditionalPropertyDataFromRow(row)
          if (!(Number(conditionalProperty.value) >= xRange[0] && Number(conditionalProperty.value) <= xRange[1])) {
            filterIndex = false;
          }
         }
        if (filterIndex) {
          return filteredRows.push(row);
        }
    });
    data.rows = filteredRows;
    return data;
  }

  getSelectedConditionalPropertyDataFromRow = function(row) {
    let instance = this
    let property;
    $.each(row.conditionalProperties, (index, eachConditionalProperty) =>
    {
      if(eachConditionalProperty.id == Number(instance.onPropertySelectLoaded())) {
        property = eachConditionalProperty; 
      }
    });

    return property
  }
  resetXOverlay = function() {
    $('.overlay-marker-x-min').width(0)
    $('.overlay-marker-x-min').height(0)
    $('.overlay-marker-x-max').removeAttr("style")
  }

  resetYOverlay = function() {
    $('.overlay-marker-y-min').width(0)
    $('.overlay-marker-y-min').height(0)
    $('.overlay-marker-y-max').removeAttr("style")
  }

  select = function(event){
    let item = event[1].item
    let e = event[0]
    this.router.navigateByUrl(`${this.router.url}/${item.SystemId}`)
  }

  reset = function() {
    this.loader.start()
    this.tableData = this.getTableRows(this.originalData.rows, this.tableHeaders);
    
    this.getAllProperties(this.originalData).map(current => {
      this.sliderData = this.getSliderDataForProperty(current, this.getDataByProperty(this.originalData, current))
      if(current.role == "conditional") {
        this.properties.push(current)
      }
    });
    
    this.xAxis = this.properties[0].name

    this.graphData = { 
      points: this.originalData.rows, 
      type: "line", 
      xAxis: this.xAxis,
      yAxis: "Adsorption",
      lineAxis: "System Temperature",
      colorTheme: ['#7DC215','#F5A623','#3FBAE4'],
      graphData: this.getRowsForGraph(this.originalData.rows, this.getAllProperties(this.originalData)) 
    }

    

    this.autocompleteOptions = {
      source: this.compareUrl,
      minLength: 3
    }

    this.loader.complete()
    this.toastr.success('Data loaded!', 'Success!');
  }

  getSubstanceList = function(data) {
    return _.mapValues(_.groupBy(data.rows, 'substance'), clist => clist.map(row => row))
  }
}