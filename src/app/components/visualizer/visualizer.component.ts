import { Component, Input, OnChanges } from '@angular/core';
import { SoundAnalyzerService } from '../../services/sound-analyzer.service';
import { NotesRecognizerService } from '../../services/notes-recognizer.service';
import { SmoothingService } from '../../services/smoothing.service';
import * as _ from 'underscore';

@Component({
  selector: 'visualizer',
  templateUrl: './visualizer.component.html',
  styleUrls: ['./visualizer.component.css']
})
export class VisualizerComponent implements OnChanges {
  @Input() data;
  mainFreq;
  note;

  constructor(private soundAnalyserService: SoundAnalyzerService,
              private notesRecognizerService: NotesRecognizerService,
              private smoothingsService: SmoothingService) {}

  ngOnChanges(changes) {
    this.visualize();
    this.mainFreq = this.soundAnalyserService.calculateMainFreq(this.data);
    const semitones = this.notesRecognizerService.calculateSemitones(this.mainFreq);
    const currentNote = this.notesRecognizerService.semitonesToNote(semitones);
    this.note = this.smoothingsService.noteSmoother(currentNote);
  }

  private visualize() {
    if(this.data) {
      var canvas = document.querySelector('canvas');
      var drawContext = canvas.getContext("2d");
      drawContext.clearRect(0, 0, canvas.width, canvas.height);

      for (var i = 0; i < this.data.length; i++) {
        var barHeight = this.data[i]/256*canvas.height;
        var topOffset = canvas.height - barHeight - 1;
        var barWidth = canvas.width/this.data.length;
        var hue = i/this.data.length * 360;
        drawContext.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
        drawContext.fillRect(i*barWidth, topOffset, barWidth, barHeight);
      }
    }
  }  

  click() {
    this.smoothingsService.noteSmoother();
  }
}