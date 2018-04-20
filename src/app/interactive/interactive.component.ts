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
  //dataUrl = '/assets/json/data.json';
  dataUrl = 'http://sm-interactive-dev.dev.cf.private.springer.com/interactive?systemId=32223&propertyId=Adsorption';
  constructor(private route: ActivatedRoute, private dataService:DataService) {
    
  }
  
  ngOnInit(){
    this.dataService.getData(this.dataUrl, [])
    .subscribe((result:any) => {
      this.detailPage = result
      this.graphData = { points: result.rows, type: "line" }
    });
  }
}
