import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IFrequency } from '../models/ifrequency';
import { SettingsService } from './settings.service';
import * as _ from 'underscore';

@Injectable()
export class SoundAnalyzerService {
  private audioContext;
  private analyser;
  private oscilator;
  private gainNode;

  private audioSource;
  private dataArray;

  constructor(private settingsService: SettingsService) { 
    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.oscilator = this.audioContext.createOscillator();
    this.gainNode = this.audioContext.createGain();
  }

  public getAnalyser() {
    return this.analyser;
  }

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
    this.analyser.fftSize = 2048;
		this.analyser.minDecibels = -45;
		this.analyser.maxDecibels = -10;
		// this.analyser.smoothingTimeConstant = 0.85;
    this.audioSource.connect(this.analyser);
    this.oscilator.connect(this.audioContext.destination);
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
  }

  public processSound(stream): Uint8Array {
    this.analyser.getByteFrequencyData(this.dataArray);
    return [].slice.call(this.dataArray);    
  }

  public arrayIndexToFrequency(index: number): number {
    return index * this.audioContext.sampleRate / this.analyser.fftSize;
  }

  public calculateMainFreq(data: Array<number>) {
    var frequencyArray = _.map(data, this.mapToFreq);
    var grouped = this.group(frequencyArray);
    var maxFrequencyGroup = _.max(grouped, group => _.max(group, item => item.frequency).amplitude);

    return this.weightedAvg(maxFrequencyGroup);
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
}