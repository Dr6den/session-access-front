import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'split_string' })
export class SplitStringPipe implements PipeTransform {
  transform(value:string, [separator]):string[] {
    if(value) {
        if (typeof value !== "string") value = JSON.stringify(value);
        let splits = value.split(separator);
        return splits;
    }
    return;
  }
}