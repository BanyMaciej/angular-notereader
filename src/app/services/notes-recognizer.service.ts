import { Injectable } from '@angular/core';

@Injectable()
export class NotesRecognizerService {

  private refA4Frequency = 440; // Hz

  private semitonesToNoteMapping = {
    0: "A",
    1: "A#",
    2: "H",
    3: "B",
    4: "C",
    5: "C#",
    6: "D",
    7: "D#",
    8: "E",
    9: "F",
    10: "F#",
    11: "G",
    12: "G#"
  }


  constructor() { }

  public calculateSemitones(frequency: number) {
      return 12 * Math.log(frequency/this.refA4Frequency)/Math.log(2);
  }

  public semitonesToNote(semitones: number): string {
    return this.semitonesToNoteMapping[Math.round(semitones)%12] + (Math.floor(semitones/12)+4);
  }

}