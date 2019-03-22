import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class SoundAnalyzerService {
  private audioContext;
  public analyser;
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
    this.analyser.minDecibels = -45;
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

}