import * as React from "react";
import {Button, Dimensions, Text, View} from "react-native";
import InfiniteSnapView, {Props as DuplicateProps} from "./InfiniteSnapView";


type Props = {} & DuplicateProps<number, any, any>

interface State {
    entries: any[]
    activeSlide: number
    duration: number
}

const CONTAINER_WIDTH = Dimensions.get("screen").width
const ITEM_WIDTH = CONTAINER_WIDTH * .8
const SPACE = Math.floor((CONTAINER_WIDTH - ITEM_WIDTH) / 2)
const DIVIDER_WIDTH = 8

class Example extends React.Component<void, State> {
    constructor(props) {
        super(props);
        this.state = {
            entries: [1, 2, 3, 4, 5],
            activeSlide: 2,
            duration: 5000
        }
    }

    _renderItem(type: number, item) {
        return <View style={{
            height: 260,
            width: ITEM_WIDTH,
            backgroundColor: 'red',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 8
        }}>
            <Text style={{fontSize: 92, fontWeight: 'bold'}}>{item}</Text>
        </View>
    }
    onPress = () => {
        this.setState({entries: [1, 2, 3, 4, 5], activeSlide: 2})
        // this.setState({duration: 1000})
    }

    render() {
        console.log('DURATION', this.state.duration)
        return (
            <View style={{marginTop: 140, backgroundColor: 'blue'}}>
                <InfiniteSnapView
                    multiplier={2}
                    initialRenderIndex={this.state.activeSlide}
                    autoscroll={true}
                    loop={true}
                    duration={this.state.duration}
                    enableSnap={true}
                    layout={'default'}
                    sliderWidth={CONTAINER_WIDTH}
                    itemWidth={ITEM_WIDTH}
                    items={this.state.entries}
                    rowRender={this._renderItem}
                    // hasParallaxImages={true}
                    vertical={false}/>
                {/*<Button title={'Clicke me'} onPress={this.onPress}/>*/}
            </View>
        );
    }
}

export default Example;
