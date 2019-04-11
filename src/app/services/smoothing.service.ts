import { Injectable } from '@angular/core';
import { SettingsService } from './settings.service'
import { Note } from '../models/note'
import * as _ from 'underscore'

@Injectable()
export class SmoothingService {
  private buffer: Array<Note> = new Array

  constructor(private settingsService: SettingsService) { }

  public noteSmoother(nextElem?: Note): Note {
    if(nextElem) this.rotateBuffer(nextElem);
    var out;
    var maxCount = _.chain(this.buffer).countBy().values().max().value();
    var topNotes = _.chain(this.buffer).countBy().pairs().filter(p=>p[1] === maxCount).map(a=>a[0]).value();
    _.forEach(this.buffer, note => {
      if(_.contains(topNotes, note)) out = note;
    })
    // console.log(out);
    return out
  }

  private rotateBuffer(nextElem: Note) {
    if(this.buffer.length >= this.settingsService.smoothingBufferSize) {
      this.buffer.shift();
      return this.rotateBuffer(nextElem);
    }
    this.buffer.push(nextElem);
    
  }

  public logBuffer() {
    console.log(this.buffer);
  }

}