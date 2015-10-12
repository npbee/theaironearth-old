import range from 'lodash/utility/range';
import once from 'lodash/function/once';
import { amplitude, POINTS } from './config';
import { changeBackground } from '../actions';

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


function initSun(paper) {
    let path = new paper.Path();
    let width = paper.view.size.width;
    let height = paper.view.size.height;
    let radius = 100;

    path.strokeColor = 'rgba(144, 92, 90, 0.5)';
    path.fillColor = 'rgba(144, 92, 90, 0)';
    path.strokeWidth = 1;
    path.smooth();

    path.position.x = width * 0.25;
    path.position.y = 100;

    return path;
}

const dimLights = once(function(store) {
    let state = store.getState();

    store.dispatch(changeBackground({
        hue: state.hue - 5
    }));
});


export default function generateMountains(paper, player, store, trackConfig) {

    let width = paper.view.size.width;
    let height = paper.view.size.height;
    let hitpoints = trackConfig.hitpoints || [];
    let hits = [];
    let currentHitpointIndex = 0;

    let mountains = [initMountain(paper)];
    let interval = width / POINTS;
    let currentMountainIndex = 0;
    let heightOffset = 0;

    let sun = initSun(paper);

    return function(data, event) {

        let currentHitpoint = hitpoints.length && hitpoints[currentHitpointIndex];

        if (currentHitpoint && player.audio.currentTime > currentHitpoint) {
            if (hits.indexOf(currentHitpoint) === -1) {
                hits.push(currentHitpoint);
                ++currentHitpoint;
            }
        }


        /**
         * Mountains!
         *
         */
        let mountain = mountains[currentMountainIndex];
        let lastMountain = mountains[currentMountainIndex - 1];
        let length = mountain.segments.length;

        if (lastMountain && lastMountain.animatingFill) {
            if (lastMountain.fillColor.alpha < maxAlpha) {
                lastMountain.fillColor.alpha += 0.01;
            } else {
                lastMountain.animatingFill = false;
            }
        }


        if (mountains.length >= 0 && mountains.length <= 4) {

            if (event.count !== 0 && event.count % POINTS === 0) {
                heightOffset += 20;
                mountains.push(initMountain(paper, !mountain.mirrored));

                ++currentMountainIndex;
            }

            if (length + 1 >= POINTS) {
                let x = mountain.mirrored ? 0 : width;
                let point = new paper.Point(x, height);
                mountain.add(point);
                mountain.animatingFill = true;
            } else {
                let i = length + 1;
                let x = mountain.mirrored ? width - i * interval : i * interval;
                let y = height - data[i] * (amplitude / 20) - heightOffset;
                let point = new paper.Point(x, y);
                mountain.add(point);
            }

        }

        if (hits.length >= 1) {

            dimLights(store);

            let xPos = width * 0.25;
            let yPos = 200;
            let segs = sun.segments.length;
            let i = segs + 1;
            let radius = 75;

            if (segs <= POINTS) {
                let x = radius * Math.cos(radius * i) + xPos;
                let y = radius * Math.sin(radius * i) + yPos;
                let point = new paper.Point(x, y);

                sun.add(point);

                if (segs > 30 && sun.fillColor.alpha < 0.5) {
                    sun.fillColor.red += 1;
                    sun.fillColor.alpha += 0.01;
                }
            } else if (sun.position.y < height - 200) {
                sun.position.y += 0.1;
            }

        }

    };

}
