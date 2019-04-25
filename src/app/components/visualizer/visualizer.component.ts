import { Component } from '@angular/core';
import { SoundAnalyzerService } from '../../services/sound-analyzer.service';
import { SoundProcessorService } from '../../services/sound-processor.service';
import { NotesRecognizerService, NoteBase } from '../../services/notes-recognizer.service';
import { SmoothingService } from '../../services/smoothing.service';
import { SettingsService } from '../../services/settings.service';
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

  arr: Array<string>;

  constructor(private soundAnalyser: SoundAnalyzerService,
              private soundProcessor: SoundProcessorService,
              private notesRecognizerService: NotesRecognizerService,
              private smoothingsService: SmoothingService,
              private settingsService: SettingsService) {}

  public processSound(dataArray) {
    this.visualize(dataArray);
    var dataToProcess =  _.map(dataArray, a => a > this.settingsService.minimumLevel ? a : 0);
    this.mainFrequency = this.soundAnalyser.calculateMainFreq(dataToProcess);
    const currentNote = this.notesRecognizerService.getNote(this.mainFrequency);
    if(currentNote) this.note = this.smoothingsService.noteSmoother(currentNote);
    else {
      this.smoothingsService.noteSmoother(currentNote);
      this.note = undefined;
    }
    this.power = this.soundAnalyser.calculatePower(dataToProcess, {freq: this.mainFrequency, delta: 3});
    this.notesRecognizerService.noteRecognizer(this.note, this.power);
  }

  private visualize(dataArray) {
    if(dataArray) {
      var canvas = document.querySelector('canvas');
      var drawContext = canvas.getContext("2d");
      drawContext.clearRect(0, 0, canvas.width, canvas.height);

      var minFreq = this.soundAnalyser.frequencyToArrayIndex(this.settingsService.minFrequency) * canvas.width / this.soundProcessor.analyser.frequencyBinCount;
      var maxFreq = this.soundAnalyser.frequencyToArrayIndex(this.settingsService.maxFrequency) * canvas.width / this.soundProcessor.analyser.frequencyBinCount;
      var minLevel = (1 - this.settingsService.minimumLevel / 256) * canvas.height;


      drawContext.fillStyle = 'rgb(255, 0, 0)';
      drawContext.fillRect(minFreq, minLevel, maxFreq-minFreq, 0.25);
      drawContext.fillStyle = 'rgba(0, 0, 0, 0.5)';
      drawContext.fillRect(0, 0, minFreq, canvas.height);
      drawContext.fillRect(maxFreq, 0, canvas.width - maxFreq, canvas.height);

      //Top line: 10%
      var topLine = 0.1 * canvas.height;
      drawContext.fillStyle = 'rgba(0, 0, 0, 255)';
      for(var i = 0; i < 5; i++) {
        drawContext.fillRect(0, topLine + i * 6, canvas.width, 0.7);
      }
      drawContext.fill
      

      var gradient = drawContext.createLinearGradient(0, canvas.height, 0, 0);
      gradient.addColorStop(0, "lime");
      gradient.addColorStop(0.5, "yellow");
      gradient.addColorStop(1, "red");
      drawContext.fillStyle = gradient;

      for (var i = 0; i < dataArray.length; i++) {
        var barHeight = dataArray[i]/256*canvas.height;
        var topOffset = canvas.height - barHeight - 1;
        var barWidth = canvas.width/dataArray.length;
        var hue = i/dataArray.length * 360;
        drawContext.fillRect(i*barWidth, topOffset, barWidth, barHeight);
      }
    }
  }  

  click() {
    // this.smoothingsService.logBuffer();
    var notes = this.notesRecognizerService.noteArray;
    var currentNotes = _.filter(notes, note => note.startTime > performance.now() - 5000);
    if(currentNotes.length > 0) {
      var note = currentNotes[currentNotes.length-1];
     
    } else {
      console.log("empty!");
    }

    console.log(currentNotes);
  }

  xRatio: number;
  yRatio: number;
  mouseDown(event) {
    var canvas = document.querySelector('canvas');
    this.xRatio = event.offsetX / canvas.clientWidth;
    this.yRatio = 1 - event.offsetY / canvas.clientHeight;
  }

  mouseMove(event) {
    if(this.xRatio && this.yRatio) {
      var canvas = document.querySelector('canvas');
      this.xRatio = event.offsetX / canvas.clientWidth;
      this.yRatio = 1 - event.offsetY / canvas.clientHeight;
    }
  }

  mouseUp(event) {
    this.xRatio = undefined;
    this.yRatio = undefined;
  }
}