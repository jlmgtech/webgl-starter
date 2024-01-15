import { mat4 } from "gl-matrix";
console.log(mat4);

window.addEventListener("load", main);

async function main() {
    const canvas = document.getElementById("canvas");
    const gl = canvas.getContext("webgl2");

    window.addEventListener("resize", () => resize(canvas, gl));
    resize(canvas, gl);

    const [vsrc, fsrc] = await Promise.all([
        fetch("/src/shaders/vertex.glsl").then(r => r.text()),
        fetch("/src/shaders/fragment.glsl").then(r => r.text()),
    ]);

    const program = createProgram(gl, vsrc, fsrc);

    // location for uniform vec4 u_color;
    const colorUniformLocation = gl.getUniformLocation(program, "u_color");
    const offsetUniformLocation = gl.getUniformLocation(program, "u_offset");

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const positionAttributeLocation = gl.getAttribLocation(program, "v_position");
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [
        0, 0,
        0, 0.5,
        0.7, 0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    // there's no color attribute, just remember that moving forward.

    gl.clearColor(0, 0, 0, 1);

    let running = true;
    let last = 0;
    function render(time) {
        const dt = time - last;
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(program);
        gl.bindVertexArray(vao);
        gl.uniform4f(colorUniformLocation, 0, 0.5, 1, 1);
        gl.uniform2f(offsetUniformLocation, Math.sin(dt / 1000), 0);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        if (running) {
            requestAnimationFrame(render);
        }
    }
    requestAnimationFrame(render);

}

function resize(canvas, gl) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
}

function createProgram(gl, vsrc, fsrc) {
    const program = gl.createProgram();
    const vshader = compileShader(gl, gl.VERTEX_SHADER, vsrc);
    const fshader = compileShader(gl, gl.FRAGMENT_SHADER, fsrc);

    gl.attachShader(program, vshader);
    gl.attachShader(program, fshader);
    gl.linkProgram(program);

    // error checking:
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success)
        console.error(gl.getProgramInfoLog(program));

    return program;
}

function compileShader(gl, type, src) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    // error checking:
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success)
        console.error(gl.getShaderInfoLog(shader));
    return shader;
}
