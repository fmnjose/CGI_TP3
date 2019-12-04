var canvas;
var gl;
var planeProgram, floorProgram;
var canvasX, canvasY;

var turnFactor = 0;
var rollFactor = 0;
var diveFactor = 0;
var speed = 0;

var filled = true;

//CONSTS

const ORTHO = ortho(-2, 2, -2, 2, -10, 10);

const TURN_SCALE = 2;

const ROLL_SCALE = 2;

const DIVE_SCALE = 2;

const SPEED_SCALE = 2;

//VARS

var aspectX, aspectY;

var mProjectionLoc, mModelViewLoc, mColorLoc;

var matrixStack = [];
var modelView, mProjection;

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
    aspectX = canvasX / window.innerWidth;
    canvas.width = window.innerWidth;
    aspectY = canvasY / window.innerHeight;
    canvas.height = window.innerHeight;

    mProjection = mult(scalem(aspectX, aspectY, 1), ORTHO);
    
    gl.viewport(0, 0,canvas.width, canvas.height);

}

window.onresize = function () {
    fit_canvas_to_window();
}

window.onload = function() {
    canvas = document.getElementById('gl-canvas');

    canvasX = canvas.width;
    canvasY = canvas.height;    

    gl = WebGLUtils.setupWebGL(document.getElementById('gl-canvas'));

    fit_canvas_to_window();

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    planeProgram = initShaders(gl, 'plane-vertex', 'plane-fragment');
    
    floorProgram = initShaders(gl, 'floor-vertex', 'floor-fragment');

    gl.useProgram(planeProgram);

    mModelViewLoc = gl.getUniformLocation(planeProgram, "mModelView");
    mProjectionLoc = gl.getUniformLocation(planeProgram, "mProjection");
    mColorLoc = gl.getUniformLocation(planeProgram, "mColor");

    modelView = lookAt([0, 0, 1], [0,0,0], [0,1,0]);

    setupInput();

    floorInit(gl);

    planeInit(gl);

    render();
}

function setupInput(){
    window.onkeydown = function(event){
        switch(event.key){
            case '0':
                chaseView();
                break;
            case '1':
                topView();
                break;
            case '2':
                sideView();
                break;
            case '3':
                frontView();
                break;
            case 'q':
                turnLeft();
                break;
            case 'e':
                turnRight();
                break;
            case 'a':
                rollLeft();
                break;
            case 'd':
                rollRight();
                break;
            case 'w':
                dive();
                break;
            case 's':
                soar();
                break;
            case 'r':
                accelerate();
                break;
            case 'f':
                brake();
                break;
            case 'o':
                toggleFilled();
                break;
        }
    }
}

//--------------------INPUT ACTIONS-----------------

//------PROJECTIONS

function chaseView(){
    modelView = lookAt([0, -1, 0], [0, 0, 0], [0, 0, 1]);
    //modelView = perspective(120, 2,-10, 10);
}

function topView(){
    modelView = lookAt([0, 0, 1], [0, 0, 0], [0, 1, 0]);
}

function sideView(){
    modelView = lookAt([1, 0, 0], [0, 0, 0], [0, 0, 1]);
}

function frontView(){
    modelView = lookAt([0, 1, 0], [0, 0, 0], [0, 0, 1]);
}

//-------------Controls-----------------------------
function turnLeft(){
    turnFactor += TURN_SCALE;
    //multMatrix(rotateZ(TURN_SCALE));
}

function turnRight(){
    turnFactor -= TURN_SCALE;
    //multMatrix(rotateZ(-TURN_SCALE));
}

function rollLeft(){
    rollFactor -= ROLL_SCALE;
    //multMatrix(rotateY(-ROLL_SCALE));
}

function rollRight(){
    rollFactor += ROLL_SCALE;
    //multMatrix(rotateY(ROLL_SCALE));
}

function dive(){
    diveFactor -= DIVE_SCALE;
    //multMatrix(rotateX(-DIVE_SCALE))
}

function soar(){
    diveFactor += DIVE_SCALE;
    //multMatrix(rotateX(DIVE_SCALE));
}

function accelerate(){
    speed += SPEED_SCALE;
}

function brake(){
    speed = speed > 0 ? speed - 1 : 0;
}

function toggleFilled(){
    filled = !filled;
}
    

//--------------------RENDER------------------------

function render() 
{
    requestAnimationFrame(render);
    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniformMatrix4fv(mProjectionLoc, false, flatten(mProjection));

    floorDraw(gl, floorProgram);

    planeDraw(gl, planeProgram, speed, filled);
}