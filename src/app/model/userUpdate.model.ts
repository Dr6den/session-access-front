import { User } from "../model/user.model";

export class UserUpdate {
    public oldValues?: User;
    public newValues?: User;

    constructor(oldVal?: User,
                newVal?: User) {
	this.oldValues = oldVal;
	this.newValues = newVal;
    }
}

