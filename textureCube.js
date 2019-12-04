textureCube_vertices = [
    vec3(-0.5, -0.5, +0.5),     // 0
    vec3(+0.5, -0.5, +0.5),     // 1
    vec3(+0.5, +0.5, +0.5),     // 2
    vec3(-0.5, +0.5, +0.5),     // 3
    vec3(-0.5, -0.5, -0.5),     // 4
    vec3(+0.5, -0.5, -0.5),     // 5
    vec3(+0.5, +0.5, -0.5),     // 6
    vec3(-0.5, +0.5, -0.5)      // 7
];

var textureCube_points = [];
var textureCube_normals = [];
var textureCube_faces = [];
var textureCube_edges = [];
var textureCube_texCoords = [];

var textureCube_points_buffer;
var textureCube_normals_buffer;
var textureCube_faces_buffer;
var textureCube_edges_buffer;
var textureCube_texCoords_buffer;

var texture;

function textureCubeInit(gl) {
    loadTexture(gl);
    textureCubeBuild();
    textureCubeUploadData(gl);
}

function loadTexture(gl) {
    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));
    var road = new Image();
    road.src = "road.png";
    
    road.onload = function() {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, road);
        gl.bindTexture(gl.TEXTURE_2D, null);
    };
}

function textureCubeBuild()
{
    textureCubeAddFace(0,1,2,3,vec3(0,0,1));
    textureCubeAddFace(1,5,6,2,vec3(1,0,0));
    textureCubeAddFace(4,7,6,5,vec3(0,0,-1));
    textureCubeAddFace(0,3,7,4,vec3(-1,0,0));
    textureCubeAddFace(3,2,6,7,vec3(0,1,0));
    textureCubeAddFace(0,4,5,1,vec3(0,-1,0));
}

function textureCubeUploadData(gl)
{
    textureCube_points_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCube_points_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(textureCube_points), gl.STATIC_DRAW);

    textureCube_normals_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCube_normals_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(textureCube_normals), gl.STATIC_DRAW);

    textureCube_faces_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, textureCube_faces_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(textureCube_faces), gl.STATIC_DRAW);

    textureCube_edges_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, textureCube_edges_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(textureCube_edges), gl.STATIC_DRAW);

    textureCube_texCoords_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCube_texCoords_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(textureCube_texCoords), gl.STATIC_DRAW);
}

function textureCubeDrawWireFrame(gl, program)
{
    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, textureCube_points_buffer);
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    //gl.bindBuffer(gl.ARRAY_BUFFER, textureCube_normals_buffer);
    //var vNormal = gl.getAttribLocation(program, "vNormal");
    //gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    //gl.enableVertexAttribArray(vNormal);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, textureCube_edges_buffer);
    gl.drawElements(gl.LINES, textureCube_edges.length, gl.UNSIGNED_BYTE, 0);
}

function textureCubeDrawFilled(gl, program)
{
    gl.useProgram(program);
    
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, textureCube_points_buffer);
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    //gl.bindBuffer(gl.ARRAY_BUFFER, textureCube_normals_buffer);
    //var vNormal = gl.getAttribLocation(program, "vNormal");
    //gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    //gl.enableVertexAttribArray(vNormal);

    gl.bindBuffer(gl.ARRAY_BUFFER, textureCube_texCoords_buffer);
    var vTexCoords = gl.getAttribLocation(program, "vTexCoord");
    gl.vertexAttribPointer(vTexCoords, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTexCoords);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, textureCube_faces_buffer);
    gl.drawElements(gl.TRIANGLES, textureCube_faces.length, gl.UNSIGNED_BYTE, 0);

}

function textureCubeAddFace(a, b, c, d, n)
{
    var offset = textureCube_points.length;

    textureCube_points.push(textureCube_vertices[a]);
    textureCube_points.push(textureCube_vertices[b]);
    textureCube_points.push(textureCube_vertices[c]);
    textureCube_points.push(textureCube_vertices[d]);

    textureCube_texCoords.push(vec2(0.0, 0.0));
    textureCube_texCoords.push(vec2(1.0, 0.0));
    textureCube_texCoords.push(vec2(1.0, 1.0));
    textureCube_texCoords.push(vec2(0.0, 1.0));

    for(var i=0; i<4; i++)
        textureCube_normals.push(n);

    // Add 2 triangular faces (a,b,c) and (a,c,d)
    textureCube_faces.push(offset);
    textureCube_faces.push(offset+1);
    textureCube_faces.push(offset+2);

    textureCube_faces.push(offset);
    textureCube_faces.push(offset+2);
    textureCube_faces.push(offset+3);

    // Add first edge (a,b)
    textureCube_edges.push(offset);
    textureCube_edges.push(offset+1);

    // Add second edge (b,c)
    textureCube_edges.push(offset+1);
    textureCube_edges.push(offset+2);
}

function textureCubeDraw(gl, program, filled=false) {
	if(filled) textureCubeDrawFilled(gl, program);
	else textureCubeDrawWireFrame(gl, program);
}
