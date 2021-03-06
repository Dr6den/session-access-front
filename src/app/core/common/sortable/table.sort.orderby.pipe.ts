/*
 * Example use
 *		Basic Array of single type: *ngFor="let todo of todoService.todos | orderBy : '-'"
 *		Multidimensional Array Sort on single column: *ngFor="let todo of todoService.todos | orderBy : ['-status']"
 *		Multidimensional Array Sort on multiple columns: *ngFor="let todo of todoService.todos | orderBy : ['status', '-title']"
 */

import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'orderBy', pure: false})
export class TableOrderByPipe implements PipeTransform {

	value:string[] =[];

	static _orderByComparator(a:any, b:any):number{
        
        if(a === null || typeof a === 'undefined') a = 0;
        if(b === null || typeof b === 'undefined') b = 0;

		if((isNaN(parseFloat(a)) || !isFinite(a) || (a!=0)) || (isNaN(parseFloat(b)) || !isFinite(b) || (b != 0))){
                    //did so becouse compiler didn' work correct. You should use only below if, not under if
                    if(a!=0 && b!=0) {
			//Isn't a number so lowercase the string to properly compare
			if(a.toLowerCase() < b.toLowerCase()) return -1;
			if(a.toLowerCase() > b.toLowerCase()) return 1;
                    }
		}
			//Parse strings as numbers to compare properly
			if(parseFloat(a) < parseFloat(b)) return -1;
			if(parseFloat(a) > parseFloat(b)) return 1;
		

		return 0; //equal each other
	}

    transform(input:any, config:string = '+'): any{
        if (!input) return;
        if (config === "Role" || config === "Actions" || config === "-Role" || config === "-Actions" || config === "Options" || config === "-Options") return this.value;

    	//make a copy of the input's reference
    	this.value = [...input];
    	var value = this.value;
     
        if(!Array.isArray(value)) return value;

        if(!Array.isArray(config) || (Array.isArray(config) && config.length == 1)){
            var propertyToCheck:string = !Array.isArray(config) ? config : config[0];
            var desc = propertyToCheck.substr(0, 1) == '-';
            
            //Basic array
            if(!propertyToCheck || propertyToCheck == '-' || propertyToCheck == '+'){
                return !desc ? value.sort() : value.sort().reverse();
            }
            else {
                var property:string = propertyToCheck.substr(0, 1) == '+' || propertyToCheck.substr(0, 1) == '-'
                    ? propertyToCheck.substr(1)
                    : propertyToCheck;

                return value.sort(function(a:any,b:any){
                    return !desc 
                        ? TableOrderByPipe._orderByComparator(a[property], b[property]) 
                        : -TableOrderByPipe._orderByComparator(a[property], b[property]);
                });
            }
        }
        else {
            //Loop over property of the array in order and sort
            return value.sort(function(a:any,b:any){
                for(var i:number = 0; i < config.length; i++){
                    var desc = config[i].substr(0, 1) == '-';
                    var property = config[i].substr(0, 1) == '+' || config[i].substr(0, 1) == '-'
                        ? config[i].substr(1)
                        : config[i];

                    var comparison = !desc 
                        ? TableOrderByPipe._orderByComparator(a[property], b[property]) 
                        : -TableOrderByPipe._orderByComparator(a[property], b[property]);
                    
                    //Don't return 0 yet in case of needing to sort by next property
                    if(comparison != 0) return comparison;
                }

                return 0; //equal each other
            });
        }
    }
}