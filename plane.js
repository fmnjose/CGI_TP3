const BODY_LENGTH = 4;
const WING_WIDTH = 10;
const SCALE = 0.5;
const BODY_COLOR = color(0x45, 0x6b, 0x8e);
const HEAD_COLOR = color(0x5b, 0x8c, 0xba);
const GLASS_COLOR = color(0x9b, 0xe1, 0xff);
const TAIL_COLOR = color(36, 66, 94);
const WING_COLOR = color(0x70, 0xa6, 0xd8);
const SUPPORT_COLOR = WING_COLOR
const ENGINE_COLOR = color(0x3e, 0x57, 0x77);
const HELICES_COLOR = color(0x4f, 0xff, 0xf9);
const WHEEL_COLOR = color(0x3f, 0x3f, 0x3f);
var helicesMem = 0;
var drawFilled;

function planeInit(gl){
    cubeInit(gl);
    cylinderInit(gl);
    sphereInit(gl);
    coneInit(gl);
    pyramidInit(gl);
    torusInit(gl);
}

function color(red, green, blue){
    return [red / 255, green / 255, blue / 255];
}

function planeDraw(gl, program, filled){
    drawFilled = filled;
    
    gl.useProgram(program);

    gl.uniformMatrix4fv(planeProjectionLoc, false, flatten(mProjection));


    pushMatrix();
    multMatrix(rotateX(diveFactor));
    multMatrix(rotateY(rollFactor));
    multMatrix(rotateZ(turnFactor));
    multMatrix(scalem(SCALE, SCALE, SCALE));
        //CILINDRO
        pushMatrix();
            multMatrix(scalem(1, BODY_LENGTH, 1));
            gl.uniformMatrix4fv(planeModelViewLoc, false, flatten(modelView));
            gl.uniform3fv(planeColorLoc, flatten(BODY_COLOR));
            cylinderDraw(gl, program, drawFilled);
        popMatrix();
        //CABECA

        drawCockpit(gl, program);

        drawTail(gl, program);

        //saves the helices' last rotation
        helicesMem = (helicesMem + speed) % 360;

        drawWings(gl, program, helicesMem);

        drawBack(gl, program);
    popMatrix();
}

function drawCockpit(gl, program){
    pushMatrix();
        multMatrix(translate(0, BODY_LENGTH / 2, 0));
        //BOOTH
        pushMatrix();
            multMatrix(scalem(1, 2, 1));
            gl.uniformMatrix4fv(planeModelViewLoc, false, flatten(modelView));
            gl.uniform3fv(planeColorLoc, flatten(HEAD_COLOR));
            sphereDraw(gl, program, drawFilled);
        popMatrix();
        //WINDOW
        multMatrix(translate(0, 0, 0.1));
        multMatrix(rotateX(90));
        multMatrix(scalem(0.7, 1, 1.5));
        gl.uniformMatrix4fv(planeModelViewLoc, false, flatten(modelView));
        gl.uniform3fv(planeColorLoc, flatten(GLASS_COLOR));
        torusDraw(gl, program, drawFilled);
    popMatrix();
}

function drawTail(gl, program){
    pushMatrix();
        multMatrix(translate(0, -BODY_LENGTH / 2, 0));
        //CAUDA
        pushMatrix();
            multMatrix(scalem(1.0, 5.0, 1.0));
            gl.uniformMatrix4fv(planeModelViewLoc, false, flatten(modelView));
            gl.uniform3fv(planeColorLoc, flatten(BODY_COLOR));
            sphereDraw(gl, program, drawFilled);
        popMatrix();

        //FLAB HORIZONTAL CAUDA
        pushMatrix();
            multMatrix(translate(0, -BODY_LENGTH/2, 0));
            multMatrix(scalem(3.0, 0.5, 0.1));
            gl.uniformMatrix4fv(planeModelViewLoc, false, flatten(modelView));
            gl.uniform3fv(planeColorLoc, flatten(WING_COLOR));
            sphereDraw(gl, program, drawFilled);
        popMatrix();
        //FLAB VERTICAL CAUDA
        pushMatrix();
            multMatrix(translate(0, -BODY_LENGTH/2, 0.5));
            multMatrix(rotateY(90));
            multMatrix(scalem(1.5, 0.5, 0.1));
            gl.uniformMatrix4fv(planeModelViewLoc, false, flatten(modelView));
            sphereDraw(gl, program, drawFilled);
        popMatrix();
    popMatrix();
}

