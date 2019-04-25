import { Injectable } from '@angular/core';
import * as _ from 'underscore';

export type NoteBase = 'A' | 'A#' | 'B' | 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#';
export interface Tone {
  noteBase: NoteBase;
  octave: number;
}

export interface Note {
  tone: string;
  time: number;
  startTime: number;
}

@Injectable()
export class NotesRecognizerService {

  private refA4Frequency = 440; // Hz

  private semitonesToNoteMapping: {[diff: number]: NoteBase} = {
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

  private noteToSemitonesMapping = _.invert(this.semitonesToNoteMapping);

  constructor() { }

  public getNote(frequency: number): string {
    return this.semitonesToNote(this.calculateSemitones(frequency))
  }

  private previous: string;
  private startTime: number;

  public noteArray: Array<Note> = [];
  public noteRecognizer(note: string, power: number) {
    if(power > 0 && note && note !== this.previous) {
      if(this.previous) {
        this.noteEnd();
      }
      this.newNote();
    } else if(!note && this.previous) {
      this.noteEnd();
    }

    this.previous = note;
  }

  private newNote() {
    this.startTime = performance.now();
  }

  private noteEnd() {
    var totalTime = performance.now() - this.startTime;
    this.noteArray.push({tone: this.previous, time: totalTime, startTime: this.startTime})
    // console.log(this.noteArray)
  }

  private calculateSemitones(frequency: number) {
      return 12 * Math.log(frequency/this.refA4Frequency)/Math.log(2);
  }

  public semitonesToNote(semitones: number): string {
    if(semitones) {
      const noteId = semitones >= 0 ? Math.round(semitones)%12 : 12 + Math.round(semitones)%12;
      const note = this.semitonesToNoteMapping[noteId];
      const noteWithOctave = note + (Math.floor((semitones+9.5)/12)+4)
      return noteWithOctave;
    }
  }

  public noteToSemitones(note: string): number {
    var result = note.match(/([A-G]#?)([0-9]+)/);
    var baseSemitones = +this.noteToSemitonesMapping[result[1]];
    var octave = +result[2];

    var octaveModifier = baseSemitones >= 3 ? (octave-5)*12 : (octave-4)*12;
    return baseSemitones + octaveModifier;
  }
}