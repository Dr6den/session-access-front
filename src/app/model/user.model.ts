export class User {
    public USERNAME?: string;
    public USERID?: string;
    public NTSID?: string;
    public NTDOMAINSID?: string;
    public ROLE?: Array<string>;

    constructor(public username?: string,
                public userid?: string,
                public ntsid?: string,
                public ntdomainsid?: string,
                public role?: Array<string>) {
	this.USERNAME = username;
	this.USERID = userid;
	this.NTSID = ntsid;
        this.NTDOMAINSID = ntdomainsid;
	this.ROLE = role;
    }
}

