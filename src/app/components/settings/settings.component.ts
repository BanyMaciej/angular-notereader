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
  minDecibels;
  maxDecibels;
  decibelsSliderOptions: Options = {
    floor: -100,
    ceil: 0,
    noSwitching: true,
    minRange: 10
  };

  minFreq = 200;
  maxFreq = 2000;
  frequencySliderOptions: Options = {
    floor: 0,
    ceil: 10000,
    noSwitching: true,
    minRange: 1000
  };

  constructor(private settingsService: SettingsService,
              private soundAnalyserService: SoundAnalyzerService) { }

  ngOnInit() {
    this.minDecibels = localStorage.getItem("minDecibels") || -50;
    this.maxDecibels = localStorage.getItem("maxDecibels") || -10;
  }

  decibelsChangeEnd(changeContext) {
    this.settingsService.minDecibels = this.minDecibels;
    this.settingsService.maxDecibels = this.maxDecibels;
    this.saveValues();
    this.soundAnalyserService.updateAnalyserSettings();
  }

  frequencyChangeEnd(changeContext) {
    this.settingsService.minDecibels = this.minDecibels;
    this.settingsService.maxDecibels = this.maxDecibels;
    this.saveValues();
    this.soundAnalyserService.updateAnalyserSettings();
  }

  private saveValues() {
    localStorage.setItem("minDecibels", this.minDecibels);
    localStorage.setItem("maxDecibels", this.maxDecibels);
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