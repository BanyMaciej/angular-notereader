import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
    return this.dataArray;    
  }


  // private visualize() {
  //   var canvas = document.querySelector('canvas');
  //   var drawContext = canvas.getContext("2d");
  //   drawContext.clearRect(0, 0, canvas.width, canvas.height);

  //   for (var i = 0; i < this.data.length; i++) {
  //     var barHeight = this.data[i]/256*canvas.height;
  //     var topOffset = canvas.height - barHeight - 1;
  //     var barWidth = canvas.width/this.data.length;
  //     var hue = i/this.data.length * 360;
  //     drawContext.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
  //     drawContext.fillRect(i*barWidth, topOffset, barWidth, barHeight);
  //   }
  // }

}