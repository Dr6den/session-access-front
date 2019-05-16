export class Role {
    public ROLENAME?: string;
    public ACCESS?: Array<string>;
    public GBU?: Array<string>;
    public REGION?: Array<string>;
    public COGS?: Array<string>;

    constructor(public rolenamePar?: string,
                public accessPar?: Array<string>,
                public gbuPar?: Array<string>,
                public regionPar?: Array<string>,
                public cogsPar?: Array<string>) {
        this.ROLENAME = rolenamePar;
	this.ACCESS = accessPar;
	this.GBU = gbuPar;
	this.REGION = regionPar;
	this.COGS = cogsPar;
    }
}
