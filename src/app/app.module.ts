import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ToastModule } from 'ng2-toastr';
import { AppComponent } from './app.component';
import { SmheaderComponent } from './smheader/smheader.component';
import { SmfooterComponent } from './smfooter/smfooter.component';
import { NavigationComponent } from './navigation/navigation.component';
import { InteractiveComponent } from './interactive/interactive.component';
import { HomeComponent } from './home/home.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { SmlogoComponent } from './smlogo/smlogo.component';
import { HttpClientModule } from '@angular/common/http'; 
import { HttpModule } from '@angular/http';
import { InterceptorMdule } from './http-interceptor/http-interceptor.module';
import { PipesModule } from './pipes/pipes.module';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { DataTableModule } from 'angular5-data-table';

import { DataService } from './data.service';
import { GraphComponent } from './graph/graph.component';
import { MatTableModule} from '@angular/material/table';
import { CdkTableModule} from '@angular/cdk/table';
import { RangesliderComponent } from './rangeslider/rangeslider.component';
import { OverviewComponent } from './overview/overview.component';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'overview/:propertyId', component: OverviewComponent },
  { path: 'interactive/:propertyName/:systemId1', component: InteractiveComponent },
  { path: 'interactive/:propertyName/:systemId1/:systemId2', component: InteractiveComponent },
  { path: 'interactive/:propertyName/:systemId1/:systemId2/:systemId3', component: InteractiveComponent },
  { path: '**', component: PagenotfoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    SmheaderComponent,
    SmfooterComponent,
    NavigationComponent,
    InteractiveComponent,
    HomeComponent,
    PagenotfoundComponent,
    SmlogoComponent,
    GraphComponent,
    RangesliderComponent,
    OverviewComponent,
    AutocompleteComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    HttpModule,
    InterceptorMdule,
    MatTableModule,
    PipesModule,
    SlimLoadingBarModule.forRoot(),
    BrowserAnimationsModule, 
    ToastModule.forRoot(),
    DataTableModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})



export class AppModule { }
