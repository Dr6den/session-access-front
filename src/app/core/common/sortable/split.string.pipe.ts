import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'split_string' })
export class SplitStringPipe implements PipeTransform {
  transform(value:string, [separator]):string[] {
    let splits = value.split(separator);
    return splits;
  }
}