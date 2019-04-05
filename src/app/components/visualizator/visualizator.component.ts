import { Component, Input, OnChanges } from '@angular/core';
import { SoundAnalyzerService } from '../../services/sound-analyzer.service';
import { NotesRecognizerService } from '../../services/notes-recognizer.service';
import * as _ from 'underscore';

@Component({
  selector: 'visualizator',
  templateUrl: './visualizator.component.html',
  styleUrls: ['./visualizator.component.css']
})
export class VisualizatorComponent implements OnChanges {
  @Input() data;
  mainFreq;
  note;
  myRange;

  constructor(private soundAnalyserService: SoundAnalyzerService,
              private notesRecognizerService: NotesRecognizerService) {}

  ngOnChanges(changes) {
    this.visualize();
    this.mainFreq = this.soundAnalyserService.calculateMainFreq(this.data);
    var semitones = this.notesRecognizerService.calculateSemitones(this.mainFreq);
    this.note = this.notesRecognizerService.semitonesToNote(semitones);
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
    this.soundAnalyserService.log();
  }
}