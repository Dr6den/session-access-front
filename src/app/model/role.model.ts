export class Role {
    public access?: Array<string>;
    public gbu?: Array<string>;
    public region?: Array<string>;
    public cogs?: Array<string>;

    constructor(public accessPar?: Array<string>,
                public gbuPar?: Array<string>,
                public regionPar?: Array<string>,
                public cogsPar?: Array<string>) {
	this.access = accessPar;
	this.gbu = gbuPar;
	this.region = regionPar;
	this.cogs = cogsPar;
    }
}
