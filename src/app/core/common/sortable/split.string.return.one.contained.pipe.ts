import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'split_and_get_one_of_them'
})
export class SplitStringAndReturnOneOfPipe implements PipeTransform {
  transform(val:string, splitByString:string, containsString:string):string {
      let result: string = '';
      let splitted: string[] = val.split(splitByString);
      result = splitted.find(function(element) {
          return element.includes(containsString);
      });
      return result;
  }
}


