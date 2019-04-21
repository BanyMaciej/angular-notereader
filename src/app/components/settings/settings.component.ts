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

  minimumLevel: number;
  minimumLevelOptions: Options = {
    floor: 0,
    ceil: 256
  };

  smoothingBufferSize: number;
  smoothingSliderOptions: Options = {
    floor: 1,
    ceil: 50
  };

  constructor(private settingsService: SettingsService,
              private soundProcessor: SoundProcessorService) { }

  ngOnInit() {
    this.applySettings(this.settingsService.getValues());

    this.updateSettings();
  }

  applySettings(settings) {
    this.minDecibels = settings.minDecibels;
    this.maxDecibels = settings.maxDecibels;
    this.minFrequency = settings.minFrequency;
    this.maxFrequency = settings.maxFrequency;
    this.minimumLevel = settings.minimumLevel;
    this.smoothingBufferSize = settings.smoothingBufferSize;
  }

  onChange(changeContext) {
    this.updateSettings();
  }

  private updateSettings() {
    this.settingsService.minDecibels = this.minDecibels;
    this.settingsService.maxDecibels = this.maxDecibels;
    this.settingsService.minFrequency = this.minFrequency;
    this.settingsService.maxFrequency = this.maxFrequency;
    this.settingsService.minimumLevel = this.minimumLevel;
    this.settingsService.smoothingBufferSize = this.smoothingBufferSize;

    this.settingsService.saveValues();
    this.soundProcessor.updateAnalyserSettings();
  }

  public autoSetup() {
    console.log("auto-setup");
    const process = (ref: number) => {
      this.settingsService.minDecibels = ref;
      this.soundProcessor.updateAnalyserSettings();
      console.log(this.soundProcessor.processSound().find(a => a > 0))
      if(this.soundProcessor.processSound().find(a => a > 0) === undefined) {
        console.log("process");
        process(ref-1);
      } else {
        console.log("nice!");
        this.minDecibels = ref;
        this.settingsService.saveValues();
        return;
      }
    }
    process(-50);
  }
}