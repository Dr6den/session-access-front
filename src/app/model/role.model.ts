export class Role {
    public ACCESS?: Array<string>;
    public GBU?: Array<string>;
    public REGION?: Array<string>;
    public COGS?: Array<string>;

    constructor(public accessPar?: Array<string>,
                public gbuPar?: Array<string>,
                public regionPar?: Array<string>,
                public cogsPar?: Array<string>) {
	this.ACCESS = accessPar;
	this.GBU = gbuPar;
	this.REGION = regionPar;
	this.COGS = cogsPar;
    }
}
