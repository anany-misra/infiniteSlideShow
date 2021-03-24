import * as React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import Example from "./src/classcomponent/Example";

// import SlideShow from "./dist/index";

class App extends React.Component{

    constructor(props){
        super(props)
        this.state = {items: [1,2,3,4,5,6]}
    }
    rowRenderer = (type: number, data: any) => {
        return (
            <View style={styles.item}>
                <Text style={{fontSize: 92, fontWeight: "bold"}}>
                    {data}
                </Text>
            </View>
        );
    };

    onPress = () => {
        this.setState({items: [1, 2,3,4]})
    }

    render(): React.ReactNode {
        // alert('yes i am here!')
        return (
            <ScrollView>
                <Example />
            </ScrollView>


        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    item: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#e2e200',
        alignItems: 'center',
    },
});

export default App
