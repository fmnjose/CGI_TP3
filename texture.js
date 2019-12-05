const NUM_ZERO = 48;
const NUM_ONE = 49;
const NUM_TWO = 50;
const NUM_THREE = 51;
const KEY_Q = 81;
const KEY_E = 69;
const KEY_W = 87;
const KEY_S = 83;
const KEY_A = 65;
const KEY_D = 68;
const KEY_R = 82;
const KEY_F = 70;
const KEY_O = 79;

var canvas;
var gl;
var program;

var aspect;

var mProjectionLoc, mModelViewLoc, mColorLoc;

var matrixStack = [];
var modelView;
var time = 0;
var timeScale = 5;
var zoomFactor = 1;
var proportion = 60;

var filled = false;
var texture;

var position = 0;
var velocity = 0;
var angle = 0;

// Stack related operations
function pushMatrix() {
    var m =  mat4(modelView[0], modelView[1],
           modelView[2], modelView[3]);
    matrixStack.push(m);
}
function popMatrix() {
    modelView = matrixStack.pop();
}
// Append transformations to modelView
function multMatrix(m) {
    modelView = mult(modelView, m);
}
function multTranslation(t) {
    modelView = mult(modelView, translate(t));
}
function multScale(s) {
    modelView = mult(modelView, scalem(s));
}
function multRotationX(angle) {
    modelView = mult(modelView, rotateX(angle));
}
function multRotationY(angle) {
    modelView = mult(modelView, rotateY(angle));
}
function multRotationZ(angle) {
    modelView = mult(modelView, rotateZ(angle));
}

function fit_canvas_to_window()
{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    aspect = canvas.width / canvas.height;
    gl.viewport(0, 0,canvas.width, canvas.height);

}

window.onresize = function () {
    fit_canvas_to_window();
}

window.onload = function() {
    canvas = document.getElementById('gl-canvas');

    gl = WebGLUtils.setupWebGL(document.getElementById('gl-canvas'));
    fit_canvas_to_window();

    gl.clearColor(0.3, 0.3, 0.3, 1.0);

    gl.enable(gl.DEPTH_TEST);

    program = initShaders(gl, 'default-vertex', 'default-fragment');

    gl.useProgram(program);

    mModelViewLoc = gl.getUniformLocation(program, "mModelView");
    mProjectionLoc = gl.getUniformLocation(program, "mProjection");

    modelView = lookAt([0,1.5,2.8], [0,0.2,0], [0,1,0]); //perseguição

    cubeInit(gl);
    setupTexture();
    render();
}

function setupTexture() {
    // Create a texture.
    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // Fill the texture with a 1x1 blue pixel.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
        new Uint8Array([0, 0, 255, 255]));
        // Asynchronously load an image
    var image = new Image();
    image.src = "./road.png";
    
    image.onload = function() {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
        gl.bindTexture(gl.TEXTURE_2D, null);
    };
}

window.onkeydown = function(event){
    switch(event.keyCode){
        case NUM_ONE:
            modelView = lookAt([0,2,0], [0,0,0], [0,0,-1]); //planta, o up é relativo à camara.
            break;
        case NUM_TWO:
            modelView = lookAt([3,0,0], [0,0,0], [0,1,0]); //direita
            break;
        case NUM_THREE:
            modelView = lookAt([0,0,-3], [0,0,0], [0,1,0]); //frente
            break;
        case NUM_ZERO:
            modelView = lookAt([0,1.5,2.8], [0,0.2,0], [0,1,0]); //perseguição
            break;
        case KEY_Q:
            angle+=1;
            break;
        case KEY_E:
            angle-=1;
            break;
        case KEY_W:
            break;
        case KEY_S:
            break;
        case KEY_A:
            break;
        case KEY_D:;
            break;
        case KEY_R:
            break;
        case KEY_F:
            break;
        case KEY_O:
            filled = !filled;
            break;
    }
}

function cube(){
    gl.uniformMatrix4fv(mModelViewLoc, false, flatten(modelView));
    cubeDrawFilled(gl, program);
}

function render()
{
    requestAnimationFrame(render);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var projection = ortho(-10, 10, -10, 10,-10,10);

    gl.uniformMatrix4fv(mProjectionLoc, false, flatten(projection));

    gl.uniformMatrix4fv(mProjectionLoc, false, flatten(perspective(110,aspect, 0.1, 20)));

    gl.uniformMatrix4fv(mModelViewLoc, false, flatten(modelView));


    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);

    cube();
}
