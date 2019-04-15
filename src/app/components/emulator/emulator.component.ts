import { Component } from '@angular/core';
import { Options, ChangeContext } from 'ng5-slider';
import { SoundAnalyzerService } from '../../services/sound-analyzer.service'

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
  enabled: boolean = true;
  soundEnabled: boolean = false;

  constructor(private soundService: SoundAnalyzerService) { 
    soundService.oscilator.start();
    soundService.gainNode.gain.value = 0;
  }

  generateFrequencyArray(): Uint8Array {
    var index = this.soundService.frequencyToArrayIndex(this.emulatorFrequency);
    var out =  new Uint8Array(this.soundService.getAnalyser().frequencyBinCount)
    out[index] = 192;
    return out;
  }

  updateFrequency() {
    this.soundService.oscilator.frequency.value = this.emulatorFrequency;
  }

  soundPlayer() {
    this.soundService.oscilator.type = 'sine';
    this.soundService.oscilator.frequency.value = this.emulatorFrequency;
    this.soundService.gainNode.gain.value = this.soundEnabled ? 1 : 0;
  }
}