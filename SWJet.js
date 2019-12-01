var BODY_LENGTH = 4;
var SCALE = 0.5;

function planeInit(gl){
    sphereInit(gl);
}

function planeDrawBody(gl, program){
    pushMatrix();
        //Parte de baixo
        pushMatrix();
            multMatrix(scalem(1.70,2.0,1.30));
            gl.uniformMatrix4fv(mModelViewLoc, false, flatten(modelView));
            gl.uniform3fv(mColorLoc, flatten([1.0,1.0,1.0]));
            sphereDraw(gl,program,true);
        popMatrix();
        
        //Nivel do nariz
        pushMatrix();
            multMatrix(translate([0,0,0.1]));
            
            //nivel do nariz
            pushMatrix();
                multMatrix(scalem(1.75, 2.05, 1.20));
                gl.uniformMatrix4fv(mModelViewLoc, false, flatten(modelView));
                gl.uniform3fv(mColorLoc, flatten([1.0,0.0,0.0]));
                sphereDraw(gl,program,true);
            pushMatrix();

            //nivel dos olhos/testa
            /*pushMatrix();
                multMatrix(translate([0.0,0.0,1.0]));
                multMatrix(scalem(1.60, 1.50, 1.30));
                gl.uniformMatrix4fv(mModelViewLoc, false, flatten(modelView));
                gl.uniform3fv(mColorLoc, flatten([1.0,0.0,0.0]));
                sphereDraw(gl,program,true);
            pushMatrix();*/
        popMatrix();
        
    popMatrix();
}

function drawHead(gl){
    
}

function drawTail(gl){
    
}