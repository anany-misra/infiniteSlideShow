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
/**
 * Give scroll value in bouded manner only so that indicator doesn't over flow
 * @param scroll
 * @param index
 * @param size
 */
export const getBoundedScroll = (scroll: number, index: number, size: number) => {
    //Normalize value from fake index to actual index
    let value = Number(scroll.toFixed(4)) % size
    if (value < 0) value = 0
    //Don't animate if you are at actual index 0 in left size and last index in right side
    if (value > size - 1) value = index % size === 0 ? 0 : size - 1

    return value
}
