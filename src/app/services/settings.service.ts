import { Injectable } from '@angular/core';

@Injectable()
export class SettingsService {
  private _minDecibels = -50;
  private _maxDecibels = -10;

  private _minFrequency = 200;
  private _maxFrequency = 2000;

  private smoothingBufferSize = 4;

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

  get minFrequency() {
    return this._minFrequency;
  }
  set minFrequency(minFrequency: number) {
    this._minFrequency = minFrequency;
  }

  get maxFrequency() {
    return this._maxFrequency;
  }
  set maxFrequency(maxFrequency: number) {
    this._maxFrequency = maxFrequency;
  }

}