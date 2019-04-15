import { Component } from '@angular/core';
import { SoundAnalyzerService } from '../../services/sound-analyzer.service';
import { NotesRecognizerService } from '../../services/notes-recognizer.service';
import { SmoothingService } from '../../services/smoothing.service';
import { Note } from '../../models/note'
import * as _ from 'underscore';

@Component({  
  selector: 'visualizer',
  templateUrl: './visualizer.component.html',
  styleUrls: ['./visualizer.component.css']
})
export class VisualizerComponent {
  mainFrequency;
  power;
  note;

  constructor(private soundAnalyserService: SoundAnalyzerService,
              private notesRecognizerService: NotesRecognizerService,
              private smoothingsService: SmoothingService) {}

  public processSound(dataArray) {
    this.visualize(dataArray);
    this.mainFrequency = this.soundAnalyserService.calculateMainFreq(dataArray);
    const currentNote = this.notesRecognizerService.getNote(this.mainFrequency);//</
    this.note = this.smoothingsService.noteSmoother(currentNote);
  }

  private visualize(dataArray) {
    if(dataArray) {
      var canvas = document.querySelector('canvas');
      var drawContext = canvas.getContext("2d");
      drawContext.clearRect(0, 0, canvas.width, canvas.height);

      for (var i = 0; i < dataArray.length; i++) {
        var barHeight = dataArray[i]/256*canvas.height;
        var topOffset = canvas.height - barHeight - 1;
        var barWidth = canvas.width/dataArray.length;
        var hue = i/dataArray.length * 360;
        drawContext.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
        drawContext.fillRect(i*barWidth, topOffset, barWidth, barHeight);
      }
    }
  }  

  click() {
    this.smoothingsService.logBuffer();
  }
}