import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { SoundAnalyzerService } from './services/sound-analyzer.service';
import { VisualizatorComponent } from './components/visualizator/visualizator.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent, VisualizatorComponent, HelloComponent ],
  bootstrap:    [ AppComponent ],
  providers:    [SoundAnalyzerService]
})
export class AppModule {
}
