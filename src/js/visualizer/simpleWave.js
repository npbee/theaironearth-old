import memoize from 'lodash/function/memoize';
import { amplitude } from './config';

const getInterval = memoize(function getInterval(width, count) {
    return Math.ceil(width / count);
});

const getStartX = memoize(function getStartX(width, count, interval) {
    let halfW = width / 2;
    let halfCount = count / 2;

    return halfW - (halfCount * interval)
});

export default function generateSimpleWave(data, path, paper, event) {
    let width = paper.view.size.width;
    let height = paper.view.size.height;
    let interval = getInterval(width, path.segments.length);
    let startX = getStartX(width, path.segments.length, interval);
    path.smooth();

    return path.segments.map((segment, i) => {

        segment.point.x = (i * interval);
        segment.point.y = (height * .75) + data[i] * (amplitude / 10);

        return segment;
    });
}
