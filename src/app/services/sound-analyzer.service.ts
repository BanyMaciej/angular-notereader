import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IFrequency } from '../models/ifrequency';
import { SettingsService } from './settings.service';
import * as _ from 'underscore';

@Injectable()
export class SoundAnalyzerService {
  private audioContext;
  private analyser;
  public oscilator;
  public gainNode;

  private audioSource;

  constructor(private settingsService: SettingsService) { 
    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.oscilator = this.audioContext.createOscillator();
    this.gainNode = this.audioContext.createGain();
  }

  public getAnalyser() { return this.analyser; }

  public getUserMedia(): Observable<MediaStream> {
    return new Observable(o => {
      navigator.mediaDevices.getUserMedia({audio: true, video: false})
      .then((stream) => o.next(stream))
      .catch((err) => o.error(err));
    })
  }

  public updateAnalyserSettings() {
    console.log("sound nalayzer update!");
		this.analyser.minDecibels = this.settingsService.minDecibels;
		this.analyser.maxDecibels = this.settingsService.maxDecibels;
  }

  public init(stream) {
    this.audioSource = this.audioContext.createMediaStreamSource(stream);
    this.analyser.fftSize = 4096;
		this.analyser.minDecibels = -45;
		this.analyser.maxDecibels = -10;
		this.analyser.smoothingTimeConstant = 0.7;
    this.gainNode.gain.value = 0;

    this.audioSource.connect(this.analyser);
    this.oscilator.connect(this.gainNode).connect(this.audioContext.destination);

  }

  public processSound(): Uint8Array {
    var dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    dataArray = _.map(dataArray, this.squareFilter);

    return [].slice.call(dataArray);    
  }

  public arrayIndexToFrequency(index: number): number {
    return index * this.audioContext.sampleRate / this.analyser.fftSize;
  }

  public frequencyToArrayIndex(frequency: number): number {
    return Math.round(frequency * this.analyser.fftSize / this.audioContext.sampleRate);
  }

  public calculateMainFreq(data: Array<number>) {
    var frequencyArray = _.map(data, this.mapToFreq);
    var grouped = this.group(frequencyArray);
    var maxFrequencyGroup = _.max(grouped, group => _.max(group, item => item.frequency).amplitude);
    var leveledGroup = _.filter(maxFrequencyGroup, f => f.amplitude > 50);

    return this.weightedAvg(leveledGroup);
  }

  public calculatePower(data: Uint8Array, options?: {freq: number, delta: number}) {
    var dataArray;
    if(options) {
      var index = this.frequencyToArrayIndex(options.freq);
      dataArray = data.slice(index-options.delta, index+options.delta+1);
    } else {
      dataArray = data;
    }
    return _.reduce(dataArray, (m, v) => m + v);
  }

  private group(data: Array<IFrequency>) {
    var output = [], temp = [];
    var grouping = false;
    _.forEach(data, item => {
      if(item.amplitude > 0) {
        grouping = true;
        temp.push(item);
      } else {
        if(grouping) {
          output.push(temp);
          temp = [];
        }
        grouping = false;
      }
    })
    return output
  }

  private mapToFreq: (value: number, index: number) => IFrequency = (value, index) => {
    var freq = this.arrayIndexToFrequency(index);
    return {
      frequency: freq,
      amplitude: value
    };
  }

  private weightedAvg = (values: Array<IFrequency>) => {
    var wages = _.chain(values).map(f => f.amplitude * f.frequency).reduce((m, v) => m + v, 0).value();
    var wagesSum = _.reduce(values, (m, v) => m + v.amplitude, 0);
    return wages/wagesSum;

  }

  private squareFilter = (v: number, i: number) => {
    var min = this.settingsService.minFrequency;
    var max = this.settingsService.maxFrequency;
    var freq = this.mapToFreq(v, i);
    return (freq.frequency > min && freq.frequency < max) ? v : 0;
  }

  public log() {
    var min = this.settingsService.minFrequency;
    var max = this.settingsService.maxFrequency;
    console.log(min + " - " + max)
  }
}