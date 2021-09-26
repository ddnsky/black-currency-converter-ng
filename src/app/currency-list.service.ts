import { Injectable } from '@angular/core';

import { ICurrencies } from './currency'
import { ICurrencyListService } from './infrastructure';

@Injectable()
export class CurrencyListService extends ICurrencyListService {

  private _currencies: ICurrencies = {
    'EUR': {
      name: 'euro',
      symbol: "\u20AC",
    },
    'USD': {
      name: 'dollar',
      symbol: "\u0024"
    },
    'GBP': {
      name: 'pound sterling',
      symbol: "\u00A3"
    },
    'JPY': {
      name: 'japanese yen',
      symbol: "\uFFE5"
    },
    'CNY': {
      name: 'chinese yuan',
      symbol: "CN\uFFE5"
    },
    'INR': {
      name: 'indian rupee',
      symbol: "\u20B9"
    },
    'RUB': {
      name: 'russian ruble',
      symbol: "\u20BD"
    },
    'BTC': {
      name: 'bitcoin',
      symbol: "\u20BF"
    }
  };

  get currencies(): ICurrencies {
    return this._currencies;
  }

}
