import { Component, OnInit, OnChanges, ViewContainerRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { DataTable, DataTableResource } from 'angular5-data-table';

import { DataService } from '../data.service';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})

export class OverviewComponent implements OnInit {
  propertyId: any
  substance = []
  pureSubstance =  {}
  substanceResources: any
  
  constructor( private route: ActivatedRoute, private dataService:DataService, private router: Router, private loader: SlimLoadingBarService, public toastr: ToastsManager, vcr: ViewContainerRef) { 
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.loader.start()
    this.route.params.subscribe( (params:any ) => {
      this.propertyId = params.propertyId

      let dataUrl = `https://sm-interactive-dev.dev.cf.private.springer.com/interactive/overview/adsorption?propertyId=${this.propertyId}`;
      this.dataService.getData(dataUrl, [])
        .subscribe(
          data => {
            this.substance = this.getAllSubstanceData(data)
            this.loader.complete()
            this.toastr.success('Data loaded', 'Hurrrr!');
          },
          error => {
            
            this.loader.complete()
            this.toastr.error('This is not good!', 'Oops!');
          }
        );
    });
  }

  getAllSubstanceData = function(data) {
    let substanceArray = []
    let headerArr = []
    if(data.allSystemsTable.rows.length > 0) {

      let firstRow = data.allSystemsTable.rows[0]
      let headerKeys = Object.keys(firstRow);
      let headers = [];
      for (let prop of headerKeys) { 
        headers.push({"value": prop, "key": prop});
        headerArr.push(prop)
      }
      
      substanceArray['headers'] = headers
      substanceArray['data'] = data.allSystemsTable.rows;
      
    }     
    return substanceArray
  }

  getMixtureData = function(data) {
    if(data.mixtureTable.rows.length > 0) {
      return data.mixtureTable
    } else{
      return []
    }
  }

  getPureSubstanceData = function(data) {
    let substanceArray = {}
    let headerArr = []
    if(data.pureSubstanceTable.rows.length > 0) {
      let headerKeys = Object.keys(data.pureSubstanceTable.header);
      let headers = [];
      for (let prop of headerKeys) { 
        headers.push({"value": data.pureSubstanceTable.header[prop], "key": prop});
        headerArr.push(data.pureSubstanceTable.header[prop])
      }
      
      substanceArray['headers'] = headers
      substanceArray['headersArray'] = headerArr;
      substanceArray['data'] = data.pureSubstanceTable.rows;
      
    } 
    
    return substanceArray
  }

  clickedOnRow = function(e) {
    this.router.navigateByUrl(`interactive/Adsorption/${e.row.item.systemId}`)
  }
  

}