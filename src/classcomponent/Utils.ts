import {DataProvider, LayoutProvider} from "recyclerlistview";

export const getLayoutProvider = ({width, height}: {width: number, height: number}) => {
    return new LayoutProvider(
        (index) => {
            return 'FULL'
        },
        (type, dim) => {
            dim.width = width
            dim.height = height
        }
    )
}
const dataProvider = new DataProvider((r1, r2) => {
    return r1 !== r2;
});

export const convertToDataSource = (items: any[]) => {
    return dataProvider.cloneWithRows(items)
}

/**
 * Duplicate items based on multiplyer and calculate fare intial index(in duplicated items)
 * @param items
 * @param multipler
 * @param loop
 * @param initialRenderIndex
 */
export const getDuplicatedItems = (items: any[], multipler: number, loop: boolean, initialRenderIndex: number): [number, any[]] => {
    if (!items || items.length < 2 || !loop) return [initialRenderIndex, items]
    let i = 1
    let fakeItems = [...items]
    for (; i < multipler; i++) {
        // @ts-ignore items will always of size greater then zero
        fakeItems = i === multipler - 1 ? [...fakeItems, ...items, items[0]] : [...fakeItems, ...items]
    }
    if(initialRenderIndex >= items.length && __DEV__) throw new Error('Intitial index out of bound!')
    //calculate fair initialRenderIndex in case of duplicate items
    const initialRenderIndexFare = Math.floor(fakeItems.length / 2) + initialRenderIndex;
    return [initialRenderIndexFare, fakeItems];
}
