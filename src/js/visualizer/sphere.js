import { amplitude, RADIUS } from './config';

export default function generateSphere(data, path) {

    return path.segments.map((segment, i) => {

        path.strokeColor = 'rgba(256, 256, 256, 1)';
        path.strokeWidth = 1;

        let xPos = paper.view.size.width / 2;
        let yPos = paper.view.size.height / 2;
        let magnitude = data[i] * (0.2 * (amplitude / 20));
        let x = RADIUS * Math.cos(RADIUS * magnitude) + xPos;
        let y = RADIUS * Math.sin(RADIUS * magnitude) + yPos;

        segment.point.x = x;
        segment.point.y = y;

        return segment;
    });

}
