export class Role {
    public rolename?: string;
    public application?: string;

    constructor(public roleObj?: object) {
        if (roleObj) {
            this.rolename = (roleObj["ROLENAME"]) ? roleObj["ROLENAME"] : roleObj["Rolename"];
            this.application = (roleObj["Application"]) ? roleObj["Application"] : roleObj["Applications"];
        }
    }
    
    public getStringOfOptionsObject(): string {
        let opts = "";
        Object.entries(this.roleObj).forEach((entry)=>{
            if ((entry[0] !== "Options") && (entry[0] !== "ROLENAME") && (entry[0] !== "Application")) {
                if (opts !== "") {
                    opts = opts + "+";
                }
                opts = opts + entry[0] + ": " + Object.values(entry);
            }
        });
        return opts;
    }
    
    public getArrayOfOptionsObject(): Array<string> {
        let opts = new Array<string>();
        Object.entries(this.roleObj).forEach((entry)=>{
            if ((entry[0] !== "Options") && (entry[0] !== "ROLENAME") && (entry[0] !== "Application")) {
                opts.push(entry[0] + ": " + Object.values(entry));
            }
        });
        return opts;
    }
    
}
