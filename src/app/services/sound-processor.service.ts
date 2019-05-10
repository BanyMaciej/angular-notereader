import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IFrequency } from '../models/ifrequency';
import { SettingsService } from './settings.service';
import * as _ from 'underscore';
@Injectable()
export class SoundProcessorService {
  public audioContext;
  public analyser;
  public oscilator;
  public gainNode;

  private audioSource;

  constructor(private settingsService: SettingsService) { 
    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.oscilator = this.audioContext.createOscillator();
    this.gainNode = this.audioContext.createGain();
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
    console.log("init!");
    this.audioSource = this.audioContext.createMediaStreamSource(stream);
    this.analyser.fftSize = 4096;
		this.analyser.minDecibels = -45;
		this.analyser.maxDecibels = -10;
		this.analyser.smoothingTimeConstant = 0.2;
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

  private squareFilter = (v: number, i: number) => {
    var min = this.settingsService.minFrequency;
    var max = this.settingsService.maxFrequency;
    var freq = i * this.audioContext.sampleRate / this.analyser.fftSize;;
    return (freq > min && freq < max) ? v : 0;
  }

  public log() {
    var min = this.settingsService.minFrequency;
    var max = this.settingsService.maxFrequency;
    console.log(min + " - " + max)
  }
}