import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


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

import { DataService } from './data.service';
import { GraphComponent } from './graph/graph.component';
import {MatTableModule} from '@angular/material/table';
import {CdkTableModule} from '@angular/cdk/table';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'interactive', component: InteractiveComponent },
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
    GraphComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    HttpModule,
    InterceptorMdule,
    MatTableModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})



export class AppModule { }
