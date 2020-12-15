import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import {Animated, Dimensions, FlexAlignType, View} from 'react-native';
import {RecyclerListView} from 'recyclerlistview';
import CustomBaseScrollView from './CustomBaseScrollView';
import DefaultViewPageIndicator from './DefaultViewPageIndicator';
import useDataState from "./hooks/useDataState";
import usePlayState from "./hooks/usePlayState";
import {RecyclerListViewProps} from "recyclerlistview/dist/reactnative/core/RecyclerListView";

const WINDOW_CORRECTION_INSET = 20
interface SlidShowProps {
    initialIndex: number,
    duration: number,
    multiplier: number,
    autoScroll?: boolean,
    disableIndicator?: boolean,
    loop: boolean,
    items: any[],
    rowRenderer: (type: string | number, data: any, index: number, extendedState?: object) => null;
    style: {
        width: number,
        height: number,
    },
    recyclerViewProps?: RecyclerListViewProps,
    indicatorStyle: {
        alignItems: FlexAlignType,
        position?: 'absolute' | 'relative';
        bottom: number,
        left: number,
        right: number,
    }
}

let itemWidth: number
const SlideShow = (
    {
        initialIndex,
        duration,
        items,
        rowRenderer,
        multiplier,
        style,
        indicatorStyle,
        autoScroll,
        disableIndicator,
        recyclerViewProps,
        loop
    }: SlidShowProps
) => {
    const multiplierValidated = items.length === 1 ? 0 : multiplier
    const recyclerList = useRef(null)
    const intialialScrollIndex = (multiplierValidated / 2) * items.length + initialIndex
    const [currentIndexFake, setCurrentIndexFake] = useState<number>(intialialScrollIndex)
    const [isPlaying, setIsPlaying] = usePlayState(autoScroll)
    const [_dataSource, _layoutProvider] = useDataState(items, multiplierValidated, style)
    const scrollValue = useRef(new Animated.Value(0));

    useEffect(() => {
        if (autoScroll && isPlaying && multiplierValidated > 0 && (loop || (currentIndexFake + 1) % items.length !== 0)) {
            const timerId = setTimeout(() => {
                const updatedFakeIndex = (currentIndexFake + 1) % (multiplierValidated * items.length + 1)
                scrollToIndex(updatedFakeIndex, true)
            }, duration)
            return () => clearTimeout(timerId)
        }
    }, [currentIndexFake, isPlaying, autoScroll, multiplierValidated])
    useEffect(() => {
        setIsPlaying(autoScroll)
    }, [autoScroll])



    // let scrollValue = new Animated.Value(0)
    const scrollToIndex = (index: number, animation: boolean) => {
        recyclerList && recyclerList.current && recyclerList.current.scrollToIndex(index, animation)
    }

    const onPageSelected = (position) => {
        if (position === 0 || position === multiplierValidated * items.length) {
            const centerIndex = (multiplierValidated / 2) * items.length
            setTimeout(() => { scrollToIndex(centerIndex, false) }, 500)
        } else {
            // Its in case of else only because it will be called nextime if it is going into above if condition reason for that is scrollToIndex
            // currentIndexFake = item[0]
            setCurrentIndexFake(position)
            const {onVisibleIndicesChanged = undefined} = recyclerViewProps || {}
            onVisibleIndicesChanged && onVisibleIndicesChanged(position % items.length)
        }
    }

    const onVisibleIndicesChange = (item, p1, p2) => {
        if (item.length === 1) onPageSelected(item[0])
    }


    const setScrollValue = (scroll: number) => {

        //Normalize value from fake index to actual index
        let value = Number(scroll.toFixed(4)) % items.length

        if (value < 0) value = 0

        //Don't animate if you are at actual index 0 in left size and last index in right side
        if (value > items.length - 1) value = currentIndexFake % items.length === 0 ? 0 : items.length - 1

        scrollValue.current.setValue(value)
    }

    const onScroll = ({nativeEvent: {contentOffset: {x}}}) => {
        setScrollValue(x / itemWidth)
    }

    const onItemLayout = ({nativeEvent: {layout: {width}}}) => {
        itemWidth = width
    }

    const onScrollAnimationEnd = () => {
        const { onScrollEndDrag } = recyclerViewProps || {}
        onScrollEndDrag && onScrollEndDrag()
        setIsPlaying(true)
    }

    const onScrollBeginDrag = () => {
        setIsPlaying(false)
    }

    const applyWindowCorrection = (offsetX: number, offsetY: number, windowCorrection: { startCorrection: number, endCorrection: number}) => {
        windowCorrection.startCorrection = WINDOW_CORRECTION_INSET
        windowCorrection.endCorrection = -WINDOW_CORRECTION_INSET
    }

    //Only render RLV once you have the data
    return (
        <View style={style}>
            {_layoutProvider && _dataSource && <RecyclerListView
                {...recyclerViewProps}
                initialRenderIndex={intialialScrollIndex}
                onLayout={onItemLayout}
                onScroll={onScroll}
                ref={recyclerList}
                isHorizontal
                onScrollEndDrag={onScrollAnimationEnd}
                onScrollBeginDrag={onScrollBeginDrag}
                externalScrollView={CustomBaseScrollView}
                dataProvider={_dataSource}
                layoutProvider={_layoutProvider}
                rowRenderer={(type: string | number, data: any, index: number, extendedState?: object) => rowRenderer(type, data, index%items.length, extendedState)}
                onVisibleIndicesChanged={onVisibleIndicesChange}
                applyWindowCorrection={applyWindowCorrection}
            />}
            {!disableIndicator && <View style={indicatorStyle}>
                <DefaultViewPageIndicator activePage={0} pageCount={items.length} scrollOffset={0}
                                          scrollValue={scrollValue.current}/>
            </View>
            }
        </View>
    );
}

SlideShow.defaultProps = {
    initialIndex: 0,
    duration: 3000,
    multiplier: 0,
    autoScroll: true,
    disableIndicator: false,
    loop: true,
    style: {
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height,
    },
    indicatorStyle: {
        alignItems: 'center',
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,
    }
}
export default SlideShow
