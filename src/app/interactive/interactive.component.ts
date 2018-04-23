import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Rx';
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
  tableHeaders = []
  tableData = []
  //dataUrl = '/assets/json/data.json';
  dataUrl = 'http://sm-interactive-dev.dev.cf.private.springer.com/interactive?systemId=32223&propertyId=Adsorption';

  constructor(private route: ActivatedRoute, private dataService:DataService) { }
  
  ngOnInit(){
    this.dataService.getData(this.dataUrl, [])
    .subscribe((result:any) => {
      this.detailPage = result
      this.graphData = { points: result.rows, type: "line" }

      this.tableHeaders =  result.columnHeaders.map(column => {
        return column.name;
      });
      
      this.tableData = this.getTableRows(result.rows, this.tableHeaders);
    });
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
      if(column == "System") {
        generatedRow[column.toLowerCase()] = row.substance
      }
      if(column == "Reference") {
        generatedRow[column.toLowerCase()] = row.reference.externalReference
      }
      if(column == "Compilation") {
        generatedRow[column.toLowerCase()] = row.reference.externalAuthorName
      }
      if(column == "Comment") {
        generatedRow[column.toLowerCase()] = row.comments
      }
      if(column == "Adsorption") {
        generatedRow[column.toLowerCase()] = row.property.value
      }
      if(column == "System Pressure") {
        generatedRow[column.toLowerCase().replace(" ", "-")] = " - "
      }
      if(column == "System Temperature") {
        generatedRow[column.toLowerCase().replace(" ", "-")] = " - "
      }
    });
    return generatedRow
  }
}

