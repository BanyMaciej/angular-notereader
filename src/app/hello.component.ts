import { Component, Input } from '@angular/core';
import * as _ from 'underscore';

@Component({
  selector: 'hello',
  templateUrl: `./hello.component.html`,
  styles: [`h1 { font-family: Lato; }`]
})
export class HelloComponent {
  @Input() name: string;
  @Input() topFrequency: number;

}
