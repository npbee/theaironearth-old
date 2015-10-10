import generateSphere from './sphere';
import generateSimpleWave from './simpleWave';

export const POINTS = 256;
export const INIT_POINTS = 50;
export const amplitude = 5;
export const ANGLE = 10;
export const RADIUS = 100;
export const COLOR_AMP = 0.4;

export default {

    // Exit
    "0": {
        visualizer: generateSphere,
        hue: 32,
        saturation: 50,
        lightness: 81
    },

    // Ghost
    "1": {
        visualizer: generateSimpleWave,
        hue: 7,
        saturation: 50,
        lightness: 69,
        strokeColor: 'hsla(213, 50, 29, 0.8)'
    },

    // Second Skin
    "2": {
        visualizer: generateSphere,
        hue: 213,
        saturation: 50,
        lightness: 29
    },

    // Reflection
    "3": {
        visualizer: generateSphere,
        hue: 227,
        saturation: 50,
        lightness: 9
    },

    //Farewell
    "4": {
        visualizer: generateSphere,
        hue: 230,
        saturation: 50,
        lightness: 2
    },

    // Stillness
    "5": {
        visualizer: generateSphere,
        hue: 7,
        saturation: 50,
        lightness: 14
    },

    // Young Guns
    "6": {
        visualizer: generateSphere,
        hue: 2,
        saturation: 23,
        lightness: 46
    },

    // Innocent
    "7": {
        visualizer: generateSphere,
        hue: 26,
        saturation: 49,
        lightness: 67
    },

    // Wake
    "8": {
        visualizer: generateSphere,
        hue: 175,
        saturation: 17,
        lightness: 78
    }
}
