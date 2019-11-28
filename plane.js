var BODY_LENGTH = 4;
var SCALE = 0.5;

function planeInit(gl){
    cylinderInit(gl);
    sphereInit(gl);
    coneInit(gl);
    pyramidInit(gl);
}

function planeDrawBody(gl, program){
    pushMatrix();
        multMatrix(scalem(SCALE, SCALE, SCALE));
        //CILINDRO
        pushMatrix();
            multMatrix(scalem(1, BODY_LENGTH, 1));
            gl.uniformMatrix4fv(mModelViewLoc, false, flatten(modelView));
            gl.uniform3fv(mColorLoc, flatten([1.0, 1.0, 1.0]));
            cylinderDraw(gl, program, true);
        popMatrix();
        //CABECA

        drawHead(gl);

        drawTail(gl);
    popMatrix();
}

function drawHead(gl){
    pushMatrix();
        multMatrix(translate(0, BODY_LENGTH / 2, 0));
        multMatrix(scalem(1, 2, 1));
        gl.uniformMatrix4fv(mModelViewLoc, false, flatten(modelView));
        gl.uniform3fv(mColorLoc, flatten([1.0, 0.0, 0.0]));
        sphereDraw(gl, program, true);
    popMatrix();
}

function drawTail(gl){
    pushMatrix();
        multMatrix(translate(0, -BODY_LENGTH / 2, 0));
        //CAUDA
        pushMatrix();
            multMatrix(scalem(1.0, 3.0, 1.0));
            gl.uniformMatrix4fv(mModelViewLoc, false, flatten(modelView));
            gl.uniform3fv(mColorLoc, flatten([0.0, 1.0, 0.0]));
            sphereDraw(gl, program, true);
        popMatrix();

        //FLAB HORIZONTAL CAUDA
        pushMatrix();
            multMatrix(rotateX(180 / SCALE));
            multMatrix(scalem(2.0, 3.0, 0.01));
            gl.uniformMatrix4fv(mModelViewLoc, false, flatten(modelView));
            gl.uniform3fv(mColorLoc, flatten([0.0, 0.0, 1.0]));
            pyramidDraw(gl, program, true);

        //FLAB VERTICAL CAUDA
            multMatrix(rotateY(45 / SCALE));
            gl.uniformMatrix4fv(mModelViewLoc, false, flatten(modelView));
            pyramidDraw(gl, program, true);
        popMatrix();
    popMatrix();
}