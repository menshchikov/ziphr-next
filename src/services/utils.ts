export function getSlicedArray<T>(array: Array<T>, page: number, size: number): T[] {
    const start = (page - 1) * size;
    const end = start + size;
    return array.slice(start, end);
}

export function filterArrayByTitle<T extends {title: string}>(items: T[], filter: string):T[] {
    return items.filter(item => item.title.indexOf(filter) > -1);
}