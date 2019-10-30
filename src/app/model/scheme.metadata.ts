export class SchemeMetadata {
    public containsNestedProperties?: boolean;
    //props for simple scheme without nested applications like Product division 
    public propertiesInOneParentColumn?: object;
    public singlePropsWithoutNesting?: string[] = [];
    public sortedProperty?: string;
    //props for composite scheme with nested applications like Roles
    public compositePropertiesInOneParentColumn?: object = {};
    public compositeSortedProperty?: object = {};
    public compositeSinglePropsWithoutNesting?: object = {};
    
    constructor(public scheme?: object) {        
    }
    
    public putColumnValueAccordingMetadataToTable(processedRow: object, columnName: string, value: string, app?: string) {
        if (this.containsNestedProperties) {
            for (let spwn in this.compositePropertiesInOneParentColumn[app]) {
                let curentPropName: string = this.compositePropertiesInOneParentColumn[app][spwn];
                if (curentPropName.includes(columnName)) {
                    if (processedRow[Object.keys(this.compositePropertiesInOneParentColumn[app])[0]] === undefined) {
                        processedRow[Object.keys(this.compositePropertiesInOneParentColumn[app])[0]] = columnName + ":" + value;
                    } else {
                        processedRow[Object.keys(this.compositePropertiesInOneParentColumn[app])[0]] = 
                            processedRow[Object.keys(this.compositePropertiesInOneParentColumn[app])[0]] + ";" + columnName + ":" + value;
                    }
                }
            }
            for (let spwn in this.compositeSinglePropsWithoutNesting[app]) {
                let curentPropName: string = this.compositeSinglePropsWithoutNesting[app][spwn];
                if (columnName === curentPropName && (processedRow[curentPropName] === undefined)) {
                    processedRow[curentPropName] = value;
                    break;
                }
            }
        } else {
            for (let spwn in this.propertiesInOneParentColumn) {
                let curentPropName: string = this.propertiesInOneParentColumn[spwn];
                if (curentPropName.includes(columnName)) {
                    if (processedRow[Object.keys(this.compositePropertiesInOneParentColumn)[0]] === undefined) {
                        processedRow[Object.keys(this.compositePropertiesInOneParentColumn)[0]] = columnName + ":" + value;
                    } else {
                        processedRow[Object.keys(this.compositePropertiesInOneParentColumn)[0]] = 
                            processedRow[Object.keys(this.compositePropertiesInOneParentColumn)[0]] + ";" + columnName + ":" + value;
                    }
                }
            }
            for (let spwn in this.singlePropsWithoutNesting) {
                let curentPropName: string = this.singlePropsWithoutNesting[spwn];
                if(columnName === curentPropName && processedRow[curentPropName] === undefined) {
                    processedRow[curentPropName] = value;
                    break;
                }
            }
        }
    }
    
    public setSimpleNested(name: string, parentName: string) {
        if (this.propertiesInOneParentColumn === undefined) {
            this.propertiesInOneParentColumn = {};
            this.propertiesInOneParentColumn[parentName] = [];            
        } 
        this.propertiesInOneParentColumn[parentName].push(name);
    }
    
    public setupMetadata() {
        this.containsNestedProperties = (this.nestingDegreeOfObject(this.scheme) > 2);
        
        if (this.containsNestedProperties) {
            for (let app in this.scheme) {
                for (let prop in this.scheme[app]) {
                    if (this.scheme[app][prop]['defaultSorting']) {
                        this.compositeSortedProperty[app] = prop;
                    }
                    if (this.scheme[app][prop]['show'] == true) {
                        if (this.compositeSinglePropsWithoutNesting[app] === undefined) {
                            this.compositeSinglePropsWithoutNesting[app] = [];
                        }
                        this.compositeSinglePropsWithoutNesting[app].push(prop);
                    } else if (this.scheme[app][prop]['show'] == false) {
                        
                    } else {
                        if (this.compositePropertiesInOneParentColumn[app] === undefined) {
                            this.compositePropertiesInOneParentColumn[app] = {};                        
                        }
                        if (this.compositePropertiesInOneParentColumn[app][this.scheme[app][prop]['show']] === undefined) {
                            this.compositePropertiesInOneParentColumn[app][this.scheme[app][prop]['show']] = [];
                        }
                        this.compositePropertiesInOneParentColumn[app][this.scheme[app][prop]['show']].push(prop);
                    }
                }
            }
        } else {
            for (let prop in this.scheme) {
                if (this.scheme[prop]['defaultSorting']) {
                    this.sortedProperty = prop;
                }
                if (this.scheme[prop]['show'] == true) {
                    this.singlePropsWithoutNesting.push(prop);
                } else if (this.scheme[prop]['show'] == false) {
                        
                } else {
                    if (this.propertiesInOneParentColumn === undefined) {
                        this.propertiesInOneParentColumn = {};                        
                    }
                    if (this.propertiesInOneParentColumn[this.scheme[prop]['show']] === undefined) {
                        this.propertiesInOneParentColumn[this.scheme[prop]['show']] = [];
                    }
                    this.propertiesInOneParentColumn[this.scheme[prop]['show']].push(prop);
                }
            }
        }
        //console.log(JSON.stringify(this.compositePropertiesInOneParentColumn))
        
    }
    
    public getDefaultSortedProperty(app?: string): string {
        if (this.containsNestedProperties) {
            return this.compositeSortedProperty[app];
        } else {
            return this.sortedProperty;
        }
    }
    
    public getSinglePropertiesForShow(app?: string): string[] {
        if (this.containsNestedProperties) {
            return this.compositeSinglePropsWithoutNesting[app];            
        } else {
            return this.singlePropsWithoutNesting;
        }
    }
    
    public nestingDegreeOfObject(obj: object, j?: number): number {
        if (j === undefined) j = 0;
        if (Object.keys(obj).length > 0) {
            for (let o in obj) {
                j++;
                j = this.nestingDegreeOfObject(obj[o], j);
                break;
            }
        }
        return j;
    }
}
