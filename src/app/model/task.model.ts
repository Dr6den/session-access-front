export class Task {
    public id?: string;
    public name?: string;
    public startDate?: Date;
    public endDate?: Date;
    public executors?: Array<string>;

    constructor(public namePar?: string,
                public startDatePar?: Date,
                public endDatePar?: Date,
                public executorsPar?: Array<string>) {
	this.name = namePar;
	this.startDate = startDatePar;
	this.endDate = endDatePar;
	this.executors = executorsPar;
    }
}
