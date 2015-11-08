import range from 'lodash/utility/range';
import once from 'lodash/function/once';
import { amplitude, POINTS } from './config';
import { changeBackground } from '../actions';
import randomBetween from '../utils/randomBetween';

const maxAlpha = 0.3;

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


function initPath(paper) {
    let path = new paper.Path();
    let width = paper.view.size.width;
    let height = paper.view.size.height;
    let radius = 100;

    path.strokeColor = 'rgba(144, 92, 90, 0.5)';
    path.fillColor = 'rgba(144, 92, 90, 0.5)';
    path.strokeWidth = 1;
    path.smooth();

    let interval = width / POINTS;

    range(POINTS).map(pnt => {
        path.add(new paper.Point(pnt * interval, 600));
    });

    path.position.y = height;

    return path;
}

export default function generateMountains(paper, player, store, trackConfig) {

    let width = paper.view.size.width;
    let height = paper.view.size.height;
    let path = initPath(paper);
    let barHeight;

    return function(data, event) {

        path.segments = path.segments.map((seg, idx) => {
            if (idx !== 0 && idx !== path.segments.length - 1) {
                barHeight = data[idx] / 2;
                seg.point.y = height - barHeight;

                return seg;
            } else {
                return seg;
            }
        });
    };

}
