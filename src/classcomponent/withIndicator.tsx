import React from 'react'
import {Animated, StyleSheet, View} from "react-native";
import DefaultViewPageIndicator from "./Indicator";
import {getBoundedScroll} from "./Utils";
import LoopView from "./LoopView";
import ContainerView from "./ContainerView";

interface Props {
    index: number,
    itemWidth: number,
    originalSize: number
    onScroll: ({nativeEvent: {contentOffset: {x}}}: { nativeEvent: { contentOffset: { x: number } } }) => void
}

interface State {
    indicatorScrollValue: Animated.Value
}

const styles = StyleSheet.create({
    indicatorStyle: {
        alignItems: 'center',
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,
    }
})


function withIndicator<P, ITEM, CONTAINER_PROPS, CONTAINER_TYPE extends ContainerView<ITEM, CONTAINER_PROPS>>(WrappedComponent: LoopView<ITEM, CONTAINER_PROPS, CONTAINER_TYPE>) {
    class WrapperClass<P, ITEM, CONTAINER_PROPS, CONTAINER_TYPE> extends React.Component<P & Props, State> {
        state: { indicatorScrollValue: Animated.Value; };
        constructor(props: P & Props) {
            super(props);
            indicatorScrollValue: new Animated.Value(0),
                this.state = {
                    indicatorScrollValue: new Animated.Value(0),
                }
        }

        onScroll = ({nativeEvent: {contentOffset: {x}}}: { nativeEvent: { contentOffset: { x: number } } }) => {
            console.log('SCROLL VALUE', x)
            const {itemWidth, originalSize, index} = this.props
            this.state.indicatorScrollValue &&
            this.state.indicatorScrollValue.setValue(getBoundedScroll(x/itemWidth, index, originalSize))
        }

        render() {
            const { index, originalSize, ...rest} = this.props
            return <View>
                <WrappedComponent<ITEM, CONTAINER_PROPS, CONTAINER_TYPE> {...rest} onScroll={this.onScroll}/>
                <View style={styles.indicatorStyle}>
                    <DefaultViewPageIndicator
                        activePage={0}
                        pageCount={originalSize}
                        scrollOffset={0}
                        scrollValue={this.state.indicatorScrollValue}
                    />
                </View>
            </View>
        }
    }
    return WrapperClass;
}

export default withIndicator
