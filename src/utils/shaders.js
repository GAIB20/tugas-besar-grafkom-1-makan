const vs = `
attribute vec4 position;

void main() {
    gl_Position = position;
}`

const fs = `
precision mediump float;
uniform vec3 fColor;
void main(){
    gl_FragColor = vec4(fColor, 1);
}
`
