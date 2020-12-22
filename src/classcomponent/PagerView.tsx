import * as React from "react";
import {RecyclerListViewProps} from "recyclerlistview/dist/reactnative/core/RecyclerListView";
import CustomBaseScrollView from "../CustomBaseScrollView";
import {RecyclerListView} from "recyclerlistview";

export interface PagerViewState {
    currentIndex: number
    currentInitialRenderIndex: number
    items: any[]
}

export interface PagerViewProps extends Partial<RecyclerListViewProps> {
    items: any[]
}
const WINDOW_CORRECTION_INSET = 20

/**
 * This view duplicates the data for infinite scroll in case of single item we are not even using simple view as a container skip duplication logic if loop is false
 */
class PagerView extends React.Component<PagerViewProps, PagerViewState> {
    private recyclerListRef: React.RefObject<RecyclerListView<any, any>>;

    constructor(props: PagerViewProps) {
        super(props);
        this.recyclerListRef = React.createRef();

        this.state = {
            items: props.items,
            currentIndex: props.initialRenderIndex,
            animating: false,
            currentInitialRenderIndex: props.initialRenderIndex
        }
    }

    static getDerivedStateFromProps(nextProps: PagerViewProps, prevState: PagerViewState) {
        console.log('getDerivedStateFromProps -->', nextProps.initialRenderIndex)
        if (nextProps.initialRenderIndex !== prevState.currentInitialRenderIndex
        || nextProps.items !== prevState.items ) {
            console.log('callllll -->', nextProps.items !== prevState.items, nextProps.initialRenderIndex !== prevState.currentInitialRenderIndex)
            return {
                currentIndex: nextProps.initialRenderIndex,
                items: nextProps.items,
                currentInitialRenderIndex: nextProps.initialRenderIndex
            };
        } else return null;
    }


    scrollToIndex = (position: number, animation: boolean) => {
        this.recyclerListRef.current.scrollToIndex(position, animation)
    }

    onVisibleIndexesChanged = (all: number[]) => {
        const {onVisibleIndexesChanged} = this.props
        if (all.length === 1){
            this.setState({currentIndex: all[0]});
            onVisibleIndexesChanged && onVisibleIndexesChanged(all, undefined, undefined)
        }
    }


    applyWindowCorrection = (offsetX: number, offsetY: number, windowCorrection: { startCorrection: number, endCorrection: number}) => {
        windowCorrection.startCorrection = WINDOW_CORRECTION_INSET
        windowCorrection.endCorrection = -WINDOW_CORRECTION_INSET
    }

    render() {
        const {items, ...rest} = this.props

        return <RecyclerListView
            {...rest}
            ref={this.recyclerListRef}
            isHorizontal
            externalScrollView={CustomBaseScrollView}
            dataProvider={_dataSource}
            layoutProvider={_layoutProvider}
            onVisibleIndicesChanged={this.onVisibleIndexesChanged}
            applyWindowCorrection={this.applyWindowCorrection}
        />
    }
/*
    render() {
        const {items} = this.props

        const {animating, currentIndex} = this.state
        return <View style={{height: 200, marginTop: 300}}>
            {items.map((value, index) => <Text key={index}
                style={{color: (currentIndex === index && !animating) ? 'red' : 'black'}}>{value}</Text>)}
            <Button title={'forward'} onPress={this.buttonClickF}/>
            <Button title={'backward'} onPress={this.buttonClickB}/>
            {<Text>{animating ? 'ANIMATING' : ''}</Text>}
        </View>
    }


    buttonClickF = () => {
        console.log('buttonClickF -->', this.state.currentIndex)
        if (this.state.currentIndex == this.props.items.length-1) return;
        this.onVisibleIndexesChanged(this.state.currentIndex + 1);
    }


    buttonClickB = () => {
        console.log('buttonClickB -->', this.state.currentIndex)
        if (this.state.currentIndex == 0) return;
        this.onVisibleIndexesChanged(this.state.currentIndex - 1);
    }


*/

    moveToNext(animtion: boolean) {
        const {currentIndex} = this.state
        if (currentIndex == this.props.items.length-1) return;
        this.scrollToIndex(currentIndex+1, animtion)
    }
}

export default PagerView
