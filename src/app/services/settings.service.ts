import { Injectable } from '@angular/core';

@Injectable()
export class SettingsService {
  private _minDecibels = -50;
  private _maxDecibels = -10;

  private _minFrequency = 200;
  private _maxFrequency = 2000;

  private _minimumLevel = 10;

  private _smoothingBufferSize = 10;

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

  get minimumLevel() {
    return this._minimumLevel;
  }

  set minimumLevel(minimumLevel: number) {
    this._minimumLevel = minimumLevel;
  }

  get smoothingBufferSize() {
    return this._smoothingBufferSize;
  }

  set smoothingBufferSize(smoothingBufferSize: number) {
    this._smoothingBufferSize = smoothingBufferSize;
  }
  
  getValues() {
    return {
      minDecibels: +localStorage.getItem("minDecibels") || -50,
      maxDecibels: +localStorage.getItem("maxDecibels") || -10,
      minFrequency: +localStorage.getItem("minFrequency") || 200,
      maxFrequency: +localStorage.getItem("maxFrequency") || 2000,
      minimumLevel: +localStorage.getItem("minimumLevel") || 10,
      smoothingBufferSize: +localStorage.getItem("smoothingBufferSize") || 10
    };
  }

  saveValues() {
    localStorage.setItem("minDecibels", this._minDecibels.toString());
    localStorage.setItem("maxDecibels", this._maxDecibels.toString());

    localStorage.setItem("minFrequency", this._minFrequency.toString());
    localStorage.setItem("maxFrequency", this._maxFrequency.toString());

    localStorage.setItem("minimumLevel", this._minimumLevel.toString());

    localStorage.setItem("smoothingBufferSize", this._smoothingBufferSize.toString());
  }
}