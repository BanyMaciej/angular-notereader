import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IFrequency } from '../models/ifrequency';
import { SettingsService } from './settings.service';
import { SoundProcessorService } from './sound-processor.service'
import * as _ from 'underscore';

@Injectable()
export class SoundAnalyzerService {

  constructor(private settingsService: SettingsService,
              private soundProcessor: SoundProcessorService) {}

  public arrayIndexToFrequency(index: number): number {
    return index * this.soundProcessor.audioContext.sampleRate / this.soundProcessor.analyser.fftSize;
  }

  public frequencyToArrayIndex(frequency: number): number {
    return Math.round(frequency * this.soundProcessor.analyser.fftSize / this.soundProcessor.audioContext.sampleRate);
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
    var size = _.filter(data, v => v > 0).length;
    return size > 0 ? _.reduce(dataArray, (m, v) => m + v)/size : 0;

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
}