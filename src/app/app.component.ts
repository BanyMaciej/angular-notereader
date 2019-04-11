import { Component, OnInit } from '@angular/core';
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
      this.freqData = this.soundService.processSound();
      requestAnimationFrame(process);
    }
    process();
  }

  private handleError(error) {
    console.log(error);
  }
}
