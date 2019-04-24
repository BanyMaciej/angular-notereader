import { Component } from '@angular/core';
import { Options, ChangeContext } from 'ng5-slider';
import { SoundProcessorService } from '../../services/sound-processor.service';
import { SoundAnalyzerService } from '../../services/sound-analyzer.service';
import { VisualizerComponent } from '../visualizer/visualizer.component'

@Component({
  selector: 'emulator',
  templateUrl: './emulator.component.html',
  styleUrls: ['./emulator.component.css']
})
export class EmulatorComponent {
  emulatorFrequency: number = 527;
  emulatorSliderOptions: Options = {
    floor: 0,
    ceil: 20000
  };
  enabled: boolean = false;
  enabledv2: boolean = false;
  soundEnabled: boolean = false;
  soundFrequency: number = 0;

  constructor(private soundProcessor: SoundProcessorService,
              private soundAnalyzer: SoundAnalyzerService) { 
    soundProcessor.oscilator.start();
    soundProcessor.gainNode.gain.value = 0;
  }

  generateFrequencyArray(): Uint8Array {
    var index = this.soundAnalyzer.frequencyToArrayIndex(this.emulatorFrequency);
    var out =  new Uint8Array(this.soundProcessor.analyser.frequencyBinCount);
    this.soundFrequency = this.emulatorFrequency;
    out[index] = 192;
    return out;
  }

  generateFrequencyArrayV2(visualizer: VisualizerComponent): Uint8Array {
    var out = new Uint8Array(this.soundProcessor.analyser.frequencyBinCount);
    var index = Math.round(visualizer.xRatio * this.soundProcessor.analyser.frequencyBinCount);
    var amp = Math.round(visualizer.yRatio * 256);

    this.soundProcessor.gainNode.gain.value = 0;

    if(index && amp) {
      this.soundFrequency = this.soundAnalyzer.arrayIndexToFrequency(index);
      this.updateFrequency();
      this.soundProcessor.gainNode.gain.value = this.soundEnabled ? visualizer.yRatio : 0;  
      out[index] = amp;
    }

    return out;
  }

  updateFrequency() {
    this.soundProcessor.oscilator.frequency.value = this.soundFrequency;
  }

  soundPlayer() {
    this.soundProcessor.oscilator.type = 'sine';
    this.soundProcessor.oscilator.frequency.value = this.soundFrequency;
  }
}