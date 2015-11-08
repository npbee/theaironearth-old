import once from 'lodash/function/once';

export const POINTS = 256;
export const INIT_POINTS = 50;
export const amplitude = 0.5;
export const ANGLE = 10;
export const RADIUS = 200;
export const COLOR_AMP = 0.4;
export const MAX_ALPHA = 0.1;

export const FRAME_THROTTLE = 5;

export default {

    // Exit
    "0": {
        hue: 32,
        saturation: 50,
        lightness: 81,
        strokeColor: 'rgba(144, 92, 90, 0.5)',
        fillColor: 'rgba(144, 92, 90, 0.5)'
    },

    // Ghost
    "1": {
        hue: 30,
        saturation: 84,
        lightness: 84,
        hitpoints: [89, 150],
        strokeColor: 'rgba(155, 199, 243, 0.5)',
        fillColor: 'rgba(155, 199, 243, 0.5)'
    },

    // Second Skin
    "2": {
        hue: 213,
        saturation: 50,
        lightness: 29,
        strokeColor: 'rgba(112, 112, 112, 0.5)',
        fillColor: 'rgba(112, 112, 112, 0.5)'
    },

    // Reflection
    "3": {
        hue: 227,
        saturation: 50,
        lightness: 9,
        strokeColor: 'rgba(144, 92, 90, 0.5)',
        fillColor: 'rgba(250, 250, 250, 0.5)'
    },

    //Farewell
    "4": {
        hue: 230,
        saturation: 50,
        lightness: 2,
        strokeColor: 'rgba(250, 250, 250, 0.5)',
        fillColor: 'rgba(19, 14, 45, 0.4)'
    },

    // Stillness
    "5": {
        hue: 7,
        saturation: 50,
        lightness: 14,
        strokeColor: 'rgba(18, 45, 48, 0.5)',
        fillColor: 'rgba(18, 45, 48, 0.5)',
    },

    // Young Guns
    "6": {
        hue: 2,
        saturation: 23,
        lightness: 46,
        strokeColor: 'rgba(86, 128, 129, 0.5)',
        fillColor: 'rgba(86, 128, 129, 0.5)'
    },

    // Innocent
    "7": {
        hue: 26,
        saturation: 49,
        lightness: 67,
        strokeColor: 'rgba(119, 167, 204, 0.5)',
        fillColor: 'rgba(119, 167, 204, 0.5)',
    },

    // Wake
    "8": {
        hue: 175,
        saturation: 17,
        lightness: 78,
        strokeColor: 'rgba(10, 10, 10, 0.5)',
        fillColor: 'rgba(198, 177, 179, 0.5)'
    }
}
