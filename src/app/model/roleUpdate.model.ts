import { Role } from "../model/role.model";

export class RoleUpdate {
    public oldValues?: Role;
    public newValues?: Role;

    constructor(oldValue?: Role,
                newValue?: Role) {
	this.oldValues = oldValue;
	this.newValues = newValue;
    }
}

