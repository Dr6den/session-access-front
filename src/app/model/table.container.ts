export class TableContainer {
    public items: object[];
    public itemsOnPage: number;
    public currentPage: number;
    public numberOfPages: number;

    constructor(itemsObj?: Array<object>, numberItemsOnThePage?: number) {
        this.numberOfPages = Math.ceil(itemsObj.length / numberItemsOnThePage);	
        this.currentPage = 1;
        this.itemsOnPage = numberItemsOnThePage;
        let iter = 0;
        let page = 0;
        let totalIter = 1;
        let processingArray = [];
        this.items = [];
        itemsObj.forEach((role) => {
            if(iter < this.itemsOnPage) {
                processingArray.push(role);
                iter++;
            }
            if (!(iter < this.itemsOnPage) || (totalIter == itemsObj.length)) {
                let pageObj = new Object();
                pageObj["page"] = page;
                pageObj["array"] = processingArray
                this.items[page] = pageObj;
                iter = 1;
                page++;
                processingArray = [];
            }
            totalIter++;
        });
    }
    
    public getRolesOnPage(numberOfPage: number): object[] {
        this.currentPage = numberOfPage;
        return this.items[numberOfPage]["array"];
    }

    public next(): object[] {
        return this.getRolesOnPage(this.currentPage + 1);
    }
    
    public previous(): object[] {
        return this.getRolesOnPage(this.currentPage + 1);
    }
}

