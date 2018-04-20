import { NgModule, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()

export class HttpsRequestInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //const duplicateReq = request.clone({headers: request.headers.set("Access-Control-Allow-Origin","http://sm-interactive-dev.dev.cf.private.springer.com/")});
    request.headers.set("Access-Control-Allow-Origin","http://sm-interactive-dev.dev.cf.private.springer.com/");
    console.log(request)
    return next.handle(request);
  }
};

@NgModule({
  providers: [ 
    { provide: HTTP_INTERCEPTORS, useClass: HttpsRequestInterceptor, multi: true }
  ]
})

export class InterceptorMdule {}