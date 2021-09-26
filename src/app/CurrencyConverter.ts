import { Injectable } from '@angular/core';
import { IExchangeRates, ICurrencyValue } from './currency'
import { ICurrencyConverter, IExchangeRateService } from './infrastructure'


@Injectable()
export class CurrencyConverter implements ICurrencyConverter {
    private _rates: IExchangeRates;

    constructor(_exchangeRateService: IExchangeRateService) {
        this._rates = _exchangeRateService.exchangeRates;
        _exchangeRateService.refreshStatus.subscribe((x) => { if (!x) this._rates = _exchangeRateService.exchangeRates; });
    }

    // rate to base currency
    getBaseRate(toCurrency: string): number {
        const rates = this._rates;
        if (toCurrency != rates.base) {
            let found: undefined | number = rates.rates[toCurrency];
            if (typeof found === "number")
                return found;
            return 0;
        }
        return 1;
    }

    // returns calculated value of toCurrency
    convert(fromValue: ICurrencyValue, toCurrency: string): number {
        if (fromValue.code == toCurrency)
            return fromValue.coins;

        const basetoCurrency = this.getBaseRate(toCurrency);
        if (fromValue.code == this._rates.base)
            return fromValue.coins * basetoCurrency;

        let toBase = this.getBaseRate(fromValue.code);
        return (fromValue.coins * basetoCurrency) / toBase;
    }
}
