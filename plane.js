var BODY_LENGTH = 4;
var WING_WIDTH = 10;
var SCALE = 0.5;
var helicesMem = 0;
var drawFilled;

function planeInit(gl){
    cubeInit(gl);
    cylinderInit(gl);
    sphereInit(gl);
    coneInit(gl);
    pyramidInit(gl);
}

function planeDraw(gl, program, speed, filled){
    drawFilled = filled;

    pushMatrix();
    multMatrix(rotateX(diveFactor));
    multMatrix(rotateY(rollFactor));
    multMatrix(rotateZ(turnFactor));
    multMatrix(scalem(SCALE, SCALE, SCALE));
        //CILINDRO
        pushMatrix();
            multMatrix(scalem(1, BODY_LENGTH, 1));
            gl.uniformMatrix4fv(mModelViewLoc, false, flatten(modelView));
            gl.uniform3fv(mColorLoc, flatten([1.0, 1.0, 1.0]));
            cylinderDraw(gl, program, drawFilled);
        popMatrix();
        //CABECA

        drawHead(gl, program);

        drawTail(gl, program);

        //saves the helices' last rotation
        helicesMem = (helicesMem + speed) % 360;

        drawWings(gl, program, helicesMem);

        drawBack(gl, program);
    popMatrix();
}

function drawHead(gl, program){
    pushMatrix();
        multMatrix(translate(0, BODY_LENGTH / 2, 0));
        multMatrix(scalem(1, 2, 1));
        gl.uniformMatrix4fv(mModelViewLoc, false, flatten(modelView));
        gl.uniform3fv(mColorLoc, flatten([1.0, 0.0, 0.0]));
        sphereDraw(gl, program, drawFilled);
    popMatrix();
}

function drawTail(gl, program){
    pushMatrix();
        multMatrix(translate(0, -BODY_LENGTH / 2, 0));
        //CAUDA
        pushMatrix();
            multMatrix(scalem(1.0, 5.0, 1.0));
            gl.uniformMatrix4fv(mModelViewLoc, false, flatten(modelView));
            gl.uniform3fv(mColorLoc, flatten([1.0, 1.0, 1.0]));
            sphereDraw(gl, program, drawFilled);
        popMatrix();

        //FLAB HORIZONTAL CAUDA
        pushMatrix();
            multMatrix(translate(0, -BODY_LENGTH/2, 0));
            multMatrix(scalem(3.0, 0.5, 0.1));
            gl.uniformMatrix4fv(mModelViewLoc, false, flatten(modelView));
            gl.uniform3fv(mColorLoc, flatten([0.0, 0.0, 1.0]));
            sphereDraw(gl, program, drawFilled);
        popMatrix();
        //FLAB VERTICAL CAUDA
        pushMatrix();
            multMatrix(translate(0, -BODY_LENGTH/2, 0.5));
            multMatrix(rotateY(90));
            multMatrix(scalem(1.5, 0.5, 0.1));
            gl.uniformMatrix4fv(mModelViewLoc, false, flatten(modelView));
            sphereDraw(gl, program, drawFilled);
        popMatrix();
    popMatrix();
}

function drawWings(gl, program, speed){
    pushMatrix();
        multMatrix(translate(0, 0, 0));
        pushMatrix();
            multMatrix(scalem(WING_WIDTH, 2.0, 0.1))
            gl.uniform3fv(mColorLoc, flatten([1.0, 1.0, 0.0]));
            gl.uniformMatrix4fv(mModelViewLoc, false, flatten(modelView));
            pyramidDraw(gl, program, drawFilled);
        popMatrix();
        wingDetails(gl, true, program, speed);
        wingDetails(gl, false, program, -speed);
    popMatrix();
}

function wingDetails(gl, right, program, speed){
    var side = right ? 1 : -1;
    pushMatrix();
        multMatrix(translate(side * WING_WIDTH / 4, -0.25, -0.5));
        wingEngine(gl, program, speed);  
        engineRotators(gl, program, speed);        
    popMatrix();
}

function wingEngine(gl, program){
    //Suporte
    pushMatrix();
        multMatrix(translate(0, 0, 0.3));
        multMatrix(rotateX(90));
        multMatrix(scalem(0.3, 0.3, 0.5));
        gl.uniform3fv(mColorLoc, flatten([1.0, 1.0, 1.0]));
        gl.uniformMatrix4fv(mModelViewLoc, false, flatten(modelView));
        cylinderDraw(gl, program, drawFilled);
    popMatrix();
    //Propulsor
    pushMatrix();
        multMatrix(scalem(0.5, 1.3, 0.5));  
        gl.uniform3fv(mColorLoc, flatten([1.0, 0.0, 1.0]));
        gl.uniformMatrix4fv(mModelViewLoc, false, flatten(modelView));
        cylinderDraw(gl, program, drawFilled);
    popMatrix();
}

function engineRotators(gl, program, speed){
    //Eixo das helices
    pushMatrix();
        multMatrix(translate(0, 0.4, 0));
        multMatrix(scalem(0.2, 1.0, 0.2));
        gl.uniform3fv(mColorLoc, flatten([0.0, 0.0, 0.0]));
        gl.uniformMatrix4fv(mModelViewLoc, false, flatten(modelView));
        sphereDraw(gl, program, drawFilled);
    popMatrix();
    //Helices
    multMatrix(translate(0, 0.7, 0));
    multMatrix(rotateY(speed));    
    multMatrix(scalem(0.1, 0.01, 1.0));
    gl.uniform3fv(mColorLoc, flatten([1.0, 1.0, 1.0]));
    gl.uniformMatrix4fv(mModelViewLoc, false, flatten(modelView));
    sphereDraw(gl, program, drawFilled);
}

function drawBack(gl, program){
    landingKit(gl, program, true);
    landingKit(gl, program, false);
}

function landingKit(gl, program, front){
    var side = front ? 1 : -1;
    pushMatrix();
        multMatrix(translate(0, side * 1.8, -0.75));
        drawWheel(gl, program, true);
        drawWheel(gl, program, false);
        multMatrix(rotateX(90));
        multMatrix(scalem(0.15, 0.8, 0.1));
        gl.uniform3fv(mColorLoc, flatten([0.8, 0.8, 0.8]));
        gl.uniformMatrix4fv(mModelViewLoc, false, flatten(modelView));
        cylinderDraw(gl, program, drawFilled);
    popMatrix();
}

function drawWheel(gl, program, right){
    var side = right ? 1 : -1;
    pushMatrix()
        multMatrix(translate(side * 0.1, 0, -0.3));
        multMatrix(scalem(0.1, 0.5, 0.5));
        gl.uniform3fv(mColorLoc, flatten([1.0, 1.0, 1.0]));
        gl.uniformMatrix4fv(mModelViewLoc, false, flatten(modelView));
        sphereDraw(gl, program, drawFilled);
    popMatrix();
}

