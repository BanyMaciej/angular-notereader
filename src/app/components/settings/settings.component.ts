import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { SoundAnalyzerService } from '../../services/sound-analyzer.service';
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

  minFrequency: number = 200;
  maxFrequency: number = 2000;
  frequencySliderOptions: Options = {
    floor: 0,
    ceil: 10000,
    noSwitching: true,
    minRange: 1000
  };

  constructor(private settingsService: SettingsService,
              private soundAnalyserService: SoundAnalyzerService) { }

  ngOnInit() {
    this.minDecibels = +localStorage.getItem("minDecibels") || -50;
    this.maxDecibels = +localStorage.getItem("maxDecibels") || -10;

    this.minFrequency = +localStorage.getItem("minFrequency") || 200;
    this.maxFrequency = +localStorage.getItem("maxFrequency") || 2000;
  }

  decibelsChangeEnd(changeContext) {
    this.settingsService.minDecibels = this.minDecibels;
    this.settingsService.maxDecibels = this.maxDecibels;
    this.saveValues();
    this.soundAnalyserService.updateAnalyserSettings();
  }

  frequencyChangeEnd(changeContext) {
    this.settingsService.minDecibels = this.minDecibels;
    this.settingsService.maxFrequency = this.maxFrequency;
    this.saveValues();
    this.soundAnalyserService.updateAnalyserSettings();
  }

  private saveValues() {
    localStorage.setItem("minDecibels", this.minDecibels.toString());
    localStorage.setItem("maxDecibels", this.maxDecibels.toString());

    localStorage.setItem("minFrequency", this.minFrequency.toString());
    localStorage.setItem("maxFrequency", this.maxFrequency.toString());
  }

  private autoSetup() {
    console.log("auto-setup");
    const process = (ref: number) => {
      this.minDecibels = ref;
      this.soundAnalyserService.updateAnalyserSettings();
      if(this.soundAnalyserService.processSound().find(a => a > 0) !== undefined) {
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