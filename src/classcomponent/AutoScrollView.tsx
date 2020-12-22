import * as React from "react";
import PagerView, {PagerViewProps, PagerViewState} from "./PagerView";
import {RecyclerListView} from "recyclerlistview";

export interface AutoScrollViewState {
    autoscroll?: boolean
    duration?: number
    isDragging?: boolean
    timerInterval?: NodeJS.Timeout
}

export type AutoScrollViewProps = {
    autoscroll?: boolean
    duration?: number
} & PagerViewProps


const DEFAULT_AUTOSCROLL_DURATION = 3000
/**
 * This view duplicates the data for infinite scroll in case of single item we are not even using simple view as a container skip duplication logic if loop is false
 */
class AutoScrollView extends React.Component<AutoScrollViewProps, AutoScrollViewState> {
    public static defaultProps = {
        autoscroll: true,
        duration: DEFAULT_AUTOSCROLL_DURATION,
    };

    private pagerViewRef: React.RefObject<PagerView>;

    constructor(props: AutoScrollViewProps) {
        super(props);
        this.pagerViewRef = React.createRef();
        const timerInterval = props.autoscroll ? setInterval(this.tick, props.duration): undefined
        this.state = {
            autoscroll: props.autoscroll,
            duration: props.duration,
            timerInterval
        }
    }

    onScrollAnimationEnd = () => {
        this.setState({isDragging:false})
    }

    onScrollBeginDrag = () => {
        this.setState({isDragging:true})
    }

    scrollToIndex = (position: number, animation: boolean) => {
        this.pagerViewRef && this.pagerViewRef.current && this.pagerViewRef.current.scrollToIndex(position, animation)
    }
    tick = () => {
        if(this.state.isDragging) return;
        this.pagerViewRef && this.pagerViewRef.current && this.pagerViewRef.current.moveToNext(true)
    }

    static getDerivedStateFromProps(nextProps: AutoScrollViewProps, prevState: AutoScrollViewState): AutoScrollViewState {
        console.log('getDerivedStateFromProps -->', nextProps.initialRenderIndex)
        if (nextProps.autoscroll !== prevState.autoscroll
            || nextProps.duration !== prevState.duration ) {
            prevState.timerInterval && clearInterval(prevState.timerInterval)
            //TODO: Recreate the timer again
            // const timerInterval = nextProps.autoscroll ? setInterval(undefined, nextProps.duration): undefined
            return {
                autoscroll: nextProps.autoscroll,
                duration: nextProps.duration,
                // timerInterval: timerInterval
            };
        } else return null;
    }

    componentWillUnmount() {
        this.state.timerInterval && clearInterval(this.state.timerInterval)
    }

    render() {
        return <PagerView
            ref={this.pagerViewRef}
            {...this.props}
            onScrollEndDrag={this.onScrollAnimationEnd}
            onScrollBeginDrag={this.onScrollBeginDrag}
        />
    }
}

export default AutoScrollView
