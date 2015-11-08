import range from 'lodash/utility/range';
import once from 'lodash/function/once';
import { amplitude, POINTS, MAX_ALPHA } from './config';
import { changeBackground } from '../actions';
import randomBetween from '../utils/randomBetween';


function initMountain(paper, mirrored = false) {
    let path = new paper.Path();
    let width = paper.view.size.width;
    let height = paper.view.size.height;
    let widthOffset = 50;
    let red = 36;

    red += 20;

    path.closed = false;
    path.position.x = 0;
    path.position.y = paper.view.size.height;
    path.strokeColor = `rgba(${red}, 70, 111, 0.3)`;
    path.fillColor = `rgba(${red}, 70, 111, 0)`;
    path.mirrored = mirrored;

    path.add(
        new paper.Point(mirrored ? width + widthOffset : -widthOffset, height)
    );

    path.position.y = paper.view.size.height;

    path.smooth();

    return path;
}


function initPath(paper, config) {
    let path = new paper.Path();
    let width = paper.view.size.width;
    let height = paper.view.size.height;
    let radius = 100;

    //path.strokeColor = config.strokeColor || '#444';
    //path.fillColor = config.fillColor || '#444';
    path.strokeWidth = 1;
    path.smooth();

    let interval = width / POINTS;

    range(POINTS).map((pnt, i) => {
        if (i === 0) {
            path.add(new paper.Point(-100, 0));
        } else if (i === POINTS - 1) {
            path.add(new paper.Point(width + 200, 0));
        } else {
            path.add(new paper.Point(pnt * interval, 0));
        }
    });

    path.position.y = height;

    return path;
}

function dimPath(path) {
    return path.fillColor.alpha -= 0.01;
}

function shouldDim(path) {
    return path.fillColor && path.fillColor.alpha && path.fillColor.alpha > MAX_ALPHA;
}

let heightChange = 1;
let paths = [];
let currentPathIndex = -1;
let path;

export default function generate(paper, player, store, trackConfig) {

    let width = paper.view.size.width;
    let height = paper.view.size.height;

    heightChange += 0.01;

    paper.project.clear();

    let barHeight;
    path = initPath(paper);
    path.strokeColor = trackConfig.strokeColor || '#444';
    path.fillColor = trackConfig.fillColor || '#444';

    return function(data, event) {


        for (let i = 0; i < POINTS; i++) {
            if (i !== 0 && i !== POINTS - 1) {
                let segment = path.segments[i];
                barHeight = data[i] * amplitude * heightChange;
                segment.point.y = height - barHeight;
            }
        }

    };

}
