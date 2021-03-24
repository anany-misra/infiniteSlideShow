import * as React from "react";
import LoopView, {LoopViewProps} from "./LoopView";
import {getDuplicatedItems} from "./Utils";
import ContainerView from "./ContainerView";
import withIndicator from "./withIndicator";

export interface State {
    duplicatedItems: any[]
    items: any[]
    initialRenderIndex: number
}

export type Props<ITEM, CONTAINER_PROPS, CONTAINER_TYPE extends ContainerView<ITEM, CONTAINER_PROPS>> = {
    multiplier?: number
} & LoopViewProps<ITEM, CONTAINER_PROPS>

/**
 * This view duplicates the data for infinite scroll in case of single item we are not even using simple view as a container skip duplication logic if loop is false
 */
class InfiniteSnapView<ITEM, CONTAINER_PROPS, CONTAINER_TYPE extends ContainerView<ITEM, CONTAINER_PROPS>> extends React.Component<Props<ITEM, CONTAINER_PROPS, CONTAINER_TYPE>, State> {
    public static defaultProps = {
        multiplier: 2,
        loop: true,
        initialRenderIndex: 0
    };

    constructor(props: Props<ITEM, CONTAINER_PROPS, CONTAINER_TYPE>) {
        super(props);
        const {items, multiplier, loop, initialRenderIndex} = props;
        const [updatedInitialRenderIndex, updatedItems] = getDuplicatedItems(items, multiplier, loop, initialRenderIndex);
        this.state = {items: items, duplicatedItems: updatedItems, initialRenderIndex: updatedInitialRenderIndex}
    }

    UNSAFE_componentWillReceiveProps(nextProps: Readonly<Props<ITEM, CONTAINER_PROPS, CONTAINER_TYPE>>, nextContext: any) {
        if (nextProps.items !== this.state.items) {//intentional change for initialRenderIndex is not reflected if items is not changed
            const {items, multiplier, loop, initialRenderIndex} = nextProps;
            const [updatedInitialRenderIndex, updatedItems] = getDuplicatedItems(items, multiplier, loop, initialRenderIndex);
            this.setState({
                items: nextProps.items,
                duplicatedItems: updatedItems,
                initialRenderIndex: updatedInitialRenderIndex
            });
        }
    }

    rowRenderer = (type: string | number, data: ITEM, index: number, ...rest): JSX.Element | JSX.Element[] | null => {
        const {rowRender, items} = this.props
        return rowRender(type, data, index % items.length, ...rest);
    }

    render() {
        const {duplicatedItems} = this.state
        const {initialRenderIndex, multiplier, ...rest} = this.props
        // const WrappedLooperView = withIndicator<LoopViewProps<ITEM, CONTAINER_PROPS>, ITEM, CONTAINER_PROPS, CONTAINER_TYPE>(LoopView<ITEM, CONTAINER_PROPS, CONTAINER_TYPE>)
        const WrappedLooperView = withIndicator(LoopView)
        return <WrappedLooperView
            {...rest}
            originalSize={this.props.items.length}
            onScroll={()=> {}}
            items={duplicatedItems}
            initialRenderIndex={this.state.initialRenderIndex}
            rowRender={this.rowRenderer}
        />
    }
}

export default InfiniteSnapView
