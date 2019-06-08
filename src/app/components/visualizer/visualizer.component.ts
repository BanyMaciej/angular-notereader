import { Component, ViewChild } from '@angular/core';
import { SoundAnalyzerService } from '../../services/sound-analyzer.service';
import { SoundProcessorService } from '../../services/sound-processor.service';
import { NotesRecognizerService, NoteBase } from '../../services/notes-recognizer.service';
import { SmoothingService } from '../../services/smoothing.service';
import { SettingsService } from '../../services/settings.service';
import { BeeperService } from '../../services/beeper.service';
import * as _ from 'underscore';

@Component({  
  selector: 'visualizer',
  templateUrl: './visualizer.component.html',
  styleUrls: ['./visualizer.component.css']
})
export class VisualizerComponent {
  @ViewChild('spectrogram') spectrogram;
  @ViewChild('notesSheet') notesSheet;

  mainFrequency;
  power;
  note;
  metronome: boolean = false;

  private metrum = 3;
  private noteHeight = 8;
  private bufforTime = 8000;

  private lastTick;
  private barArray: Array<number> = [];
  private tickCounter = 0;

  private noteToPositionMapping: {[id: string]: number} = {
    'C': 0,
    'D': 1,
    'E': 2,
    'F': 3,
    'G': 4,
    'A': 5,
    'B': 6
  }

  constructor(private soundAnalyser: SoundAnalyzerService,
              private soundProcessor: SoundProcessorService,
              private notesRecognizerService: NotesRecognizerService,
              private smoothingsService: SmoothingService,
              private settingsService: SettingsService,
              private beeper: BeeperService) {}

  public processSound(dataArray) {
    this.visualizeSpectrogram(dataArray);
    this.visualizeNotes();
    var dataToProcess =  _.map(dataArray, a => a > this.settingsService.minimumLevel ? a : 0);
    this.mainFrequency = this.soundAnalyser.calculateMainFreq(dataToProcess);
    const currentNote = this.notesRecognizerService.getNote(this.mainFrequency);
    const smoothed = this.smoothingsService.noteSmoother(currentNote)
    this.note = currentNote ? smoothed : undefined;
    this.power = this.soundAnalyser.calculatePower(dataToProcess, {freq: this.mainFrequency, delta: 3});
    this.notesRecognizerService.noteRecognizer(this.note, this.power);
  }


  
  
  private visualizeSpectrogram(dataArray) {
    if(dataArray) {
      var canvas = this.spectrogram.nativeElement;
      var drawContext = canvas.getContext("2d");
      drawContext.clearRect(0, 0, canvas.width, canvas.height);

      this.drawBounds(canvas, drawContext);
      this.drawSpectrum(canvas, drawContext, dataArray);
    }
  }

  private visualizeNotes() {
    var canvas = this.notesSheet.nativeElement;
    var drawContext = canvas.getContext("2d");
    drawContext.clearRect(0, 0, canvas.width, canvas.height);

    this.drawStave(canvas, drawContext);
    this.drawBars(canvas, drawContext);
    this.drawNotes(canvas, drawContext);
  }  

  private drawSpectrum(canvas, drawContext, data) {
    var gradient = drawContext.createLinearGradient(0, canvas.height, 0, 0);
    gradient.addColorStop(0, "lime");
    gradient.addColorStop(0.5, "yellow");
    gradient.addColorStop(1, "red");
    drawContext.fillStyle = gradient;

    for (var i = 0; i < data.length; i++) {
      var barHeight = data[i]/256*canvas.height;
      var topOffset = canvas.height - barHeight - 1;
      var barWidth = canvas.width/data.length;
      var hue = i/data.length * 360;
      drawContext.fillRect(i*barWidth, topOffset, barWidth, barHeight);
    }
  }



  private drawStave(canvas, drawContext) {
    var topLine = 0.3 * canvas.height;
    drawContext.fillStyle = 'rgba(0, 0, 0, 255)';
    for(var i = 0; i < 5; i++) {
      drawContext.fillRect(0, topLine + i * this.noteHeight, canvas.width, 1);
    }
  }

  private drawBars(canvas, drawContext) {
    var tickTime = 60 / this.settingsService.bpm * 1000;
    var now = performance.now();
    if(_.isEmpty(this.barArray) || this.barArray[this.barArray.length - 1] + this.metrum * tickTime < now) {
      this.barArray.push(now);
      if(this.metronome && !this.lastTick) {
        this.lastTick = 1;
      }
    }

    if(this.metronome && this.lastTick && this.lastTick < now - (tickTime)) {
      this.beeper.beep();
      this.lastTick = now;
    }

    _.forEach(this.barArray, barStartTime => {
      var x = (this.bufforTime + barStartTime - performance.now())*canvas.width/this.bufforTime;
      drawContext.fillRect(x, 0.3 * canvas.height, 1, 4*this.noteHeight);
    });
  }

  private drawNotes(canvas, drawContext) {
    var refC4Top = 0.3 * canvas.height + this.noteHeight*4.5;
    var semitoneTopDiff = 0.5*this.noteHeight;
    var drawNotes = _.filter(this.notesRecognizerService.noteArray, note => note.startTime > performance.now() - this.bufforTime);
    _.forEach(drawNotes, note => {
      var semitones = this.notesRecognizerService.noteToSemitones(note.tone);
      var x = (this.bufforTime + note.startTime - performance.now())*canvas.width/this.bufforTime;

      var splittedTone = note.tone.match(/([A-G])(#?)([0-9]+)/);
      var position = this.noteToPositionMapping[splittedTone[1]];
      // if(note = "C4") console.log(position);
      var isSharp = splittedTone[2] === '#';
      var octave = +splittedTone[3];

      var y = refC4Top - semitoneTopDiff * (position + (octave - 4)*this.noteHeight);
      drawContext.fillStyle = isSharp ? 'rgb(102, 0, 102)' : 'rgb(0, 0, 0)';
      var width = note.time * canvas.width / this.bufforTime;
      var height = this.noteHeight;
      drawContext.fillRect(x, y, width, height);
    });
  }

  private drawBounds(canvas, drawContext) {
    var minFreq = this.soundAnalyser.frequencyToArrayIndex(this.settingsService.minFrequency) * canvas.width / this.soundProcessor.analyser.frequencyBinCount;
      var maxFreq = this.soundAnalyser.frequencyToArrayIndex(this.settingsService.maxFrequency) * canvas.width / this.soundProcessor.analyser.frequencyBinCount;
      var minLevel = (1 - this.settingsService.minimumLevel / 256) * canvas.height;

      drawContext.fillStyle = 'rgb(255, 0, 0)';
      drawContext.fillRect(minFreq, minLevel, maxFreq-minFreq, 0.25);
      drawContext.fillStyle = 'rgba(0, 0, 0, 0.5)';
      drawContext.fillRect(0, 0, minFreq, canvas.height);
      drawContext.fillRect(maxFreq, 0, canvas.width - maxFreq, canvas.height);
  }



  click() {
      var canvas = document.querySelector('canvas');
      var topLine = 0.1 * canvas.height;
      var refA4Top = topLine + 6*7;

    // this.smoothingsService.logBuffer();
    var notes = this.notesRecognizerService.noteArray;
    
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