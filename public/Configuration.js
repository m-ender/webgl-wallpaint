var resolution = 1024; // We're assuming a square aspect ratio

// Render scale is the percentage of the viewport that will be filled by
// the coordinate range [-1, 1].
// The scaling is done in the shaders, but is has to be taking into account
// in obtaining coordinates from the mouse position.
var renderScale = 1;
var maxCoord = 1/renderScale;

// A square this big in our [-1, 1] coordinate system will be roughly
// the size of a pixel
var pixelSize = 2*maxCoord/resolution;

// Useful default radius for small circles
var markerRadius = 3*pixelSize;
// Default line width
var lineThickness = 2*pixelSize;
