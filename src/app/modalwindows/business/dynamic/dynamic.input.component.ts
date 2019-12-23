import { Component, Input, Output, EventEmitter } from '@angular/core';
@Component({
    selector: 'input-dynamic',
    templateUrl: './dynamic.input.component.html',
    styleUrls: ['./dynamic.input.component.css']
})
export class DynamicInputComponent {
    @Input() title: string;
    @Input() value: string;
    @Output() changedValue = new EventEmitter();
    
    onValueChange(item: any) {
        this.changedValue.emit(this.value);
    }
}