import * as React from "react";
import {ContainerViewProps} from "./ContainerView";
import CarouselContainer from "./recyclers/CarouselContainer";

export interface AutoScrollViewState {
    autoscroll?: boolean
    duration?: number
    isDragging?: boolean
}

export type AutoScrollViewProps<ITEM, CONTAINER_PROPS> = {
    autoscroll?: boolean
    duration?: number
} & ContainerViewProps<ITEM>


const DEFAULT_AUTOSCROLL_DURATION = 5000

/**
 * This view duplicates the data for infinite scroll in case of single item we are not even using simple view as a container skip duplication logic if loop is false
 */
class AutoScrollView<ITEM, CONTAINER_PROPS> extends React.Component<AutoScrollViewProps<ITEM,CONTAINER_PROPS>, AutoScrollViewState> {
    public static defaultProps = {
        autoscroll: true,
        duration: DEFAULT_AUTOSCROLL_DURATION,
    };

    // private pagerViewRef: React.RefObject<ContainerView<ITEM, CONTAINER_PROPS>>;
    private timerInterval: NodeJS.Timeout;
    private pagerViewRef: React.RefObject<any>;

    constructor(props: AutoScrollViewProps<ITEM,CONTAINER_PROPS>) {
        super(props);
        this.pagerViewRef = React.createRef();
        this.timerInterval = this.getTimer()
        this.state = {
            autoscroll: props.autoscroll,
            duration: props.duration,
        }
    }

    getTimer = () => {
        return this.props.autoscroll ? setInterval(this.tick, this.props.duration) : undefined
    }

    onScrollAnimationEnd = () => {
        // console.log('DRAGGING END')
        this.timerInterval = this.getTimer()
        this.setState({isDragging: false})
    }

    onScrollBeginDrag = () => {
        this.timerInterval && clearInterval(this.timerInterval)
        this.setState({isDragging: true})
    }

    scrollToIndex = (position: number, animation: boolean, caller?: string) => {
        this.pagerViewRef && this.pagerViewRef.current && this.pagerViewRef.current.scrollToIndex(position, animation, caller)
    }
    tick = () => {
        if (this.state.isDragging) return;
        this.pagerViewRef && this.pagerViewRef.current && this.pagerViewRef.current.moveToNext(true)
    }

    UNSAFE_componentWillReceiveProps(nextProps: Readonly<AutoScrollViewProps<ITEM,CONTAINER_PROPS>>, nextContext: any) {
        if (nextProps.autoscroll !== this.state.autoscroll
            || nextProps.duration !== this.state.duration) {
            this.timerInterval && clearInterval(this.timerInterval)

            this.setState({
                autoscroll: nextProps.autoscroll,
                duration: nextProps.duration,
            }, () => {
                this.timerInterval = this.getTimer()
            });
        }
    }

    componentWillUnmount() {
        this.timerInterval && clearInterval(this.timerInterval)
    }

    render() {
        const {autoscroll, duration, ...rest} = this.props

        return <CarouselContainer
            ref={this.pagerViewRef}
            {...rest}
            // @ts-ignore
            onScrollEndDrag={this.onScrollAnimationEnd}
            onScrollBeginDrag={this.onScrollBeginDrag}
        />
    }
}

export default AutoScrollView
