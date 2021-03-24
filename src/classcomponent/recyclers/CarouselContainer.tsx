import ContainerView, {ContainerViewProps} from "../ContainerView";
import Carousel from "react-native-snap-carousel";
import * as React from "react";

class CarouselContainer extends ContainerView<number, ContainerViewProps<number>>{
    private recyclerListRef: React.RefObject<Carousel<any>>;
    constructor(props: ContainerViewProps<number>) {
        super(props);
        this.recyclerListRef = React.createRef();
        this.renderItem = this.renderItem.bind(this)
        this.moveToNext = this.moveToNext.bind(this)
        this.onPageChange = this.onPageChange.bind(this)
        this.scrollToIndex = this.scrollToIndex.bind(this)
    }

    moveToNext(animtion: boolean) {
        const {currentIndex} = this.state
        if (currentIndex == this.props.items.length-1) return;
        this.scrollToIndex(currentIndex+1, animtion, 'MOVE NEXT')
    }

    onPageChange(index: number) {
        const {onPageSelected} = this.props
        this.setState({currentIndex: index});
        onPageSelected && onPageSelected(index)
    }

    renderItem(item: { item: number; index: number }): any {
            const {rowRender} = this.props;
            return rowRender(-1, item.item, item.index)
    }

    scrollToIndex(position: number, animation: boolean, caller: string | undefined) {
        console.log('POSITION', position)
        this.recyclerListRef && this.recyclerListRef.current && this.recyclerListRef.current.snapToItem(position, animation)
    }

    render() {
        console.log('FIRST ITEM', this.state.currentIndex)
        return <Carousel
            ref={this.recyclerListRef}
            {...this.props}
            layout={'default'}
            data={this.state.items}
            renderItem={this.renderItem}
            onSnapToItem={this.onPageChange}
            firstItem={this.state.currentInitialRenderIndex}
            vertical={false}
        />
    }
}

export default CarouselContainer
