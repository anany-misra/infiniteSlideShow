import DuplicationItemsRecyclerView, {Props as DuplicateRecyclerProps} from "./DuplicationItemsRecyclerView";
import * as React from "react";
import {Button, View} from "react-native";

type Props = {} & DuplicateRecyclerProps

interface State {
    items: any[]
    initialIndex: number
}

class SlideShow1 extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {items: [1, 2, 3, 4], initialIndex: 2};
    }

    updateIndex = () => {
        this.setState({initialIndex: 5})
    }

    updateItems = () => {
        this.setState({items: [1,2], initialIndex: 1})
    }

    render() {
        return (
            <View>
                <DuplicationItemsRecyclerView autoscroll={false} items={this.state.items} multiplier={2} loop={true} initialRenderIndex={this.state.initialIndex}/>
                {/*<View style={{marginTop: 80}}>*/}
                {/*    <Button title={'UPDATE INITIAL INDEX'} onPress={this.updateIndex}/>*/}
                {/*    <Button title={'UPDATE ITEMS'} onPress={this.updateItems}/>*/}
                {/*</View>*/}
            </View>

        );
    }
}

export default SlideShow1;
