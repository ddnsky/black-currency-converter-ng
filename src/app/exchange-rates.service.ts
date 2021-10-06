import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpHeaders, } from '@angular/common/http';

import { Subject, Observable, of, throwError } from 'rxjs';
import { map, tap, catchError, delay } from 'rxjs/operators';

import { IExchangeRates } from './currency';
import { IExchangeRateService, IExchangeRatesRequests, IExchangeRatesRequest, ICurrencyListService } from './infrastructure';

@Injectable()
export class ExchangeRateService extends IExchangeRateService {
    private _refreshStatus: Subject<boolean> = new Subject<boolean>();
    private _rates: IExchangeRates | undefined;

    constructor(
        private http: HttpClient,
        private _curriencies: ICurrencyListService,
        private _requests: IExchangeRatesRequests) {
        super();
    }

    get exchangeRates(): IExchangeRates {
        if (!this._rates)
            //this._rates = convertDefault(_defaultExchangeRates, this._curriencies.getCurrencies());
            this._rates = this._requests[''].converter(undefined, this._curriencies.currencies)
                ?? { date: "01-01-2021", base: "EUR", rates: { "EUR": 1 } };
        return this._rates;
    }

    get refreshStatus(): Subject<boolean> {
        return this._refreshStatus;
    }

    refresh(): void {
        this.refreshStatus.next(true);
        const request = this._requests['api.currencyfreaks.com'];
        //const request = this._requests['www.ecb.europa.eu'];
        //const request = this._requests['cdn.jsdelivr.net'];
        //const request = this._requests["test-data"];

        this.getExchangeRates(request)
            .subscribe(
                response => {
                    if (response) {
                        response.request = request.url;
                        response.date = response.date || (new Date()).toLocaleDateString();
                        this._rates = response;
                    }
                    else {
                        alert("ERROR parsing response");
                    }
                    this.refreshStatus.next(false);
                },
                error => {
                    console.error('There was an error!', error);
                    alert("ERROR " + error.message);
                    this.refreshStatus.next(false);
                },
            )
    }

    getExchangeRates(request: IExchangeRatesRequest): Observable<IExchangeRates | null> {
        // maybe alredy have results? 
        if (this._rates && this._rates.request === request.url) {
            let date_old = (new Date(this._rates.date)).toLocaleDateString();
            let date_new = (new Date()).toLocaleDateString();
            if (date_old === date_new)
                return of(this._rates).pipe(delay(2000));
        }

        // for testing 
        if (!request.url || !request.responseType) {
            return of(request.converter(undefined, this._curriencies.currencies)).pipe(delay(2000));
        }

        // headers for CORS
        var headers = (new HttpHeaders())
            .append('Access-Control-Allow-Origin', '*')
            .append('Access-Control-Allow-Methods', 'GET,OPTIONS')
            ;
        var observable = request.responseType === 'json'
            ? this.http.get(request.url, { headers: headers, observe: 'response' })
            : this.http.get(request.url, { headers: headers, observe: 'response', responseType: 'text' });

        return observable.pipe(
            map((response: HttpResponse<any>) => {
                return response.ok && response.status === 200
                    ? request.converter(response.body, this._curriencies.currencies)
                    : throwError(response);
            }),
            catchError((error: HttpErrorResponse, orig: Observable<any>) => {
                return throwError(error);
            }));
    }
}


