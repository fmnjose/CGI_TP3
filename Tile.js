class Tile{
    constructor(x,y,scale){
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.minX = x - scale / 2;
        this.maxX = x + scale / 2;
        this.minY = y - scale / 2;
        this.maxY = y + scale / 2;
    }

    drawTile(gl,program){
        pushMatrix();
            multMatrix(translate(this.x,this.y, 0));
            multMatrix(scalem(this.scale, this.scale, 0.1));
            gl.uniformMatrix4fv(floorModelViewLoc, false, flatten(modelView));
            textureCubeDraw(gl,program,true);
        popMatrix();
    }
}