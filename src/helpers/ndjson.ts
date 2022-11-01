import { plainToInstance } from "class-transformer";

export const parse = (jsonString: string): Object[] => {
    const type = typeof jsonString;
    if (type !== 'string') throw new Error(`Input have to be string but got ${type}`);

    const jsonRows = jsonString.split(/\n|\n\r/).filter(Boolean);
    return jsonRows.map(jsonStringRow => JSON.parse(jsonStringRow));
};

export function parseToInstance<T>(cls: { new(): T; }, jsonString: string): T[] {
    let objs: T[] = [];

    const jsonRows = jsonString.split(/\n|\n\r/).filter(Boolean);

    return jsonRows.map(jsonStringRow => plainToInstance(cls, JSON.parse(jsonStringRow)));
}