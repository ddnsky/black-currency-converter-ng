import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

import { MoneyComponent } from './money-input/money-input.component';
import { CurrencySelectorComponent } from './currency-selector/currency-selector.component'
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { CurrencyListComponent } from './currency-list/currency-list.component'

import { IExchangeRateService, ICurrencyConverter, IExchangeRatesRequests, ICurrencyListService } from './infrastructure'
import { someRequests } from './exchange-rates.requests';
import { CurrencyConverter } from './CurrencyConverter'
import { CurrencyListService } from './currency-list.service';
import { ExchangeRateService } from './exchange-rates.service';

@NgModule({
  declarations: [
    AppComponent,
    MoneyComponent,
    CurrencySelectorComponent,
    LoadingSpinnerComponent,
    CurrencyListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    { provide: ICurrencyListService, useClass: CurrencyListService },
    { provide: IExchangeRatesRequests, useValue: someRequests },
    { provide: IExchangeRateService, useClass: ExchangeRateService },
    { provide: ICurrencyConverter, useClass: CurrencyConverter },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
