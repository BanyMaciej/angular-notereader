import { Component } from '@angular/core';
import { Options, ChangeContext } from 'ng5-slider';
import { SoundAnalyzerService } from '../../services/sound-analyzer.service'

@Component({
  selector: 'emulator',
  templateUrl: './emulator.component.html',
  styleUrls: ['./emulator.component.css']
})
export class EmulatorComponent {
  emulatorFrequency: number = 440;
  emulatorSliderOptions: Options = {
    floor: 0,
    ceil: 10000
  };
  enabled: boolean = false;

  constructor(private soundService: SoundAnalyzerService) { }
  
  onChangeEnd(changeContext) {
    console.log(this.enabled);
    console.log("Emulated frequency: " + this.emulatorFrequency);
  }

  generateFrequencyArray(): Uint8Array {
    var index = this.soundService.frequencyToArrayIndex(this.emulatorFrequency);
    var out =  new Uint8Array(this.soundService.getAnalyser().frequencyBinCount)
    out[index] = 192;
    return out;
  }
}