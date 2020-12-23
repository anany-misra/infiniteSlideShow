import * as React from "react";
import PagerView, {PagerViewProps} from "./PagerView";

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


const DEFAULT_AUTOSCROLL_DURATION = 5000

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
        const timerInterval = this.getTimer()
        this.state = {
            autoscroll: props.autoscroll,
            duration: props.duration,
            timerInterval
        }
    }

    getTimer = () => {
        return this.props.autoscroll ? setInterval(this.tick, this.props.duration) : undefined
    }

    onScrollAnimationEnd = () => {
        // console.log('DRAGGING END')
        this.setState({isDragging: false, timerInterval: this.getTimer()})
    }

    onScrollBeginDrag = () => {
        this.state.timerInterval && clearInterval(this.state.timerInterval)
        this.setState({isDragging: true})
    }

    scrollToIndex = (position: number, animation: boolean, caller?: string) => {
        this.pagerViewRef && this.pagerViewRef.current && this.pagerViewRef.current.scrollToIndex(position, animation, caller)
    }
    tick = () => {
        if (this.state.isDragging) return;
        this.pagerViewRef && this.pagerViewRef.current && this.pagerViewRef.current.moveToNext(true)
    }

    static getDerivedStateFromProps(nextProps: AutoScrollViewProps, prevState: AutoScrollViewState): AutoScrollViewState {
        if (nextProps.autoscroll !== prevState.autoscroll
            || nextProps.duration !== prevState.duration) {
            prevState.timerInterval && clearInterval(prevState.timerInterval)
            //TODO: Recreate the timer again
            // const timerInterval = nextProps.autoscroll ? setInterval(undefined, nextProps.duration): undefined
            return {
                autoscroll: nextProps.autoscroll,
                duration: nextProps.duration,
                // timerInterval: getTim
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
            // @ts-ignore
            onScrollEndDrag={this.onScrollAnimationEnd}
            onScrollBeginDrag={this.onScrollBeginDrag}
        />
    }
}

export default AutoScrollView
