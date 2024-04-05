const vs = `
attribute vec2 position;
attribute vec3 color;
varying vec3 vertex_color;

void main() {
    gl_Position = vec4(position, 0.0, 1.0);
    vertex_color = color;
}`

const fs = `
precision mediump float;
varying vec3 vertex_color;

void main(){
    gl_FragColor = vec4(vertex_color, 1);
}
`
