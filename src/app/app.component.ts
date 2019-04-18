import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SoundProcessorService } from './services/sound-processor.service';
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
  @ViewChild('visualizer') visualizer;
  @ViewChild('settings') settings;
  

  constructor(private soundProcessor: SoundProcessorService,
              private soundAnalyzer: SoundAnalyzerService) {}

  ngOnInit() {
    this.soundProcessor.getUserMedia().subscribe( 
      stream => this.processSound(stream),
      error => this.handleError(error)
    );
  }

  public processSound(stream) {
    this.soundProcessor.init(stream);
    const process = () => {
      if(this.emulator.enabled) {
        this.freqData = this.emulator.generateFrequencyArray()
      } else {
        this.freqData = this.soundProcessor.processSound();
      }
      this.visualizer.processSound(this.freqData)
      requestAnimationFrame(process);
    }
    process();
  }

  private handleError(error) {
    console.log(error);
  }

  public log() {
    console.log(this.soundAnalyzer.calculatePower(this.freqData));
    this.settings.autoSetup();
  }
}
