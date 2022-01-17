export interface History {
    bpi: {
        [date: string]: number;
    };
    disclaimer: string;
    time: {
        updated: string;
        updatedISO: string;
    };
}
