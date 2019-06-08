import { Component, HostListener } from '@angular/core';
import { Options, ChangeContext } from 'ng5-slider';
import { SoundProcessorService } from '../../services/sound-processor.service';
import { SoundAnalyzerService } from '../../services/sound-analyzer.service';
import { NotesRecognizerService } from '../../services/notes-recognizer.service';
import { VisualizerComponent } from '../visualizer/visualizer.component';

export enum KEY_CODE {
  C = 65,
  Cs = 87,
  D = 83,
  Ds =69,
  E = 68,
  F = 70,
  Fs = 84,
  G = 71,
  Gs = 89,
  A = 72,
  As = 85,
  B = 74
}

@Component({
  selector: 'emulator',
  templateUrl: './emulator.component.html',
  styleUrls: ['./emulator.component.css']
})
export class EmulatorComponent {
  emulatorFrequency: number = 523;
  emulatorSliderOptions: Options = {
    floor: 0,
    ceil: 20000
  };
  enabled: boolean = false;
  enabledv2: boolean = false;
  enabledv3: boolean = false;

  soundEnabled: boolean = false;

  constructor(private soundProcessor: SoundProcessorService,
              private soundAnalyzer: SoundAnalyzerService,
              private notesRecognizer: NotesRecognizerService) { 
    soundProcessor.oscilator.start();
    soundProcessor.gainNode.gain.value = 0;
    this.soundProcessor.oscilator.type = 'sine';
  }

  generateFrequencyArray(): Uint8Array {
    var index = this.soundAnalyzer.frequencyToArrayIndex(this.emulatorFrequency);
    var out =  new Uint8Array(this.soundProcessor.analyser.frequencyBinCount);
    this.updateFrequency();
    this.soundProcessor.gainNode.gain.value = this.soundEnabled ? 0.75 : 0;  
    out[index] = 192;
    return out;
  }

  generateFrequencyArrayV2(visualizer: VisualizerComponent): Uint8Array {
    var out = new Uint8Array(this.soundProcessor.analyser.frequencyBinCount);
    var index = Math.round(visualizer.xRatio * this.soundProcessor.analyser.frequencyBinCount);
    var amp = Math.round(visualizer.yRatio * 256);

    this.soundProcessor.gainNode.gain.value = 0;

    if(index && amp) {
      this.emulatorFrequency = this.soundAnalyzer.arrayIndexToFrequency(index);
      this.updateFrequency();
      this.soundProcessor.gainNode.gain.value = this.soundEnabled ? visualizer.yRatio : 0;  
      out[index] = amp;
    }

    return out;
  }

  generateFrequencyArrayV3(): Uint8Array {
    var out = new Uint8Array(this.soundProcessor.analyser.frequencyBinCount);
    if(this.emulatorFrequency > 0) {
      var index = this.soundAnalyzer.frequencyToArrayIndex(this.emulatorFrequency);
      if(this.keyDown) out[index] = 192;
      this.soundProcessor.gainNode.gain.value = this.soundEnabled && this.keyDown ? 0.4 : 0; 
    }
    return out;
  }


  keyDown: boolean;
  @HostListener('window:keyup', ['$event'])
  keyEventUp(event: KeyboardEvent) { 
    if(this.enabledv3) {
      this.keyDown = false;
    }
  }

  @HostListener('window:keydown', ['$event'])
  keyEventDown(event: KeyboardEvent) {  
    if(!this.keyDown && this.enabledv3){
      switch(event.keyCode) {
        case KEY_CODE.A: this.emulatorFrequency = this.notesRecognizer.semitonesToFrequency(12-12);
          break;
        case KEY_CODE.As: this.emulatorFrequency = this.notesRecognizer.semitonesToFrequency(13-12);
          break;
        case KEY_CODE.B: this.emulatorFrequency = this.notesRecognizer.semitonesToFrequency(14-12);
          break;
        case KEY_CODE.C: this.emulatorFrequency = this.notesRecognizer.semitonesToFrequency(3-12);
          break;
        case KEY_CODE.Cs: this.emulatorFrequency = this.notesRecognizer.semitonesToFrequency(4-12);
          break;
        case KEY_CODE.D: this.emulatorFrequency = this.notesRecognizer.semitonesToFrequency(5-12);
          break;
        case KEY_CODE.Ds: this.emulatorFrequency = this.notesRecognizer.semitonesToFrequency(6-12);
          break;
        case KEY_CODE.E: this.emulatorFrequency = this.notesRecognizer.semitonesToFrequency(7-12);
          break;
        case KEY_CODE.F: this.emulatorFrequency = this.notesRecognizer.semitonesToFrequency(8-12);
          break;
        case KEY_CODE.Fs: this.emulatorFrequency = this.notesRecognizer.semitonesToFrequency(9-12);
          break;
        case KEY_CODE.G: this.emulatorFrequency = this.notesRecognizer.semitonesToFrequency(10-12);
          break;
        case KEY_CODE.Gs: this.emulatorFrequency = this.notesRecognizer.semitonesToFrequency(11-12);
          break;
        default: this.emulatorFrequency = 0;
      }
      this.updateFrequency();
      this.keyDown = true;
    }
  }

  updateFrequency() {
    this.soundProcessor.oscilator.frequency.value = this.emulatorFrequency;
  }
}