// This actually renders a quad to support thicker lines.

// The first two parameters are two points designating the start
// and end of the line. Supply each point as an object with
// properties 'x' and 'y'.
// The color is optional (default black).
// thickness is optional (default is pixelSize)
function Line(a, b, color, thickness)
{
    this.hidden = false;

    this.a = a;
    this.b = b;

    this.color = color || 'black';

    this.thickness = thickness || pixelSize;

    if (!(this.color instanceof jQuery.Color))
        this.color = jQuery.Color(this.color);

    // Set up vertices

    // Get vector normal to the direction from a to b
    var dx = a.y - b.y;
    var dy = b.x - a.x;
    var d = sqrt(dx*dx + dy*dy);
    // Normalise and scale to half the thickness
    dx = dx/d * this.thickness/2;
    dy = dy/d * this.thickness/2;

    // Now set up vertices of a counter-clockwise quad
    var vertexCoords = [
        a.x - dx, a.y - dy,
        b.x - dx, b.y - dy,
        b.x + dx, b.y + dy,
        a.x + dx, a.y + dy
    ];

    this.vertices = {};
    this.vertices.data = new Float32Array(vertexCoords);

    this.vertices.bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices.bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices.data, gl.STATIC_DRAW);
}

Line.prototype.hide = function() { this.hidden = true; };
Line.prototype.show = function() { this.hidden = false; };

// You may provide another color to override the one this
// line was created with.
Line.prototype.render = function(color) {
    if (this.hidden) return;

    color = color || this.color;

    if (!(color instanceof jQuery.Color))
        color = jQuery.Color(color);

    gl.useProgram(shaderProgram.program);

    gl.uniform2f(shaderProgram.uCenter, 0, 0);
    gl.uniform1f(shaderProgram.uScale, 1);
    gl.uniform1f(shaderProgram.uAngle, 0);

    gl.enableVertexAttribArray(shaderProgram.aPos);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices.bufferId);
    gl.vertexAttribPointer(shaderProgram.aPos, 2, gl.FLOAT, false, 0, 0);

    gl.uniform4f(shaderProgram.uColor,
                 color.red()/255,
                 color.green()/255,
                 color.blue()/255,
                 1);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    gl.disableVertexAttribArray(shaderProgram.aPos);
};

// "Destructor" - this has to be called manually
Line.prototype.destroy = function() {
    gl.deleteBuffer(this.vertices.bufferId);
    delete this.vertices;
};
