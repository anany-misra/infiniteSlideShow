import * as React from "react";
import LoopView, {LoopViewProps} from "./LoopView";

export interface State {
    duplicatedItems: any[]
    items: any[]
    initialRenderIndex: number
}

export type Props = {
    multiplier?: number
} & LoopViewProps

const getDuplicatedItems = (items: any[], multipler: number, loop: boolean, initialRenderIndex: number): [number, any[]] => {
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
 * This view duplicates the data for infinite scroll in case of single item we are not even using simple view as a container skip duplication logic if loop is false
 */
class DuplicationItemsRecyclerView extends React.Component<Props, State> {
    public static defaultProps = {
        multiplier: 2,
        loop: true,
        initialRenderIndex: 0
    };

    constructor(props: Props) {
        super(props);
        const {items, multiplier, loop, initialRenderIndex} = props;
        const [updatedInitialRenderIndex, updatedItems] = getDuplicatedItems(items, multiplier, loop, initialRenderIndex);
        this.state = {items: items, duplicatedItems: updatedItems, initialRenderIndex: updatedInitialRenderIndex}
    }

    static getDerivedStateFromProps(nextProps: Props, prevState: State) {
        if (nextProps.items !== prevState.items) {//intentional change for initialRenderIndex is not reflected if items is not changed
            const {items, multiplier, loop, initialRenderIndex} = nextProps;
            const [updatedInitialRenderIndex, updatedItems] = getDuplicatedItems(items, multiplier, loop, initialRenderIndex);
            return {items: nextProps.items, duplicatedItems: updatedItems, initialRenderIndex: updatedInitialRenderIndex};
        } else return null;
    }

    render() {
        const {duplicatedItems} = this.state
        const {loop, initialRenderIndex, ...rest} = this.props
        return <LoopView {...rest} items={duplicatedItems} loop={loop} initialRenderIndex={this.state.initialRenderIndex}/>
        // return <Text>{JSON.stringify(items)}</Text>
    }
}

export default DuplicationItemsRecyclerView
