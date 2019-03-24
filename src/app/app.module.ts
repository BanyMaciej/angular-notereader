import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SoundAnalyzerService } from './services/sound-analyzer.service';
import { VisualizatorComponent } from './components/visualizator/visualizator.component';
import { NotesRecognizerService } from './services/notes-recognizer.service';
import { SettingsService } from './services/settings.service';
import { SettingsComponent } from './components/settings/settings.component'

@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent, VisualizatorComponent, SettingsComponent ],
  bootstrap:    [ AppComponent ],
  providers:    [SoundAnalyzerService, NotesRecognizerService, SettingsService]
})
export class AppModule {
}
