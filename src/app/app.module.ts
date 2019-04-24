import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Ng5SliderModule } from 'ng5-slider';

import { AppComponent } from './app.component';
import { SoundAnalyzerService } from './services/sound-analyzer.service';
import { VisualizerComponent } from './components/visualizer/visualizer.component';
import { NotesRecognizerService } from './services/notes-recognizer.service';
import { SettingsService } from './services/settings.service';
import { SettingsComponent } from './components/settings/settings.component';
import { SmoothingService } from './services/smoothing.service';
import { EmulatorComponent } from './components/emulator/emulator.component';
import { SoundProcessorService } from './services/sound-processor.service'

@NgModule({
  imports:      [ BrowserModule, FormsModule, Ng5SliderModule ],
  declarations: [ AppComponent, VisualizerComponent, SettingsComponent, EmulatorComponent ],
  bootstrap:    [ AppComponent ],
  providers:    [ SoundAnalyzerService, NotesRecognizerService, SettingsService, SmoothingService, SoundProcessorService ]
})
export class AppModule {}