import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as _ from 'underscore';

@Component({
  selector: 'hello',
  templateUrl: `./hello.component.html`,
  styles: [`h1 { font-family: Lato; }`]
})
export class HelloComponent implements OnChanges {
  @Input() name: string;
  @Input() topFrequency: number;

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
  }
}
