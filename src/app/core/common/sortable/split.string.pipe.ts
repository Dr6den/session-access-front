import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'split_string' })
export class SplitStringPipe implements PipeTransform {
  transform(value:string, [separator]):string[] {
    if(value) {
        let splits = value.split(separator);
        return splits;
    }
    return;
  }
}