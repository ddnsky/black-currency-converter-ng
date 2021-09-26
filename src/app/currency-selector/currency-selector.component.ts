import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'simple-currency-selector',
  templateUrl: './currency-selector.component.html',
  styleUrls: ['./currency-selector.component.css']
})
export class CurrencySelectorComponent implements OnInit {
  static gCount: number = 0;

  @Input()
  currencyCodes: string[] = ["???"];
  @Input() currentCurrencyCode: string = "???";

  @Output()
  selectedCurrency: EventEmitter<string> = new EventEmitter<string>();

  groupNumber = CurrencySelectorComponent.gCount;

  constructor() {
    CurrencySelectorComponent.gCount = CurrencySelectorComponent.gCount + 1;
  }

  ngOnInit() {
    //this.currentCurrencyCode = this.currencyCodes[this.groupNumber % this.currencyCodes.length];
  }

  onChange(event: Event) {
    this.currentCurrencyCode = (<HTMLInputElement>event.target).value;
    this.selectedCurrency.emit(this.currentCurrencyCode);
  }

}
