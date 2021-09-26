import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Subject } from 'rxjs';


import { ICurrencies, ICurrencyValue, IExchangeRates } from './currency';
import { IBindableValue } from './IBindableValue';
import { ICurrencyConverter, IExchangeRateService, ICurrencyListService } from './infrastructure';
import { Coins } from "./Coins";


class BindableCoins implements IBindableValue<ICurrencyValue> {
  private _onChanged = new Subject<[IBindableValue<ICurrencyValue>, any]>();

  constructor(private _coins: Coins) {
  }
  getValue(): ICurrencyValue {
    return this._coins;
  }
  setValue(newValue: Coins, actor: any = null): void {
    if (!this._coins.isEqual(newValue)) {
      this._coins.assign(newValue);
      this.notify(actor);
    }
  }
  get onChanged(): Subject<[IBindableValue<ICurrencyValue>, any]> {
    return this._onChanged;
  }
  notify(activator: any = null) {
    this._onChanged.next([this, activator]);
  }
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  private subscription: Subscription | null = null;

  currencies: ICurrencies;
  originAmount: IBindableValue<ICurrencyValue>;
  isRefreshing: boolean = false;

  get converter(): ICurrencyConverter {
    return this._converter;
  }
  get rates(): IExchangeRates {
    return this._exchangeRateService.exchangeRates;
  }
  get lastUpdated(): string {
    return this.rates.date;
  }

  initialInputsCodes: string[] = ["EUR", "RUB", "BTC", "USD", "GBP"];
  inputsCount: number = 3;
  addInputs(n: number): void {
    this.inputsCount = Math.min(Math.max(0, this.inputsCount + n), this.initialInputsCodes.length);
  }

  constructor(
    private _currencyListService: ICurrencyListService,
    private _exchangeRateService: IExchangeRateService,
    private _converter: ICurrencyConverter
  ) {
    this.currencies = this._currencyListService.currencies;
    const _code = "EUR";
    const _coins = new Coins(1, _code, this.currencies[_code]);
    this.originAmount = new BindableCoins(_coins);
    this.subscription = this._exchangeRateService.refreshStatus.subscribe((x) => this.onExchangeRateRefresh(x));
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  onExchangeRateRefresh(newState: boolean) {
    this.isRefreshing = newState;
    if (!newState) {
      this.originAmount.notify(null);
    }
  }

  refresh(): void {
    if (!this.isRefreshing) {
      this._exchangeRateService.refresh();
    }
  }
}
