import { Injectable } from '@angular/core';

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


  constructor() { }

  public getNote(frequency: number): string {
    return this.semitonesToNote(this.calculateSemitones(frequency))
  }

  private previous: string;
  private startTime: number;

  public noteArray: Array<Note> = [];
  public noteRecognizer(note: string, power: number) {
    if(power > 0) {
      if(note && !this.previous && note !== this.previous) {
        this.newNote(note);
      }
      if(note && this.previous && note === this.previous) {
        this.noteLasts(note);
      }
      if(note && this.previous && note !== this.previous) {
        this.noteEnd(note);
        this.newNote(note);
      }
    } else if(!note && this.previous) {
      this.noteEnd(note);
    }

    this.previous = note;
  }

  private newNote(note) {
    this.startTime = performance.now();
  }

  private noteLasts(note) {
  }

  private noteEnd(note) {
    var totalTime = performance.now() - this.startTime;
    this.noteArray.push({tone: this.previous, time: totalTime, startTime: this.startTime})
    console.log(this.noteArray)
  }

  private calculateSemitones(frequency: number) {
      return 12 * Math.log(frequency/this.refA4Frequency)/Math.log(2);
  }

  private semitonesToNote(semitones: number): string {
    if(semitones) {
      const noteId = semitones >= 0 ? Math.round(semitones)%12 : 12 + Math.round(semitones)%12;
      const note = this.semitonesToNoteMapping[noteId];
      const noteWithOctave = note + (Math.floor((semitones+9.5)/12)+4)
      return noteWithOctave;
    }
  }
}