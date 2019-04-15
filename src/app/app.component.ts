import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SoundAnalyzerService } from './services/sound-analyzer.service';
import * as _ from 'underscore';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit {
  freqData;
  @ViewChild('frequencyEmulator') emulator;

  constructor(private soundService: SoundAnalyzerService) {}

  ngOnInit() {
    this.soundService.getUserMedia().subscribe( 
      stream => this.processSound(stream),
      error => this.handleError(error)
    );
  }

  public processSound(stream) {
    this.soundService.init(stream);
    const process = () => {
      if(this.emulator.enabled) {
        this.freqData = this.emulator.generateFrequencyArray()
      } else {
        this.freqData = this.soundService.processSound();
      }
      requestAnimationFrame(process);
    }
    process();
  }

  private handleError(error) {
    console.log(error);
  }

  public log() {
    console.log()
  }
}
