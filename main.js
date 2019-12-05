var canvas;
var gl;
var planeProgram, floorProgram;
var canvasX, canvasY;

var turnFactor = 0;
var rollFactor = 0;
var diveFactor = 0;
var speed = 0;

var distance = 0;

var texture;

var filled = true;

//CONSTS

const ORTHO = ortho(-2, 2, -2, 2, -10, 10); 

const TURN_SCALE = 2;

const ROLL_SCALE = 2;

const DIVE_SCALE = 2;

const SPEED_SCALE = 2;

//VARS

var aspectX, aspectY;

var planeProjectionLoc, planeModelViewLoc, planeColorLoc;

var floorProjectionLoc, floorModelViewLoc, floorColorLoc;

var matrixStack = [];

var modelView, mProjection, projectionDefault;

var eye, at, up;

var currentView = 1;

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

    projectionDefault = mult(scalem(aspectX, aspectY, 1), ORTHO);
    
    mProjection = projectionDefault;
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

    gl.clearColor(0.5, 0.5, 0.5, 1.0);

    gl.enable(gl.DEPTH_TEST);

    planeProgram = initShaders(gl, 'plane-vertex', 'plane-fragment');
    
    floorProgram = initShaders(gl, 'floor-vertex', 'floor-fragment');

    gl.useProgram(planeProgram);

    planeModelViewLoc = gl.getUniformLocation(planeProgram, "mModelView");
    planeProjectionLoc = gl.getUniformLocation(planeProgram, "mProjection");
    planeColorLoc = gl.getUniformLocation(planeProgram, "mColor");

    gl.useProgram(floorProgram);
    floorModelViewLoc = gl.getUniformLocation(floorProgram, "mModelView");
    floorProjectionLoc = gl.getUniformLocation(floorProgram, "mProjection");
    floorColorLoc = gl.getUniformLocation(floorProgram, "mColor");

    modelView = lookAt([0, 0, 1], [0,0,0], [0,1,0]);

    setupInput();
    
    setupTexture();

    floorInit(gl);


    planeInit(gl);

    this.chaseView();
    
    render();
}

function setupTexture(){
    gl.useProgram(floorProgram);
    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
        new Uint8Array([0, 0, 255, 255]));
    
    var image = new Image();
    image.src = "./road.png";

    
    image.onload = function(){
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER,gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
        gl.bindTexture(gl.TEXTURE_2D, null);
    };
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
                console.log("beans");
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

    //u = vetor at - eye
    //ux = u(x); uy = u(y); uz = u(z)
    //v = up
    //vx = v(x); vy = v(y); vz = v(z)
    //u.v = 0 <=> ux*vx + uy*vy + uz*vz = 0
    //Considerando ux = uy*vy = -uz*vz <=> vy = (-uz*vz) / uy;

    modelView = lookAt([0, -2, 3], [0, 0, 0], [0, 1, 0]);
    mProjection = mult(projectionDefault, perspective(60,aspectX/aspectY, -10 ,20));
}

function topView(){
    currentView = 1;
    modelView = lookAt([0, 0, 1], [0, 0, 0], [0, 1, 0]);
    mProjection = projectionDefault;
}

function sideView(){
    currentView = 2;
    modelView = lookAt([1, 0, 0], [0, 0, 0], [0, 0, 1]);
    mProjection = projectionDefault;
}

function frontView(){
    currentView = 3;
    modelView = lookAt([0, 1, 0], [0, 0, 0], [0, 0, 1]);
    mProjection = projectionDefault;
}

function recalculateEye(){
    
}

function recalculateAt(){

}

function recalculateUp(){

}

//-------------Controls-----------------------------
function turnLeft(){
    turnFactor += TURN_SCALE; 
}

function turnRight(){
    turnFactor -= TURN_SCALE;
}

function rollLeft(){
    rollFactor -= ROLL_SCALE;
}

function rollRight(){
    rollFactor += ROLL_SCALE;
}

function dive(){
    diveFactor -= DIVE_SCALE;
}

function soar(){
    diveFactor += DIVE_SCALE;
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
    distance = (distance + speed * 0.01) % 7;

    requestAnimationFrame(render);
    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    floorDraw(gl, floorProgram);

    planeDraw(gl, planeProgram, filled);
}