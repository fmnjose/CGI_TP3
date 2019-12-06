const N_ROWS = 10;
const N_COLUMNS = 10;
const TILE_LENGTH = 10;
const COLOR = color(0x95, 0x75, 0xa5);

let seed;
let adjacentTiles = [];

function floorInit(gl){
    textureCubeInit(gl);
    seed = new Tile(planeX, planeY, TILE_LENGTH);
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

    seed.drawWorld(gl,program, N_ROWS, N_COLUMNS);
} 

function recalculateMainTile(){
    let changed = true;
    if(planeY > seed.maxY){
        if(planeX > seed.maxX)
            seed = adjacentTiles[1];
        else if(planeX < seed.minX)
            seed = adjacentTiles[7];
        else 
            seed = adjacentTiles[0];
    }else if(planeY < seed.minY){
        if(planeX > seed.maxX)
            seed = adjacentTiles[3];
        else if(planeX < seed.minX)
            seed = adjacentTiles[5];
        else 
            seed = adjacentTiles[4];
    }else{
        if(planeX > seed.maxX)
            seed = adjacentTiles[2];
        else if(planeX < seed.minX)
            seed = adjacentTiles[6];
        else 
            changed = false;
    }

    return changed;
}

function generateAdjacentTiles(){
    let x = seed.x;
    let y = seed.y;
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