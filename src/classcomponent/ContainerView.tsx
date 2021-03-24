import * as React from "react";
import {CarouselProps} from "react-native-snap-carousel";

export interface ContainerViewState<ITEM> {
    currentIndex: number
    currentInitialRenderIndex: number//its been added just to compare in getDerivedState
    items: ITEM[]//its been added just to compare in getDerivedState
}

export interface ContainerViewProps<ITEM> extends Partial<CarouselProps<ITEM>> {
    items: ITEM[]
    onPageSelected?: (index: number) => void
    rowRender: (type: string | number, data: any, index: number, ...rest: any) => JSX.Element | JSX.Element[] | null;
    initialRenderIndex: number
}

/**
 * This view duplicates the data for infinite scroll in case of single item we are only using simple view as a container skip duplication logic if loop is false
 */
abstract class ContainerView<ITEM, CONTAINER_PROPS> extends React.Component<ContainerViewProps<ITEM> & CONTAINER_PROPS, ContainerViewState<ITEM>> {
    public constructor(props: ContainerViewProps<ITEM> & CONTAINER_PROPS) {
        super(props);
        this.state = {
            items: props.items,
            currentIndex: props.initialRenderIndex,
            currentInitialRenderIndex: props.initialRenderIndex,
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps: Readonly<ContainerViewProps<ITEM>>, nextContext: any) {
        if (nextProps.initialRenderIndex !== this.state.currentInitialRenderIndex
            || nextProps.items !== this.state.items ) {
            const changeScrolledPos = this.state.currentInitialRenderIndex != nextProps.initialRenderIndex;
            this.setState({
                currentIndex: nextProps.initialRenderIndex,
                items: nextProps.items,
                currentInitialRenderIndex: nextProps.initialRenderIndex,
            }, () => {
                if(changeScrolledPos) {
                    setTimeout(() => {
                        this.scrollToIndex(nextProps.initialRenderIndex, false, 'ME')

                    }, 0)
                }
            });


        }
    }

    abstract scrollToIndex(position: number, animation: boolean, caller?: string);
    abstract onPageChange(index: number);
    abstract moveToNext(animtion: boolean)
    abstract render()
}

export default ContainerView
