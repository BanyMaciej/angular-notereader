import { Component } from '@angular/core';
import { Options, ChangeContext } from 'ng5-slider';
import { SoundProcessorService } from '../../services/sound-processor.service';
import { SoundAnalyzerService } from '../../services/sound-analyzer.service';

@Component({
  selector: 'emulator',
  templateUrl: './emulator.component.html',
  styleUrls: ['./emulator.component.css']
})
export class EmulatorComponent {
  emulatorFrequency: number = 527;
  emulatorSliderOptions: Options = {
    floor: 0,
    ceil: 10000
  };
  enabled: boolean = false;
  soundEnabled: boolean = false;

  constructor(private soundProcessor: SoundProcessorService,
              private soundAnalyzer: SoundAnalyzerService) { 
    soundProcessor.oscilator.start();
    soundProcessor.gainNode.gain.value = 0;
  }

  generateFrequencyArray(): Uint8Array {
    var index = this.soundAnalyzer.frequencyToArrayIndex(this.emulatorFrequency);
    var out =  new Uint8Array(this.soundProcessor.analyser.frequencyBinCount)
    out[index] = 192;
    return out;
  }

  updateFrequency() {
    this.soundProcessor.oscilator.frequency.value = this.emulatorFrequency;
  }

  soundPlayer() {
    this.soundProcessor.oscilator.type = 'sine';
    this.soundProcessor.oscilator.frequency.value = this.emulatorFrequency;
    this.soundProcessor.gainNode.gain.value = this.soundEnabled ? 1 : 0;
  }
}