import * as React from "react";
import {RecyclerListViewProps} from "recyclerlistview/dist/reactnative/core/RecyclerListView";
import CustomBaseScrollView from "../CustomBaseScrollView";
import {BaseLayoutProvider, DataProvider, RecyclerListView} from "recyclerlistview";
import {convertToDataSource, getLayoutProvider} from "./Utils";

export interface PagerViewState {
    currentIndex: number
    _dataSource: DataProvider
    _layoutProvider: BaseLayoutProvider
    currentInitialRenderIndex: number//its been added just to compare in getDerivedState
    items: any[]//its been added just to compare in getDerivedState
}

export interface PagerViewProps extends Partial<RecyclerListViewProps> {
    items: any[]
    style: {width: number, height: number}
}
const WINDOW_CORRECTION_INSET = 20

/**
 * This view duplicates the data for infinite scroll in case of single item we are only using simple view as a container skip duplication logic if loop is false
 */
class PagerView extends React.Component<PagerViewProps, PagerViewState> {
    private recyclerListRef: React.RefObject<RecyclerListView<any, any>>;

    constructor(props: PagerViewProps) {
        super(props);
        this.recyclerListRef = React.createRef();
        const {width, height} = props.style || {}
        this.state = {
            items: props.items,
            currentIndex: props.initialRenderIndex,
            currentInitialRenderIndex: props.initialRenderIndex,
            _layoutProvider: getLayoutProvider({width, height}),
            _dataSource: convertToDataSource(props.items)
        }
    }

    /*componentWillReceiveProps(nextProps: Readonly<PagerViewProps>, nextContext: any) {
        if (nextProps.initialRenderIndex !== this.state.currentInitialRenderIndex
            || nextProps.items !== this.state.items ) {
            const {width, height} = nextProps.style || {}
            // console.log('callllll -->', nextProps.items, nextProps.initialRenderIndex)
            const changeScrolledPos = this.state.currentInitialRenderIndex != nextProps.initialRenderIndex;
            this.setState({
                currentIndex: nextProps.initialRenderIndex,
                items: nextProps.items,
                currentInitialRenderIndex: nextProps.initialRenderIndex,
                _layoutProvider: getLayoutProvider({width, height}),
                _dataSource: convertToDataSource(nextProps.items)
            }, () => {
                if(changeScrolledPos) {
                    setTimeout(() => {
                        console.log('NEXT initialRenderIndex -->', nextProps.initialRenderIndex)
                        this.scrollToIndex(nextProps.initialRenderIndex, false, 'ME')

                    }, 0)
                }
            });


        } else return null;
    }*/


        static getDerivedStateFromProps(nextProps: PagerViewProps, prevState: PagerViewState) {
            if (nextProps.initialRenderIndex !== prevState.currentInitialRenderIndex
            || nextProps.items !== prevState.items ) {
                const {width, height} = nextProps.style || {}
                console.log('callllll -->', nextProps.items, nextProps.initialRenderIndex)
                return {
                    currentIndex: nextProps.initialRenderIndex,
                    items: nextProps.items,
                    currentInitialRenderIndex: nextProps.initialRenderIndex,
                    _layoutProvider: getLayoutProvider({width, height}),
                    _dataSource: convertToDataSource(nextProps.items)
                };
            } else return null;
        }


    scrollToIndex = (position: number, animation: boolean, caller?: string) => {
        this.recyclerListRef.current.scrollToIndex(position, animation)
        console.log('SCROLL -->', position, caller)
    }

    onVisibleIndicesChanged = (all: number[]) => {
        const {onVisibleIndicesChanged} = this.props
        if (all.length === 1){
            this.setState({currentIndex: all[0]});
            onVisibleIndicesChanged && onVisibleIndicesChanged(all, undefined, undefined)
        }
    }


    applyWindowCorrection = (offsetX: number, offsetY: number, windowCorrection: { startCorrection: number, endCorrection: number}) => {
        windowCorrection.startCorrection = WINDOW_CORRECTION_INSET
        windowCorrection.endCorrection = -WINDOW_CORRECTION_INSET
    }

    render() {
        const {items, ...rest} = this.props
        const {_layoutProvider, _dataSource} = this.state
        console.log('items', this.props.items)
        // console.log('initialRenderIndex', rest.initialRenderIndex)
        return <RecyclerListView
            {...rest}
            ref={this.recyclerListRef}
            isHorizontal
            externalScrollView={CustomBaseScrollView}
            dataProvider={_dataSource}
            layoutProvider={_layoutProvider}
            onVisibleIndicesChanged={this.onVisibleIndicesChanged}
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
        this.scrollToIndex(currentIndex+1, animtion, 'MOVE NEXT')
    }
}

export default PagerView
