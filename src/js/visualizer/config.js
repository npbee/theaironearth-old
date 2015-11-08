import once from 'lodash/function/once';
import generateMountains from './mountains';

export const POINTS = 256;
export const INIT_POINTS = 50;
export const amplitude = 5;
export const ANGLE = 10;
export const RADIUS = 200;
export const COLOR_AMP = 0.4;

export default {

    // Exit
    "0": {
        hue: 32,
        saturation: 50,
        lightness: 81,
        strokeColor: 'rgba(144, 92, 90, 0.5)'
    },

    // Ghost
    "1": {
        hue: 30,
        saturation: 84,
        lightness: 84,
        hitpoints: [89, 150]
    },

    // Second Skin
    "2": {
        hue: 213,
        saturation: 50,
        lightness: 29
    },

    // Reflection
    "3": {
        hue: 227,
        saturation: 50,
        lightness: 9
    },

    //Farewell
    "4": {
        hue: 230,
        saturation: 50,
        lightness: 2
    },

    // Stillness
    "5": {
        hue: 7,
        saturation: 50,
        lightness: 14
    },

    // Young Guns
    "6": {
        hue: 2,
        saturation: 23,
        lightness: 46
    },

    // Innocent
    "7": {
        hue: 26,
        saturation: 49,
        lightness: 67
    },

    // Wake
    "8": {
        hue: 175,
        saturation: 17,
        lightness: 78
    }
}
