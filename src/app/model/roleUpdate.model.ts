import { Role } from "../model/role.model";

export class RoleUpdate {
    public oldValues?: object;
    public newValues?: object;

    constructor(oldValue?: object,
                newValue?: object) {
	this.oldValues = oldValue;
	this.newValues = newValue;
    }
}

