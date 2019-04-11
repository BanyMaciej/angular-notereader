import { Injectable } from '@angular/core';
import { Note } from '../models/note'
import { SmoothingService } from './smoothing.service'

@Injectable()
export class NotesRecognizerService {

  private refA4Frequency = 440; // Hz

  private semitonesToNoteMapping: {[diff: number]: Note} = {
    0: 'A',
    1: 'A#',
    2: 'B',
    3: 'C',
    4: 'C#',
    5: 'D',
    6: 'D#',
    7: 'E',
    8: 'F',
    9: 'F#',
    10: 'G',
    11: 'G#'
  }


  constructor(private smoothingService: SmoothingService) { }

  public calculateSemitones(frequency: number) {
      return 12 * Math.log(frequency/this.refA4Frequency)/Math.log(2);
  }

  public semitonesToNote(semitones: number): string {
    const note = this.semitonesToNoteMapping[Math.round(semitones)%12];
    this.smoothingService.rotateBuffer(note);

    const noteWithOctave = note + (Math.floor(semitones/12)+4)
    return noteWithOctave;
  }

}