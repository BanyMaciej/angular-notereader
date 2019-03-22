import { Component, Input } from '@angular/core';
import * as _ from 'underscore';

@Component({
  selector: 'visualizator',
  templateUrl: './visualizator.component.html',
  styleUrls: ['./visualizator.component.css']
})
export class VisualizatorComponent {
  @Input() data: number;


}