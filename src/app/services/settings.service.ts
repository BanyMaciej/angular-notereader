import { Injectable } from '@angular/core';

@Injectable()
export class SettingsService {
  private _minDecibels = -50;
  private _maxDecibels = -10;

  constructor() { }

  get minDecibels() {
    return this._minDecibels;
  }
  set minDecibels(minDecibels: number) {
    this._minDecibels = minDecibels;
  }

  get maxDecibels() {
    return this._maxDecibels;
  }
  set maxDecibels(maxDecibels: number) {
    this._maxDecibels = maxDecibels;
  }

}