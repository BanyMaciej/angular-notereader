import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SoundAnalyzerService } from './services/sound-analyzer.service';
import { VisualizatorComponent } from './components/visualizator/visualizator.component';
import { NotesRecognizerService } from './services/notes-recognizer.service';

@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent, VisualizatorComponent ],
  bootstrap:    [ AppComponent ],
  providers:    [SoundAnalyzerService, NotesRecognizerService]
})
export class AppModule {
}
