import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { dutyModel } from './dutyModel';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { IDuty } from './duty.interface';

@Injectable({
  providedIn: 'root'
})
export class DutyService {
  apiURL = 'http://localhost:9001/duties';
  
  constructor(private http: HttpClient) { }

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }  

  // HttpClient API get() method => Fetch duties list
  getDutiesList(): Observable<dutyModel[]> {
    return this.http.get<dutyModel[]>(this.apiURL + '/all')
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  // HttpClient API get() method => Fetch duty
  getDuty(id: string): Observable<dutyModel> {
    return this.http.get<dutyModel>(this.apiURL + '/get/' + id)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }  

  // HttpClient API post() method => Create duty
  createDuty(duty: IDuty): Observable<dutyModel> {
    console.log('trying to save', JSON.stringify(duty));
    return this.http.post<dutyModel>(this.apiURL + '/addDuty', JSON.stringify(duty), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }  

  // HttpClient API put() method => Update duty
  updateDuty(id: string, duty: IDuty): Observable<dutyModel> {
    console.log('trying to update', id, duty);
    return this.http.put<dutyModel>(this.apiURL + '/update/' + id, JSON.stringify(duty), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  // HttpClient API delete() method => Delete duty
  deleteDuty(id: string){
    return this.http.delete<dutyModel>(this.apiURL + '/delete/' + id, this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  // Error handling 
  handleError(error: any) {
     let errorMessage = '';
     if(error.error instanceof ErrorEvent) {
       // Get client-side error
       errorMessage = error.error.message;
     } else {
       // Get server-side error
       errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
     }
     window.alert(errorMessage);
     return throwError(errorMessage);
  }

}
