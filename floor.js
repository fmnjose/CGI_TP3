var N_ROWS = 10;
var N_COLUMNS = 10;
var TILE_LENGTH = 2;

function floorInit(gl){
    textureCubeInit(gl);
}

function floorDraw(gl, program){
    for(var i = 0; i < N_ROWS / 2; i++)
        drawRow(gl, program, i);
    
    for(var i = -1; i > -N_ROWS / 2 + 1; i--)
        drawRow(gl, program, i);
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
        gl.uniformMatrix4fv(mModelViewLoc, false, flatten(modelView));
        textureCubeDraw(gl, program, true);
    popMatrix();
}

function drawTile(gl, program, n){
    pushMatrix();
        multMatrix(translate(TILE_LENGTH * n, 0, 0));
        multMatrix(scalem(TILE_LENGTH, TILE_LENGTH, 0.1));
        gl.uniformMatrix4fv(mModelViewLoc, false, flatten(modelView));
        textureCubeDraw(gl, program, true);
    popMatrix();
}