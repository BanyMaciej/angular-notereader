import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IFrequency } from '../models/ifrequency';
import * as _ from 'underscore';

@Injectable()
export class SoundAnalyzerService {
  private audioContext;
  private analyser;
  private oscilator;
  private gainNode;

  private audioSource;
  private dataArray;

  constructor() { 
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

  public init(stream) {
    this.audioSource = this.audioContext.createMediaStreamSource(stream);
    this.analyser.fftSize = 2048;
		this.analyser.minDecibels = -70;
		this.analyser.maxDecibels = -10;
		this.analyser.smoothingTimeConstant = 0.85;
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

  public calculateMainFreq(data) {
    const weightedAvg = (values: IFrequency[]) => {
      var wages = _.chain(values).map(f => f.amplitude * f.frequency).reduce((m, v) => m + v, 0).value();
      var wagesSum = _.reduce(values, (m, v) => m + v.amplitude, 0);
      return wages/wagesSum;

    }

    var filtered = _.chain(data).map(this.mapToFreq).filter(f => f.amplitude > 0).value();

    return weightedAvg(filtered);
  }

  public group(input) {
    var data = _.map(input, this.mapToFreq);
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
}