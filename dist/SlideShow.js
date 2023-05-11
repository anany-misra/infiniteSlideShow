"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const react_native_1 = require("react-native");
const recyclerlistview_1 = require("recyclerlistview");
const CustomBaseScrollView_1 = require("./CustomBaseScrollView");
const DefaultViewPageIndicator_1 = require("./DefaultViewPageIndicator");
const useDataState_1 = require("./hooks/useDataState");
const usePlayState_1 = require("./hooks/usePlayState");
const WINDOW_CORRECTION_INSET = 20;
let itemWidth;
const SlideShow = ({ initialIndex, duration, items, rowRenderer, multiplier, style, indicatorStyle, autoScroll, disableIndicator, recyclerViewProps, loop, dotStyle, activeDotStyle, renderDots, recyclerRef, onDragBegin }) => {
    const multiplierValidated = items.length === 1 ? 0 : multiplier;
    const recyclerList = (0, react_1.useRef)(null);
    const intialialScrollIndex = (multiplierValidated / 2) * items.length + initialIndex;
    const [currentIndexFake, setCurrentIndexFake] = (0, react_1.useState)(intialialScrollIndex);
    const [isPlaying, setIsPlaying] = (0, usePlayState_1.default)(autoScroll);
    const [_dataSource, _layoutProvider] = (0, useDataState_1.default)(items, multiplierValidated, style);
    const scrollValue = (0, react_1.useRef)(new react_native_1.Animated.Value(0));
    (0, react_1.useEffect)(() => {
        if (autoScroll && isPlaying && multiplierValidated > 0 && (loop || (currentIndexFake + 1) % items.length !== 0)) {
            const timerId = setTimeout(() => {
                const updatedFakeIndex = (currentIndexFake + 1) % (multiplierValidated * items.length + 1);
                scrollToIndex(updatedFakeIndex, true);
            }, duration);
            return () => clearTimeout(timerId);
        }
    }, [currentIndexFake, isPlaying, autoScroll, multiplierValidated]);
    (0, react_1.useEffect)(() => {
        setIsPlaying(autoScroll);
    }, [autoScroll]);
    // let scrollValue = new Animated.Value(0)
    const scrollToIndex = (index, animation) => {
        recyclerList && recyclerList.current && recyclerList.current.scrollToIndex(index, animation);
    };
    const onPageSelected = (position) => {
        if (position === 0 || position === multiplierValidated * items.length) {
            const centerIndex = (multiplierValidated / 2) * items.length;
            setTimeout(() => { scrollToIndex(centerIndex, false); }, 500);
        }
        else {
            // Its in case of else only because it will be called nextime if it is going into above if condition reason for that is scrollToIndex
            // currentIndexFake = item[0]
            setCurrentIndexFake(position);
            const { onVisibleIndicesChanged = undefined } = recyclerViewProps || {};
            onVisibleIndicesChanged && onVisibleIndicesChanged(position % items.length);
        }
    };
    const onVisibleIndicesChange = (item, p1, p2) => {
        if (item.length === 1)
            onPageSelected(item[0]);
    };
    const setScrollValue = (scroll) => {
        //Normalize value from fake index to actual index
        let value = Number(scroll.toFixed(4)) % items.length;
        if (value < 0)
            value = 0;
        //Don't animate if you are at actual index 0 in left size and last index in right side
        if (value > items.length - 1)
            value = currentIndexFake % items.length === 0 ? 0 : items.length - 1;
        scrollValue.current.setValue(value);
    };
    const onScroll = ({ nativeEvent: { contentOffset: { x } } }) => {
        setScrollValue(x / itemWidth);
    };
    const onItemLayout = ({ nativeEvent: { layout: { width } } }) => {
        itemWidth = width;
    };
    const onScrollAnimationEnd = () => {
        const { onScrollEndDrag } = recyclerViewProps || {};
        onScrollEndDrag && onScrollEndDrag();
        setIsPlaying(true);
    };
    const onScrollBeginDrag = () => {
        onDragBegin && onDragBegin();
        setIsPlaying(false);
    };
    const applyWindowCorrection = (offsetX, offsetY, windowCorrection) => {
        windowCorrection.startCorrection = WINDOW_CORRECTION_INSET;
        windowCorrection.endCorrection = -WINDOW_CORRECTION_INSET;
    };
    const recyclerViewRef = (0, react_1.useCallback)((el) => {
        recyclerList.current = el;
        if (recyclerRef) {
            recyclerRef.current = el;
        }
    }, []);
    //Only render RLV once you have the data
    return (React.createElement(react_native_1.View, { style: style },
        _layoutProvider && _dataSource && React.createElement(recyclerlistview_1.RecyclerListView, Object.assign({}, recyclerViewProps, { initialRenderIndex: intialialScrollIndex, onLayout: onItemLayout, onScroll: onScroll, ref: recyclerViewRef, isHorizontal: true, onScrollEndDrag: onScrollAnimationEnd, onScrollBeginDrag: onScrollBeginDrag, externalScrollView: CustomBaseScrollView_1.default, dataProvider: _dataSource, layoutProvider: _layoutProvider, rowRenderer: (type, data, index, extendedState) => rowRenderer(type, data, index % items.length, extendedState), onVisibleIndicesChanged: onVisibleIndicesChange, applyWindowCorrection: applyWindowCorrection })),
        !disableIndicator && (renderDots || React.createElement(react_native_1.View, { style: indicatorStyle },
            React.createElement(DefaultViewPageIndicator_1.default, { activePage: 0, pageCount: items.length, dotStyle: dotStyle, activeDotStyle: activeDotStyle, scrollOffset: 0, scrollValue: scrollValue.current })))));
};
SlideShow.defaultProps = {
    initialIndex: 0,
    duration: 3000,
    multiplier: 0,
    autoScroll: true,
    disableIndicator: false,
    loop: true,
    style: {
        width: react_native_1.Dimensions.get('screen').width,
        height: react_native_1.Dimensions.get('screen').height,
    },
    indicatorStyle: {
        alignItems: 'center',
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,
    }
};
exports.default = SlideShow;
//# sourceMappingURL=SlideShow.js.map