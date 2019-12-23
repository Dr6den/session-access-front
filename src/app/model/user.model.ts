import { ShortRole } from "../model/short.role.model";

export class User {
    public USERNAME?: string;
    public USERID?: string;
    public NTSID?: string;
    public NTDOMAINSID?: string;
    public ROLES?: Array<ShortRole>;
    public USEREMAIL: string;

    constructor(USERNAME?: string,
                USERID?: string,
                NTSID?: string,
                NTDOMAINSID?: string,
                USEREMAIL?: string,
                ROLES?: Array<ShortRole>) {	
    }
}

