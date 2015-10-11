import range from 'lodash/utility/range';
import { amplitude, POINTS } from './config';

let heightOffset = 0;
let widthOffset = 50;
let maxAlpha = 0.3;
let red = 36;
let sunRed = 144;

function initPath(paper, mirrored = false) {
    let path = new paper.Path();
    let width = paper.view.size.width;
    let height = paper.view.size.height;

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

function initSun(paper) {
    let path = new paper.Path();
    let width = paper.view.size.width;
    let height = paper.view.size.height;
    let radius = 100;

    path.strokeColor = 'rgba(144, 92, 90, 0.5)';
    path.fillColor = 'rgba(144, 92, 90, 0)';
    path.strokeWidth = 1;

    path.position.x = width * 0.25;
    path.position.y = 100;

    //let xPos = width * .25;
    //let yPos = height / 2;

    //range(POINTS).map(i => {
        //let x = radius * Math.cos(radius * i) + xPos;
        //let y = radius * Math.sin(radius * i) + yPos;
        //let point = new paper.Point(x, y);

        //path.add(point);
    //});

    return path;

}


export default function generateMountains(paper) {

    let width = paper.view.size.width;
    let height = paper.view.size.height;
    let paths = [initPath(paper)];
    let interval = width / POINTS;
    let sun = initSun(paper);

    let currentPathIndex = 0;

    return function(data, event, hits) {
        let path = paths[currentPathIndex];
        let lastPath = paths[currentPathIndex - 1];
        let length = path.segments.length;

        if (lastPath && lastPath.animatingFill) {
            if (lastPath.fillColor.alpha < maxAlpha) {
                lastPath.fillColor.alpha += 0.01;
            } else {
                lastPath.animatingFill = false;
            }
        }


        mountains: if (hits.length >= 0) {

            if (paths.length > 4) { break mountains; }

            if (event.count !== 0 && event.count % POINTS === 0) {
                heightOffset += 20;
                paths.push(initPath(paper, !path.mirrored));

                ++currentPathIndex;
            }

            if (length + 1 >= POINTS) {
                let x = path.mirrored ? 0 : width;
                let point = new paper.Point(x, height);
                path.add(point);
                path.animatingFill = true;
            } else {
                let i = length + 1;
                let x = path.mirrored ? width - i * interval : i * interval;
                let y = height - data[i] * (amplitude / 20) - heightOffset;
                let point = new paper.Point(x, y);
                path.add(point);
            }

        }

        if (hits.length >= 1) {
            let xPos = width * 0.25;
            let yPos = 200;
            let segs = sun.segments.length;
            let i = segs + 1;
            let radius = 75;

            if (i >= POINTS) {
                //let x = radius * Math.cos(radius * i) + xPos;
                //let y = radius * Math.sin(radius * i) + yPos;
                //let point = new paper.Point(x, y);

                //path.add(point);

                return;
            }

            let x = radius * Math.cos(radius * i) + xPos;
            let y = radius * Math.sin(radius * i) + yPos;
            let point = new paper.Point(x, y);

            if (segs > 30 && sun.fillColor.alpha < 0.5) {
                sun.fillColor.red += 1;
                sun.fillColor.alpha += 0.01;
            }

            sun.add(point);
        }

    };

}
