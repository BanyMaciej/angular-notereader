import { Injectable } from '@angular/core';

@Injectable()
export class NotesRecognizerService {

  private refA4Frequency = 440; // Hz


  constructor() { }

  public calculateSemitones(frequency: number) {
      return 12 * Math.log(frequency/this.refA4Frequency)/Math.log(2);
  }

}