"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
function usePlayState(autoScroll) {
    const [isPlaying, setIsPlaying] = (0, react_1.useState)(autoScroll);
    const setIsPlayingWrapper = (isplaying) => {
        autoScroll && setIsPlaying(isplaying);
    };
    return [isPlaying, setIsPlayingWrapper];
}
exports.default = usePlayState;
//# sourceMappingURL=usePlayState.js.map