function drawWings(gl, program, speed){
    pushMatrix();
        multMatrix(translate(0, 0, 0));
        pushMatrix();
            multMatrix(scalem(WING_WIDTH, 2.0, 0.1))
            gl.uniform3fv(planeColorLoc, flatten(WING_COLOR));
            gl.uniformMatrix4fv(planeModelViewLoc, false, flatten(modelView));
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
        //MAIN ENGINE
        pushMatrix();
            wingEngine(gl, program, speed, true);  
        popMatrix();
        //EXTRA ONES
        multMatrix(translate(side * WING_WIDTH / 8, 0, 0)); 
        wingEngine(gl, program, speed, false);  
     
    popMatrix();
}

function wingEngine(gl, program, speed, main){
    let scale = main ? 1 : 0.75;
    //Suporte
    multMatrix(translate(0, main ? 0 : -0.5, 0.3 / scale));
    pushMatrix();
        multMatrix(rotateX(90));
        multMatrix(scalem(scale * 0.3, scale * 0.3, scale * 0.5));
        gl.uniform3fv(planeColorLoc, flatten(SUPPORT_COLOR));
        gl.uniformMatrix4fv(planeModelViewLoc, false, flatten(modelView));
        cylinderDraw(gl, program, drawFilled);
    popMatrix();
    //Propulsor
    pushMatrix();
        multMatrix(translate(0, 0, -0.25));
        pushMatrix();
            multMatrix(scalem(scale * 0.5, scale * 1.3,scale * 0.5));  
            gl.uniform3fv(planeColorLoc, flatten(ENGINE_COLOR));
            gl.uniformMatrix4fv(planeModelViewLoc, false, flatten(modelView));
            cylinderDraw(gl, program, drawFilled);
        popMatrix();
        engineRotators(gl, program, speed, scale);  
    popMatrix();

}

function engineRotators(gl, program, speed, scale){
    //Eixo das helices
    pushMatrix();
        multMatrix(translate(0, 0.4 * scale, 0));
        multMatrix(scalem(scale * 0.2,  scale * 1.0,  scale * 0.2));
        gl.uniform3fv(planeColorLoc, flatten([0.0, 0.0, 0.0]));
        gl.uniformMatrix4fv(planeModelViewLoc, false, flatten(modelView));
        sphereDraw(gl, program, drawFilled);
    popMatrix();
    //Helices
    multMatrix(translate(0,  0.7 * scale, 0));
    multMatrix(rotateY(speed));    
    multMatrix(scalem(scale * 0.1, scale * 0.01, scale * 1.0));
    gl.uniform3fv(planeColorLoc, flatten(HELICES_COLOR));
    gl.uniformMatrix4fv(planeModelViewLoc, false, flatten(modelView));
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
        gl.uniform3fv(planeColorLoc, flatten(SUPPORT_COLOR));
        gl.uniformMatrix4fv(planeModelViewLoc, false, flatten(modelView));
        cylinderDraw(gl, program, drawFilled);
    popMatrix();
}

function drawWheel(gl, program, right){
    var side = right ? 1 : -1;
    pushMatrix()
        multMatrix(translate(side * 0.1, 0, -0.3));
        multMatrix(scalem(0.1, 0.5, 0.5));
        gl.uniform3fv(planeColorLoc, flatten(WHEEL_COLOR));
        gl.uniformMatrix4fv(planeModelViewLoc, false, flatten(modelView));
        sphereDraw(gl, program, drawFilled);
    popMatrix();
}

