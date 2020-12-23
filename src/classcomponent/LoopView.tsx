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
    private previousItems: any[]
    constructor(props: LoopViewProps) {
        super(props);
        this.previousItems = props.items
        this.pagerViewRef = React.createRef();
        this.state = {initialRenderIndex: props.initialRenderIndex, items: props.items}
    }

    static getDerivedStateFromProps(nextProps: LoopViewProps, prevState: LoopViewState): LoopViewState {
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

    onVisibleIndicesChanged = (item) => {
        //this.previousItems == this.state.items this is being added when datasource is updated its been called just ignore this call not required
        if (item.length === 1 && (this.previousItems == this.state.items)) {
            this.previousItems = this.state.items
            const {items} = this.props
            console.log('ITEMS LOOPER', items, item[0])
            if (item[0] === 0 || item[0] === items.length-1) {
                const centerIndex = Math.floor(items.length / 2)
                this.setState({timer: setTimeout(() => {
                        this.pagerViewRef.current.scrollToIndex(centerIndex, false, 'LOOPER')
                    }, 200)})
            }
            //TODO: paad onpage selected properly
        }
    }

    render() {
        const {loop, ...rest} = this.props

        return <AutoScrollView
            ref={this.pagerViewRef}
            {...rest}
            onVisibleIndicesChanged={loop && this.onVisibleIndicesChanged}
        />
    }
}

export default LoopView
