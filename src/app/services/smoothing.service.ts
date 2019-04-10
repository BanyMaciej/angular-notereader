import { Injectable } from '@angular/core';
import { SettingsService } from './settings.service'

@Injectable()
export class SmoothingService {
  private buffer: number

  constructor(private settingsService: SettingsService) { }

  public noteSmoother() {
    
  }

}