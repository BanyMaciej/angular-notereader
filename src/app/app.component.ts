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
  freqDataMost;

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
      var gt0 = _.filter(freqData, a => a > 0);
      if(gt0.length > 0) {
        this.freqDataMost = freqData;
      }
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
