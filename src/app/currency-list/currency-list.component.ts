import { Component, Input, OnChanges, SimpleChanges, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { ICurrencies, ICurrency, IExchangeRates, ICurrencyValue } from './../currency';
import { IBindableValue } from './../IBindableValue';

type Details = { [key: string]: ICurrency & { index: number; rate: number }; };

@Component({
  selector: 'simple-currency-list',
  templateUrl: './currency-list.component.html',
  styleUrls: ['./currency-list.component.css']
})

export class CurrencyListComponent implements OnChanges, OnInit, OnDestroy {

  //@Input() responseErrorMessage: string = "responseErrorMessage";
  @Input() currencies: ICurrencies = {} as ICurrencies;
  @Input() rates: IExchangeRates = {} as IExchangeRates;
  @Input() originAmount: IBindableValue<ICurrencyValue> | null = null;

  details: Details | null = null;
  amount: number = 1;
  private _subscriptions: Subscription[] = [];

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

  ngOnInit() {
    if (this.originAmount) {
      const coins = this.originAmount.getValue();
      this.amount = coins.coins;
      this._subscriptions.push(this.originAmount.onChanged.subscribe((x) => { this.onMainAmountChanged(x[0]); }));
    }
  }
  onMainAmountChanged(sender: IBindableValue<ICurrencyValue>) {
    this.amount = sender.getValue().coins;
  }
  ngOnDestroy() {
    while (this._subscriptions.length > 0) {
      this._subscriptions[this._subscriptions.length - 1].unsubscribe();
      this._subscriptions.pop();
    }
  }



}
