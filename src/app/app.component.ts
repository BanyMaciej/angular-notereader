import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SoundProcessorService } from './services/sound-processor.service';
import { SoundAnalyzerService } from './services/sound-analyzer.service';
import { NotesRecognizerService } from './services/notes-recognizer.service';
import * as _ from 'underscore';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit {
  @ViewChild('frequencyEmulator') emulator;
  @ViewChild('visualizer') visualizer;
  @ViewChild('settings') settings;
  
  started = false;

  constructor(private soundProcessor: SoundProcessorService,
              private soundAnalyzer: SoundAnalyzerService,
              private notesRecognizer: NotesRecognizerService) {}

  ngOnInit() {}
  start() {
    this.started = true;
    this.soundProcessor.getUserMedia().subscribe( 
      stream => this.processSound(stream),
      error => this.handleError(error)
    );
  }

  private processSound(stream) {
    this.soundProcessor.init(stream);
    const process = () => {
      var freqData;
      if(this.emulator.enabledv2) {
        freqData = this.emulator.generateFrequencyArrayV2(this.visualizer);
      } else if(this.emulator.enabled) {
        freqData = this.emulator.generateFrequencyArray();
      } else if(this.emulator.enabledv3) {
        freqData = this.emulator.generateFrequencyArrayV3();
      } else {
        freqData = this.soundProcessor.processSound();
      }
      this.visualizer.processSound(freqData)
      requestAnimationFrame(process);
    }
    process();
  }

  private handleError(error) {
    console.log(error);
  }

  public log() {

  }
}
