import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { SoundProcessorService } from '../../services/sound-processor.service';
import { Options, ChangeContext } from 'ng5-slider';

@Component({
  selector: 'settings-controls',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  minDecibels: number;
  maxDecibels: number;
  decibelsSliderOptions: Options = {
    floor: -100,
    ceil: 0,
    noSwitching: true,
    minRange: 10
  };

  minFrequency: number;
  maxFrequency: number;
  frequencySliderOptions: Options = {
    floor: 0,
    ceil: 10000,
    noSwitching: true,
    minRange: 1000
  };

  smoothingBufferSize: number;
  smoothingSliderOptions: Options = {
    floor: 1,
    ceil: 50
  };

  constructor(private settingsService: SettingsService,
              private soundProcessor: SoundProcessorService) { }

  ngOnInit() {
    this.minDecibels = +localStorage.getItem("minDecibels") || -50;
    this.maxDecibels = +localStorage.getItem("maxDecibels") || -10;

    this.minFrequency = +localStorage.getItem("minFrequency") || 200;
    this.maxFrequency = +localStorage.getItem("maxFrequency") || 2000;

    this.smoothingBufferSize = +localStorage.getItem("smoothingBufferSize") || 10;

    this.updateSettings();
    this.soundProcessor.updateAnalyserSettings();
  }

  onChangeEnd(changeContext) {
    this.updateSettings();
  }

  private updateSettings() {
    this.settingsService.minDecibels = this.minDecibels;
    this.settingsService.maxDecibels = this.maxDecibels;
    this.settingsService.minFrequency = this.minFrequency;
    this.settingsService.maxFrequency = this.maxFrequency;
    this.settingsService.smoothingBufferSize = this.smoothingBufferSize;

    this.saveValues();
    this.soundProcessor.updateAnalyserSettings();
  }

  private saveValues() {
    localStorage.setItem("minDecibels", this.minDecibels.toString());
    localStorage.setItem("maxDecibels", this.maxDecibels.toString());

    localStorage.setItem("minFrequency", this.minFrequency.toString());
    localStorage.setItem("maxFrequency", this.maxFrequency.toString());

    localStorage.setItem("smoothingBufferSize", this.smoothingBufferSize.toString());
  }

  public autoSetup() {
    console.log("auto-setup");
    const process = (ref: number) => {
      this.minDecibels = ref;
      this.soundProcessor.updateAnalyserSettings();
      if(this.soundProcessor.processSound().find(a => a > 0) !== undefined) {
        console.log("process");
        process(ref-1);
      } else {
        console.log("nice!");
        return;
      }
    }
    process(-50);
  }
}