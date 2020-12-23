import * as React from "react";
import LoopView, {LoopViewProps} from "./LoopView";
import {getDuplicatedItems} from "./Utils";

export interface State {
    duplicatedItems: any[]
    items: any[]
    initialRenderIndex: number
}

export type Props = {
    multiplier?: number
} & LoopViewProps

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
            return {
                items: nextProps.items,
                duplicatedItems: updatedItems,
                initialRenderIndex: updatedInitialRenderIndex
            };
        } else return null;
    }

    rowRenderer = (type: string | number, data: any, index: number, extendedState?: object): JSX.Element | JSX.Element[] | null => {
        const {rowRenderer, items} = this.props
        return rowRenderer(type, data, index % items.length, extendedState);
    }

    render() {
        const {duplicatedItems} = this.state
        const {loop, initialRenderIndex, ...rest} = this.props
        return <LoopView
            {...rest}
            items={duplicatedItems}
            loop={loop}
            initialRenderIndex={this.state.initialRenderIndex}
            rowRenderer={this.rowRenderer}
        />
        // return <Text>{JSON.stringify(items)}</Text>
    }
}

export default DuplicationItemsRecyclerView
