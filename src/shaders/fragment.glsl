#version 300 es
precision mediump float;

// this is a basic fragment shader that receives a single one color (vec4) and
// outputs that color.

uniform vec4 u_color;
out vec4 fragColor;

void main()
{
    fragColor = u_color;
}
