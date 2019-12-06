const N_ROWS = 3;
const N_COLUMNS = 3;
const TILE_LENGTH = 20;
const COLOR = color(0x95, 0x75, 0xa5);

let mainTile;
let adjacentTiles = [];

function floorInit(gl){
    textureCubeInit(gl);
    mainTile = new Tile(planeX, planeY, TILE_LENGTH);
    generateAdjacentTiles();
}

function floorDraw(gl, program){
    gl.useProgram(program);

    gl.uniformMatrix4fv(floorProjectionLoc, false, flatten(mProjection));
    
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(gl.getUniformLocation(program,"texture"),0);

    if(recalculateMainTile())
        generateAdjacentTiles();

    pushMatrix();
        mainTile.drawTile(gl,program);
        console.log(adjacentTiles);
        adjacentTiles.forEach(t => t.drawTile(gl, program));
    popMatrix();
} 

function recalculateMainTile(){
    let changed = true;
    if(planeY > mainTile.maxY){
        if(planeX > mainTile.maxX)
            mainTile = adjacentTiles[1];
        else if(planeX < mainTile.minX)
            mainTile = adjacentTiles[7];
        else 
            mainTile = adjacentTiles[0];
    }else if(planeY < mainTile.minY){
        if(planeX > mainTile.maxX)
            mainTile = adjacentTiles[3];
        else if(planeX < mainTile.minX)
            mainTile = adjacentTiles[5];
        else 
            mainTile = adjacentTiles[4];
    }else{
        if(planeX > mainTile.maxX)
            mainTile = adjacentTiles[2];
        else if(planeX < mainTile.minX)
            mainTile = adjacentTiles[6];
        else 
            changed = false;
    }

    return changed;
}

function generateAdjacentTiles(){
    let x = mainTile.x;
    let y = mainTile.y;
    adjacentTiles = [];
    adjacentTiles.push(new Tile(x, y + TILE_LENGTH, TILE_LENGTH));//0
    adjacentTiles.push(new Tile(x + TILE_LENGTH, y + TILE_LENGTH, TILE_LENGTH));//\
    adjacentTiles.push(new Tile(x + TILE_LENGTH, y, TILE_LENGTH));//2
    adjacentTiles.push(new Tile(x + TILE_LENGTH, y - TILE_LENGTH, TILE_LENGTH));//3
    adjacentTiles.push(new Tile(x, y - TILE_LENGTH, TILE_LENGTH));//4
    adjacentTiles.push(new Tile(x - TILE_LENGTH, y - TILE_LENGTH, TILE_LENGTH));//5
    adjacentTiles.push(new Tile(x - TILE_LENGTH, y, TILE_LENGTH));//6
    adjacentTiles.push(new Tile(x - TILE_LENGTH, y + TILE_LENGTH, TILE_LENGTH));//7
}