const N_ROWS = 10;
const N_COLUMNS = 10;
const TILE_LENGTH = 2;
const COLOR = color(0x95, 0x75, 0xa5);

function floorInit(gl){
    textureCubeInit(gl);
}

function floorDraw(gl, program){
    gl.useProgram(program);

    gl.uniformMatrix4fv(floorProjectionLoc, false, flatten(mProjection));

    gl.uniform3fv(floorColorLoc, flatten(COLOR));

    pushMatrix();
        multMatrix(translate(0, -distance, 0));

        for(var i = 0; i < N_ROWS / 2; i++)
            drawRow(gl, program, i);
        
        for(var i = -1; i > -N_ROWS / 2 + 1; i--)
            drawRow(gl, program, i);
    popMatrix();
} 

function  drawRow(gl, program, n){
    pushMatrix();
        drawAnchorTile(gl, program, n)
        for(var i = 1; i < N_COLUMNS; i++)
            drawTile(gl, program, i);
    popMatrix();
}

function drawAnchorTile(gl, program, n){
    multMatrix(translate(-TILE_LENGTH * (N_COLUMNS / 2), TILE_LENGTH * n, -0.7));
    pushMatrix();
        multMatrix(scalem(TILE_LENGTH, TILE_LENGTH, 0.1));
        gl.uniformMatrix4fv(floorModelViewLoc, false, flatten(modelView));
        textureCubeDraw(gl, program, true);
    popMatrix();
}

function drawTile(gl, program, n){
    pushMatrix();
        multMatrix(translate(TILE_LENGTH * n, 0, 0));
        multMatrix(scalem(TILE_LENGTH, TILE_LENGTH, 0.1));
        gl.uniformMatrix4fv(floorModelViewLoc, false, flatten(modelView));
        textureCubeDraw(gl, program, true);
    popMatrix();
}