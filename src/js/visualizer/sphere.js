import { amplitude } from './config';

export default function generateSphere(data, path, radius) {

    return path.segments.map((segment, i) => {
        let xPos = paper.view.size.width / 2;
        let yPos = paper.view.size.height / 2;
        let magnitude = data[i] * (0.2 * (amplitude / 20));
        let x = radius * Math.cos(radius * magnitude) + xPos;
        let y = radius * Math.sin(radius * magnitude) + yPos;

        segment.point.x = x;
        segment.point.y = y;


        return segment;
    });

}
