import { Component } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { SoundAnalyzerService } from '../../services/sound-analyzer.service';
import { Options, ChangeContext } from 'ng5-slider';

@Component({
  selector: 'settings-controls',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  minDecibels: number = -50;
  maxDecibels: number = -10;
  options: Options = {
    floor: -100,
    ceil: 0
  };

  constructor(private settingsService: SettingsService,
              private soundAnalyserService: SoundAnalyzerService) { }

  onUserChangeEnd(changeContext: ChangeContext) {
    this.settingsService.minDecibels = changeContext.value;
    this.settingsService.maxDecibels = changeContext.highValue;
    this.soundAnalyserService.updateAnalyserSettings();
  }
}