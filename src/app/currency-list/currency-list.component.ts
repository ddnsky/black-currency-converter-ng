import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { ICurrencies, ICurrency, IExchangeRates } from './../currency';

type Details = { [key: string]: ICurrency & { index: number; rate: number }; };

@Component({
  selector: 'simple-currency-list',
  templateUrl: './currency-list.component.html',
  styleUrls: ['./currency-list.component.css']
})

export class CurrencyListComponent implements OnChanges {

  @Input() responseErrorMessage: string = "responseErrorMessage";
  @Input() currencies: ICurrencies = {} as ICurrencies;
  @Input() rates: IExchangeRates = {} as IExchangeRates;
  @Input() amount: number = 1;
  details: Details | null = null;

  ngOnChanges(changes: SimpleChanges) {
    const rates = changes.rates;
    const keys = Object.keys(this.currencies);
    if (
      rates && rates.currentValue && (!rates.previousValue ||
        (rates.previousValue && rates.previousValue.baseCurrencyCode !== rates.currentValue.baseCurrencyCode))
    ) {
      //this.wCurrencies = {};
      //for (var key in this.currencies)
      //this.wCurrencies[key] = { ...this.currencies[key], rate: this.rates.rates[key] };
      var index = 0;
      this.details = keys
        .filter(key => key !== this.rates.base)
        .reduce((prevValue, currentValue) => {
          prevValue[currentValue] = { ...this.currencies[currentValue], index: index++, rate: this.rates.rates[currentValue] };
          return prevValue;
        }, {} as Details);
    }
  }

  customListOrder(obj1: any, obj2: any): number {
    return obj1.value.index - obj2.value.index;
  }

}
