class Tile{
    constructor(x,y,scale){
        this.x = x;
        this.y = y;
        this.scale = scale;
    }

    drawTile(gl,program){
        pushMatrix();
            multMatrix(translate(this.x,this.y,-0.7));
            multMatrix(scalem(this.scale, this.scale, 0.1));
            gl.uniformMatrix4fv(floorModelViewLoc, false, flatten(modelView));
            textureCubeDraw(gl,program,true);
        popMatrix();
    }
}