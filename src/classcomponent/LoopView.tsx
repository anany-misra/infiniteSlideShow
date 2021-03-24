import * as React from "react";
import AutoScrollView, {AutoScrollViewProps} from "./AutoScrollView";
import ContainerView from "./ContainerView";

export interface LoopViewState {
    items: any[]
    timer?: NodeJS.Timeout
}

export type LoopViewProps<ITEM, CONTAINER_PROPS> = {
    loop: boolean
} & AutoScrollViewProps<ITEM, CONTAINER_PROPS>

/**
 * This view duplicates the data for infinite scroll in case of single item we are not even using simple view as a container skip duplication logic if loop is false
 */
class LoopView<ITEM, CONTAINER_PROPS, CONTAINER_TYPE extends ContainerView<ITEM, CONTAINER_PROPS>> extends React.Component<LoopViewProps<ITEM, CONTAINER_PROPS>, LoopViewState> {
    private pagerViewRef: React.RefObject<AutoScrollView<ITEM, CONTAINER_PROPS>>;
    private previousItems: ITEM[]
    constructor(props: LoopViewProps<ITEM, CONTAINER_PROPS>) {
        super(props);
        this.previousItems = props.items
        this.pagerViewRef = React.createRef();
        this.state = {items: props.items}
    }

    UNSAFE_componentWillReceiveProps(nextProps: Readonly<LoopViewProps<ITEM,CONTAINER_PROPS>>, nextContext: any) {
        if (nextProps.items !== this.state.items ) {
            this.state.timer && clearInterval(this.state.timer)
            return {
                items: nextProps.items,
                timer: undefined,
            };
        }
    }
    onPageSelected = (index: number): void => {
        //this.previousItems == this.state.items this is being added when datasource is updated its been called just ignore this call not required
        if (this.previousItems == this.state.items) {
            const {items} = this.props
            if (index === 0 || index === items.length-1) {
                const centerIndex = Math.floor(items.length / 2)
                this.setState({timer: setTimeout(() => {
                        this.pagerViewRef.current.scrollToIndex(centerIndex, false, 'LOOPER')
                    }, 200)})
            }
            //TODO: paad onpage selected properly
        }
        this.previousItems = this.state.items
    }

    render() {
        const {loop, ...rest} = this.props

        return <AutoScrollView<ITEM, CONTAINER_PROPS>
            ref={this.pagerViewRef}
            {...rest}
            onPageSelected={loop && this.onPageSelected}
        />
    }
}

export default LoopView
