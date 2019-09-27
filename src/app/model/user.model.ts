export class User {
    public USERNAME?: string;
    public USERID?: string;
    public NTSID?: string;
    public NTDOMAINSID?: string;
    public ROLES?: Array<string>;
    public USEREMAIL: string;

    constructor(USERNAME?: string,
                USERID?: string,
                NTSID?: string,
                NTDOMAINSID?: string,
                USEREMAIL?: string,
                ROLES?: Array<string>) {	
    }
}

