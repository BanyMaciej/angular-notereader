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
  freqData;

  constructor(private soundService: SoundAnalyzerService) {
    this.soundService.getUserMedia().subscribe(
      stream => this.processSound(stream),
      error => this.handleError(error)
    );
  }

  public processSound(stream) {
    this.soundService.init(stream);
    const process = () => {
      var freqData = this.soundService.processSound();
      var gt0 = _.filter(freqData, a => a > 0);
      if(gt0.length > 0) {
        this.freqData = freqData;
      }
      requestAnimationFrame(process);
    }
    process();
  }

  private handleError(error) {
    console.log(error);
  }
}
