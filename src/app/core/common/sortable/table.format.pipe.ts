import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'format'
})
export class FormatTablePipe implements PipeTransform  {
  
  transform(input:string, args:any): any {
    var format = '';
    var parsedFloat = 0;
    var pipeArgs = args.split(':');
    for(var i = 0; i < pipeArgs.length; i++){
      pipeArgs[i] = pipeArgs[i].trim(' ');
    }
    
    switch(pipeArgs[0].toLowerCase()) {
      case 'text':
        return input;
      default:
        return input;
    }
  }
}