const vs = `
attribute vec2 position;

uniform float rotationAngle;
uniform float scaleFactor;
uniform vec2 shearFactor;
uniform float transformX;
uniform float transformY;
uniform vec2 translation;
uniform vec2 midpointLoc;

void main() {
    float theta = radians(rotationAngle);

    mat2 rotationMatrix = mat2(
        cos(theta), -sin(theta),
        sin(theta), cos(theta)
    );

    mat2 scalingMatrix = mat2(
        scaleFactor, 0,
        0, scaleFactor
    );

    mat2 shearMatrix = mat2(
        1, shearFactor.y,
        shearFactor.x, 1
    );

    mat2 xTransform = mat2(
        transformX, 0,
        0, 1
    );

    mat2 yTransform = mat2(
        1, 0,
        0, transformY
    );

    vec2 relativePosition = position - midpointLoc;
    vec2 transformedLocation = rotationMatrix * scalingMatrix * xTransform * yTransform * shearMatrix * relativePosition;
    vec2 finalPosition = transformedLocation + midpointLoc + translation;

    gl_Position = vec4(finalPosition, 0, 1);
}`

const fs = `
precision mediump float;
void main(){
    gl_FragColor = vec4(0.0, 0.1, 1.0, 1);
}
`
