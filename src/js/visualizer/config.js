import generateSphere from './sphere';

export const POINTS = 256;
export const INIT_POINTS = 50;
export const amplitude = 5;
export const ANGLE = 10;
export const RADIUS = 100;
export const COLOR_AMP = 0.4;

export default {
    "0": {
        visualizer: generateSphere,
        hue: 195,
        saturation: 30,
        lightness: 72
    },
    "1": {
        visualizer: generateSphere,
        hue: 30,
        saturation: 48,
        lightness: 72
    }
}
