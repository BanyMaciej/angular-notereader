import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SoundAnalyzerService } from './services/sound-analyzer.service';
import * as _ from 'underscore';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent {
  name;
  freq;
  freqData100;

  constructor(private soundService: SoundAnalyzerService) {
    this.soundService.getUserMedia().subscribe(
      stream => this.processSound(stream),
      error => this.handleError(error)
    );
  }

  public processSound(stream) {
    this.soundService.init(stream);
    this.name = 'Success';
    const process = () => {
      var freqData = this.soundService.processSound(stream);
      this.freqData100 = _.max(freqData);
      this.freq = _.max(freqData);
      requestAnimationFrame(process);
    }
    process();
  }

  private handleError(error) {
    this.name = 'Error: ' + error;
    this.freq = "Error";
    console.log(error);
  }
}
