"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const recyclerlistview_1 = require("recyclerlistview");
/**
 * Example for multiplier 2
 *Original Items:       1  2   3   4
 Fake Items:            1   2   3   4   1   2   3   4   1
 Fake Index:            0   1   2   3   4   5   6   7   8
 * @param items
 * @param multipler
 * @returns {any[]}
 */
function useDataState(items, multipler, { height, width }) {
    const [_dataSource, set_dataSource] = (0, react_1.useState)(null);
    const [_layoutProvider, set_layoutProvider] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        let dataProvider = new recyclerlistview_1.DataProvider((r1, r2) => {
            return r1 !== r2;
        });
        let i = 1;
        let fakeItems = [...items];
        for (; i < multipler; i++) {
            fakeItems = i === multipler - 1 ? [...fakeItems, ...items, items[0]] : [...fakeItems, ...items];
        }
        set_dataSource(dataProvider.cloneWithRows([...fakeItems]));
        set_layoutProvider(new recyclerlistview_1.LayoutProvider((index) => {
            return 'FULL';
        }, (type, dim) => {
            dim.width = width;
            dim.height = height;
        }));
    }, [items, multipler]);
    return [_dataSource, _layoutProvider];
}
exports.default = useDataState;
//# sourceMappingURL=useDataState.js.map