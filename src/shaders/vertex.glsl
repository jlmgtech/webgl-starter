#version 300 es
precision mediump float;

// this is a basic vertex shader that just receives a color as a uniform and draws the
// triangle with that color

uniform vec2 u_offset;
in vec4 v_position;

void main() {
    gl_Position = vec4(v_position.xy + u_offset, v_position.zw);
}
