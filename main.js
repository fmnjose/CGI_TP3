var canvas;
var gl;
var program;
var canvasX, canvasY;

var ORTHO = ortho(-2, 2, -2, 2, -10, 10);

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

    program = initShaders(gl, 'default-vertex', 'default-fragment');

    gl.useProgram(program);

    mModelViewLoc = gl.getUniformLocation(program, "mModelView");
    mProjectionLoc = gl.getUniformLocation(program, "mProjection");
    mColorLoc = gl.getUniformLocation(program, "mColor");

    modelView = lookAt([0, 0, 1], [0,0,0], [0,1,0]);

    setupInput();

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
                break;
            case 'e':
                break;
            case 'a':
                break;
            case 'd':
                break;
            case 'w':
                break;
            case 's':
                break;
            case 'r':
                break;
            case 'f':
                break;
        }
    }
}

//--------------------INPUT ACTIONS-----------------

//------PROJECTIONS

function topView(){
    modelView = lookAt([0, 0, 1], [0, 0, 0], [0, 1, 0]);
}

function sideView(){
    modelView = lookAt([1, 0, 0], [0, 0, 0], [0, 0, 1]);
}

function frontView(){
    modelView = lookAt([0, 1, 0], [0, 0, 0], [0, 0, 1]);
}


//--------------------RENDER------------------------

function render() 
{
    requestAnimationFrame(render);
    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniformMatrix4fv(mProjectionLoc, false, flatten(mProjection));

    planeDrawBody(gl, program);
}