import * as React from "react";
import PagerView, {PagerViewProps, PagerViewState} from "./PagerView";
import AutoScrollView, {AutoScrollViewProps} from "./AutoScrollView";

export interface LoopViewState {
    initialRenderIndex: number
    items: any[]
    timer?: NodeJS.Timeout
}

export type LoopViewProps = {
    loop: boolean
} & AutoScrollViewProps

/**
 * This view duplicates the data for infinite scroll in case of single item we are not even using simple view as a container skip duplication logic if loop is false
 */
class LoopView extends React.Component<LoopViewProps, LoopViewState> {
    private pagerViewRef: React.RefObject<AutoScrollView>;

    constructor(props: LoopViewProps) {
        super(props);
        this.pagerViewRef = React.createRef();
        this.state = {initialRenderIndex: props.initialRenderIndex, items: props.items}
    }

    static getDerivedStateFromProps(nextProps: LoopViewProps, prevState: LoopViewState): LoopViewState {
        console.log('getDerivedStateFromProps -->', nextProps.initialRenderIndex)
        if (nextProps.initialRenderIndex !== prevState.initialRenderIndex
            || nextProps.items !== prevState.items ) {
            prevState.timer && clearInterval(prevState.timer)
            return {
                initialRenderIndex: nextProps.initialRenderIndex,
                items: nextProps.items,
                timer: undefined,
            };
        } else return null;
    }

    onVisibleIndexesChanged = (item) => {
        if (item.length === 1) {
            const {items} = this.props
            if (item[0] === 0 || item[0] === items.length-1) {
                const centerIndex = Math.floor(items.length / 2)
                this.setState({timer: setTimeout(() => {
                        this.pagerViewRef.current.scrollToIndex(centerIndex, false)
                    }, 3000)})
            }
            //TODO: paad onpage selected properly
        }
    }

    render() {
        const {loop, ...rest} = this.props

        return <AutoScrollView
            ref={this.pagerViewRef}
            {...rest}
            onVisibleIndexesChanged={loop && this.onVisibleIndexesChanged}
        />
    }
}

export default LoopView
