import { Component, Input, OnChanges } from '@angular/core';
import { SoundAnalyzerService } from '../../services/sound-analyzer.service';
import * as _ from 'underscore';

export interface IFrequency {
  frequency: number;
  amplitude: number;
}

@Component({
  selector: 'visualizator',
  templateUrl: './visualizator.component.html',
  styleUrls: ['./visualizator.component.css']
})
export class VisualizatorComponent implements OnChanges {
  @Input() data;
  mainFreq;

  constructor(private soundAnalyzerService: SoundAnalyzerService) {}

  ngOnChanges(changes) {
    console.log("changes!");
    this.visualize();
    this.mainFreq = this.calculateMainFreq();
  }

  private visualize() {
    if(this.data) {
      var canvas = document.querySelector('canvas');
      var drawContext = canvas.getContext("2d");
      drawContext.clearRect(0, 0, canvas.width, canvas.height);

      for (var i = 0; i < this.data.length; i++) {
        var barHeight = this.data[i]/256*canvas.height;
        var topOffset = canvas.height - barHeight - 1;
        var barWidth = canvas.width/this.data.length;
        var hue = i/this.data.length * 360;
        drawContext.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
        drawContext.fillRect(i*barWidth, topOffset, barWidth, barHeight);
      }
    }
  }

  private calculateMainFreq() {
    const mapToFreq: (value: number, index: number) => IFrequency = (value, index) => {
      var freq = this.soundAnalyzerService.arrayIndexToFrequency(index);
      return {
        frequency: freq,
        amplitude: value
      };
    }
    const weightedAvg = (values: IFrequency[]) => {
      var wages = _.chain(values).map(f => f.amplitude * f.frequency).reduce((m, v) => m + v, 0).value();
      var wagesSum = _.reduce(values, (m, v) => m + v.amplitude, 0);
      return wages/wagesSum;

    }

    var filtered = _.chain(this.data).map(mapToFreq).filter(f => f.amplitude > 0).value();

    return weightedAvg(filtered);
  }
}