import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgModel } from '@angular/forms';

import { ICurrencies, ICurrencyValue } from './../currency';
import { ICurrencyConverter, ICurrencyListService } from './../infrastructure';
import { Coins } from "./../Coins";
import { IBindableValue } from './../IBindableValue'

@Component({
  selector: 'money-input',
  templateUrl: './money-input.component.html',
  styleUrls: ['./money-input.component.css']
})
export class MoneyComponent implements OnInit, OnDestroy {

  @Input() currencies: ICurrencies = {} as ICurrencies;
  @Input() originAmount: IBindableValue<ICurrencyValue> | null = null;
  @Input() converter: ICurrencyConverter | null = null;
  @Input() initialCode: string = "EUR";

  currencyCodes: string[] = [];

  coins: Coins = new Coins(1, "EUR", { name: 'euro', symbol: "\u20A0" });
  private _subscriptions: Subscription[] = [];

  @Output()
  errorMessage: EventEmitter<string> = new EventEmitter<string>();

  //@ViewChild(NgModel) money?: NgModel;
  //@ViewChild(NgModel) moneyInputModel: NgModel;   
  moneyInput: string = "25"
  currencyPattern = new RegExp(`\[,\]`, 'g');


  constructor(private currensiesList: ICurrencyListService) { }

  ngOnInit() {
    this.currencyCodes = Object.keys(this.currencies);
    if (this.originAmount) {
      const coins = this.originAmount.getValue();
      this.coins.assign(coins);
      this._subscriptions.push(this.originAmount.onChanged.subscribe((x) => { this.onMainAmountChanged(x[0], x[1]); }));
      this.onCurrencySelection(this.initialCode);
    }
  }

  onCurrencySelection(newCurrencyCode: string) {
    //console.log(`onCurrencySelection(${newCurrencyCode})`)
    if (this.coins.code != newCurrencyCode) {
      let newCoins = this.coins.coins;
      if (this.converter && this.originAmount) {
        newCoins = this.converter.convert(this.originAmount.getValue(), newCurrencyCode);
      }
      this.coins._value = newCoins;
      this.coins._code = newCurrencyCode;
      this.coins._currency = this.currensiesList.currencies[newCurrencyCode];
    }
  }

  onMainAmountChanged(sender: IBindableValue<ICurrencyValue>, activator: any) {
    //console.log("onMainAmountChanged " + sender.getValue().coins + " " + sender.getValue().code + "  " + (this == activator));
    if (this != activator) {
      let orig = sender.getValue();
      let newCoins = this.converter?.convert(orig, this.coins.code) ?? this.coins.coins;
      this.coins._value = newCoins;
    }
  }

  onInput(newValueStr: string) {
    console.log("onCurrencySelection", newValueStr)
    if (this.converter && this.originAmount) {
      let newValue = { coins: +newValueStr, code: this.coins._code, currency: this.coins._currency };
      let orig = this.originAmount.getValue();
      let newCoins = this.converter.convert(newValue, orig.code);
      let newOrig = { coins: newCoins, code: orig.code, currency: orig.currency };
      this.originAmount.setValue(newOrig, this);
    }
  }

  ngOnDestroy() {
    while (this._subscriptions.length > 0) {
      this._subscriptions[this._subscriptions.length - 1].unsubscribe();
      this._subscriptions.pop();
    }
  }
}
