var mouseX = 0,
  mouseY = 0;
var prevMouseX = 0,
  prevMouseY = 0;
var isMouseDown = false;

var keysPressed = {
  w: false,
  a: false,
  s: false,
  d: false,
};

// //isi bentuk" yg akan digunakan

//Half Sphere
function generateHalfSphere(x, y, z, radius, segments, warna) {
  var vertices = [];
  var colors = [];

  var rainbowColors = [warna];

  for (var i = 0; i <= segments / 2; i++) {
    var latAngle = Math.PI * (-0.5 + i / segments);
    var sinLat = Math.sin(latAngle);
    var cosLat = Math.cos(latAngle);

    for (var j = 0; j <= segments; j++) {
      var lonAngle = 2 * Math.PI * (j / segments);
      var sinLon = Math.sin(lonAngle);
      var cosLon = Math.cos(lonAngle);

      var xCoord = cosLon * cosLat;
      var zCoord = sinLon * cosLat;
      var yCoord = sinLat;

      var vertexX = x + radius * xCoord;
      var vertexY = y + radius * yCoord;
      var vertexZ = z + radius * zCoord;

      vertices.push(vertexX, vertexY, vertexZ);

      var colorIndex = j % rainbowColors.length;
      colors = colors.concat(rainbowColors[colorIndex]);
    }
  }

  for (var j = 0; j <= segments; j++) {
    var lonAngle = 2 * Math.PI * (j / segments);
    var sinLon = Math.sin(lonAngle);
    var cosLon = Math.cos(lonAngle);

    var xCoord = cosLon * Math.cos(Math.PI / 2); // Use latAngle = PI/2 for the lid
    var yCoord = sinLon * Math.cos(Math.PI / 2);
    var zCoord = Math.sin(Math.PI / 2); // Top of the sphere

    var vertexX = x + (radius * xCoord) / 32;
    var vertexY = y + (radius * yCoord) / 32;
    var vertexZ = z + (radius * zCoord) / 32;

    vertices.push(vertexX, vertexY, vertexZ);

    var colorIndex = j % rainbowColors.length;
    colors = colors.concat(rainbowColors[colorIndex]);
  }

  var faces = [];
  for (var i = 0; i < segments; i++) {
    for (var j = 0; j < segments; j++) {
      var index = i * (segments + 1) + j;
      var nextIndex = index + segments + 1;

      faces.push(index, nextIndex, index + 1);
      faces.push(nextIndex, nextIndex + 1, index + 1);
    }
  }
  return { vertices: vertices, colors: colors, faces: faces };
}

//Sphere
function generateBall(x, y, z, radius, segments, warna) {
  var vertices = [];
  var colors = [];

  var rainbowColors = [warna];

  for (var i = 0; i <= segments; i++) {
    var latAngle = Math.PI * (-0.5 + i / segments);
    var sinLat = Math.sin(latAngle);
    var cosLat = Math.cos(latAngle);

    for (var j = 0; j <= segments; j++) {
      var lonAngle = 2 * Math.PI * (j / segments);
      var sinLon = Math.sin(lonAngle);
      var cosLon = Math.cos(lonAngle);

      var xCoord = cosLon * cosLat;
      var yCoord = sinLon * cosLat;
      var zCoord = sinLat;

      var vertexX = x + radius * xCoord;
      var vertexY = y + radius * yCoord;
      var vertexZ = z + radius * zCoord;

      vertices.push(vertexX, vertexY, vertexZ);

      var colorIndex = j % rainbowColors.length;
      colors = colors.concat(rainbowColors[colorIndex]);
    }
  }

  var faces = [];
  for (var i = 0; i < segments; i++) {
    for (var j = 0; j < segments; j++) {
      var index = i * (segments + 1) + j;
      var nextIndex = index + segments + 1;

      faces.push(index, nextIndex, index + 1);
      faces.push(nextIndex, nextIndex + 1, index + 1);
    }
  }

  return { vertices: vertices, colors: colors, faces: faces };
}

// Elliptic Paraboloid
function generateEllipticParboloid(x, y, z, radius, segments, rotationX, rotationY, rotationZ, warna) {
  var vertices = [];
  var colors = [];

  var rainbowColors = [warna];

  for (var i = 0; i <= segments; i++) {
    var latAngle = Math.PI * (-0.5 + i / segments);
    var sinLat = Math.sin(latAngle);
    var cosLat = Math.cos(latAngle);

    for (var j = 0; j <= segments; j++) {
      var lonAngle = Math.PI * (j / segments);
      var sinLon = Math.sin(lonAngle);
      var cosLon = Math.cos(lonAngle);

      var xCoord = cosLon * latAngle;
      var zCoord = sinLon * latAngle;
      var yCoord = -Math.pow(latAngle, 2) * 1.1;

      // Rotasi
      var rotatedX = xCoord * Math.cos(rotationZ) - yCoord * Math.sin(rotationZ);
      var rotatedY = xCoord * Math.sin(rotationZ) + yCoord * Math.cos(rotationZ);
      var rotatedZ = zCoord;

      // Pemutaran tambahan untuk diagonal
      rotatedY = rotatedY * Math.cos(rotationX) - rotatedZ * Math.sin(rotationX);
      rotatedZ = rotatedY * Math.sin(rotationX) + rotatedZ * Math.cos(rotationX);
      rotatedX = rotatedX * Math.cos(rotationY) - rotatedZ * Math.sin(rotationY);
      rotatedZ = rotatedX * Math.sin(rotationY) + rotatedZ * Math.cos(rotationY);

      var vertexX = x + radius * rotatedX;
      var vertexY = y + radius * rotatedY;
      var vertexZ = z + radius * rotatedZ;

      // var vertexX = x + radius * xCoord;
      // var vertexY = y + radius * yCoord;
      // var vertexZ = z + radius * zCoord;

      vertices.push(vertexX, vertexY, vertexZ);

      var colorIndex = j % rainbowColors.length;
      colors = colors.concat(rainbowColors[colorIndex]);
    }
  }

  var faces = [];
  for (var i = 0; i < segments; i++) {
    for (var j = 0; j < segments; j++) {
      var index = i * (segments + 1) + j;
      var nextIndex = index + segments + 1;

      faces.push(index, nextIndex, index + 1);
      faces.push(nextIndex, nextIndex + 1, index + 1);
    }
  }

  return { vertices: vertices, colors: colors, faces: faces };
}

// Ellipsoid
function generateEllipsoid(x, y, z, radius, segments, ovalY, warna) {
  var vertices = [];
  var colors = [];

  var rainbowColors = [warna];

  for (var i = 0; i <= segments; i++) {
    var latAngle = Math.PI * (-0.5 + i / segments);
    var sinLat = Math.sin(latAngle);
    var cosLat = Math.cos(latAngle);

    for (var j = 0; j <= segments; j++) {
      var lonAngle = 2 * Math.PI * (j / segments);
      var sinLon = Math.sin(lonAngle);
      var cosLon = Math.cos(lonAngle);

      var xCoord = cosLon * cosLat;
      var yCoord = sinLon * cosLat * ovalY;
      var zCoord = sinLat;

      var vertexX = x + radius * xCoord;
      var vertexY = y + radius * yCoord;
      var vertexZ = z + radius * zCoord;

      vertices.push(vertexX, vertexY, vertexZ);

      var colorIndex = j % rainbowColors.length;
      colors = colors.concat(rainbowColors[colorIndex]);
    }
  }

  var faces = [];
  for (var i = 0; i < segments; i++) {
    for (var j = 0; j < segments; j++) {
      var index = i * (segments + 1) + j;
      var nextIndex = index + segments + 1;

      faces.push(index, nextIndex, index + 1);
      faces.push(nextIndex, nextIndex + 1, index + 1);
    }
  }

  return { vertices: vertices, colors: colors, faces: faces };
}

// Cube bisa adjust 
function generateKotak(xmin, x, ymin, y, zmin, z, segments, warna) {
  var colors = [];
  var vertices = [
    // Atas
    xmin,
    y,
    zmin,
    xmin,
    y,
    z,
    x,
    y,
    z,
    x,
    y,
    zmin,

    // Kiri
    xmin,
    ymin,
    zmin,
    xmin,
    y,
    zmin,
    xmin,
    y,
    z,
    xmin,
    ymin,
    z,

    // Kanan
    x,
    ymin,
    zmin,
    x,
    y,
    zmin,
    x,
    y,
    z,
    x,
    ymin,
    z,

    // Depan
    xmin,
    ymin,
    z,
    x,
    ymin,
    z,
    x,
    y,
    z,
    xmin,
    y,
    z,

    // Belakang
    xmin,
    ymin,
    zmin,
    x,
    ymin,
    zmin,
    x,
    y,
    zmin,
    xmin,
    y,
    zmin,

    // Bawah
    xmin,
    ymin,
    zmin,
    xmin,
    ymin,
    z,
    x,
    ymin,
    z,
    x,
    ymin,
    zmin,
  ];

  var rainbowColors = [warna];

  for (var i = 0; i <= segments; i++) {
    for (var j = 0; j <= segments; j++) {
      var colorIndex = j % rainbowColors.length;
      colors = colors.concat(rainbowColors[colorIndex]);
    }
  }

  var faces = [
    // // atas
    0, 1, 2,

    0, 2, 3,

    // kiri
    5, 4, 6,

    6, 4, 7,

    // kanan
    8, 9, 10,

    8, 10, 11,

    // depan
    13, 12, 14,

    15, 14, 12,

    // belakang
    16, 17, 18,

    16, 18, 19,

    // bawah
    21, 20, 22,

    22, 20, 23,
  ];

  return { vertices: vertices, colors: colors, faces: faces };
}

//Tabung (untuk tiang)
function generateTabung(x, y, z, radius, height, segments, rotationX, rotationY, rotationZ) {
  var vertices = [];
  var colors = [];
  var rainbowColors = [
    [21 / 255, 76 / 255, 121 / 255], //warna : #042f66
  ];

  for (var i = 0; i <= segments; i++) {
    var angle = 2 * Math.PI * (i / segments);
    var sinAngle = Math.sin(angle);
    var cosAngle = Math.cos(angle);

    for (var j = 0; j <= segments; j++) {
      var heightFraction = j / segments;
      var xCoord = radius * cosAngle;
      var yCoord = height * heightFraction - height / 2;
      var zCoord = radius * sinAngle;

      // var vertexX = x + xCoord;
      // var vertexY = y + yCoord;
      // var vertexZ = z + zCoord;

      // Rotasi
      var rotatedX = xCoord * Math.cos(rotationZ) - yCoord * Math.sin(rotationZ);
      var rotatedY = xCoord * Math.sin(rotationZ) + yCoord * Math.cos(rotationZ);
      var rotatedZ = zCoord;

      // Pemutaran tambahan untuk diagonal
      rotatedY = rotatedY * Math.cos(rotationX) - rotatedZ * Math.sin(rotationX);
      rotatedZ = rotatedY * Math.sin(rotationX) + rotatedZ * Math.cos(rotationX);
      rotatedX = rotatedX * Math.cos(rotationY) - rotatedZ * Math.sin(rotationY);
      rotatedZ = rotatedX * Math.sin(rotationY) + rotatedZ * Math.cos(rotationY);

      var vertexX = x + radius * rotatedX;
      var vertexY = y + radius * rotatedY;
      var vertexZ = z + radius * rotatedZ;

      vertices.push(vertexX, vertexY, vertexZ);

      var colorIndex = j % rainbowColors.length;
      colors = colors.concat(rainbowColors[colorIndex]);
    }
  }

  var faces = [];
  for (var i = 0; i < segments; i++) {
    for (var j = 0; j < segments; j++) {
      var index = i * (segments + 1) + j;
      var nextIndex = index + segments + 1;

      faces.push(index, nextIndex, index + 1);
      faces.push(nextIndex, nextIndex + 1, index + 1);
    }
  }
  return { vertices: vertices, colors: colors, faces: faces };
}

// //smpai sini bentuk"nya

function updateViewMatrix() {
  var sensitivity = 0.01; // Adjust sensitivity here
  var dx = mouseX - prevMouseX;
  var dy = mouseY - prevMouseY;

  // Rotate the view matrix based on mouse movement
  LIBS.rotateY(VIEW_MATRIX, -dx);
  LIBS.rotateX(VIEW_MATRIX, -dy);

  prevMouseX = mouseX;
  prevMouseY = mouseY;
}

function main() {
  var CANVAS = document.getElementById('your_canvas');

  CANVAS.width = window.innerWidth;
  CANVAS.height = window.innerHeight;

  var GL;
  try {
    GL = CANVAS.getContext('webgl', { antialias: true });
    var EXT = GL.getExtension('OES_element_index_uint');
  } catch (e) {
    alert('WebGL context cannot be initialized');
    return false;
  }

  //shaders
  var shader_vertex_source = `
    attribute vec3 position;
    attribute vec3 color;

    uniform mat4 PMatrix;
    uniform mat4 VMatrix;
    uniform mat4 MMatrix;
    
    varying vec3 vColor;
    void main(void) {
    gl_Position = PMatrix*VMatrix*MMatrix*vec4(position, 1.);
    vColor = color;
    }`;
  var shader_fragment_source = `
    precision mediump float;
    varying vec3 vColor;
      // uniform vec3 color;
    void main(void) {
    gl_FragColor = vec4(vColor, 1.);
    
    }`;
  var compile_shader = function (source, type, typeString) {
    var shader = GL.createShader(type);
    GL.shaderSource(shader, source);
    GL.compileShader(shader);
    if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
      alert('ERROR IN ' + typeString + ' SHADER: ' + GL.getShaderInfoLog(shader));
      return false;
    }
    return shader;
  };

  var shader_vertex = compile_shader(shader_vertex_source, GL.VERTEX_SHADER, 'VERTEX');
  var shader_fragment = compile_shader(shader_fragment_source, GL.FRAGMENT_SHADER, 'FRAGMENT');

  var SHADER_PROGRAM = GL.createProgram();
  GL.attachShader(SHADER_PROGRAM, shader_vertex);
  GL.attachShader(SHADER_PROGRAM, shader_fragment);

  GL.linkProgram(SHADER_PROGRAM);

  var _color = GL.getAttribLocation(SHADER_PROGRAM, 'color');
  var _position = GL.getAttribLocation(SHADER_PROGRAM, 'position');

  //uniform
  var _PMatrix = GL.getUniformLocation(SHADER_PROGRAM, 'PMatrix'); //projection
  var _VMatrix = GL.getUniformLocation(SHADER_PROGRAM, 'VMatrix'); //View
  var _MMatrix = GL.getUniformLocation(SHADER_PROGRAM, 'MMatrix'); //Model

  GL.enableVertexAttribArray(_color);
  GL.enableVertexAttribArray(_position);
  GL.useProgram(SHADER_PROGRAM);

  //Base World
  var baseWorld = generateHalfSphere(0, -0.9, 0, 2.7, 50, [0.0, 1.0, 0.0]);
  var baseWorld_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, baseWorld_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(baseWorld.vertices), GL.STATIC_DRAW);
  var baseWorld_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, baseWorld_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(baseWorld.colors), GL.STATIC_DRAW);
  var baseWorld_ebo = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, baseWorld_ebo);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(baseWorld.faces), GL.STATIC_DRAW);

  ////Matahari Start
  // Matahari Bulat
  var matahariBulat = generateBall(-1.6, 1.3, -1, 0.35, 50, [255 / 255, 214 / 255, 79 / 255]); // matahari: x, y, z, radius, segments, warna
  var matahariBulat_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, matahariBulat_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(matahariBulat.vertices), GL.STATIC_DRAW);
  var matahariBulat_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, matahariBulat_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(matahariBulat.colors), GL.STATIC_DRAW);
  var matahariBulat_faces = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, matahariBulat_faces);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(matahariBulat.faces), GL.STATIC_DRAW);

  // Matahari Cone 1
  var matahariCone1 = generateEllipticParboloid(-1.6, 1.9, -1, 0.07, 50, 0, 0, 0, [255 / 255, 180 / 255, 50 / 255]); // matahari: x, y, z, radius, segments, rotationX, rotationY, rotationZ, warna
  var matahariCone1_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, matahariCone1_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(matahariCone1.vertices), GL.STATIC_DRAW);
  var matahariCone1_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, matahariCone1_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(matahariCone1.colors), GL.STATIC_DRAW);
  var matahariCone1_faces = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, matahariCone1_faces);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(matahariCone1.faces), GL.STATIC_DRAW);

  // Matahari Cone 2
  var matahariCone2 = generateEllipticParboloid(-1.17, 1.73, -1, 0.07, 50, 0, 0, -Math.PI / 4, [255 / 255, 180 / 255, 50 / 255]);
  var matahariCone2_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, matahariCone2_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(matahariCone2.vertices), GL.STATIC_DRAW);
  var matahariCone2_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, matahariCone2_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(matahariCone2.colors), GL.STATIC_DRAW);
  var matahariCone2_faces = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, matahariCone2_faces);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(matahariCone2.faces), GL.STATIC_DRAW);

  // Matahari Cone 3
  var matahariCone3 = generateEllipticParboloid(-1, 1.3, -1, 0.07, 50, 0, 0, -Math.PI / 2, [255 / 255, 180 / 255, 50 / 255]);
  var matahariCone3_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, matahariCone3_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(matahariCone3.vertices), GL.STATIC_DRAW);
  var matahariCone3_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, matahariCone3_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(matahariCone3.colors), GL.STATIC_DRAW);
  var matahariCone3_faces = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, matahariCone3_faces);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(matahariCone3.faces), GL.STATIC_DRAW);

  // Matahari Cone 4
  var matahariCone4 = generateEllipticParboloid(-1.17, 0.9, -1, 0.07, 50, 0, 0, (-3 * Math.PI) / 4, [255 / 255, 180 / 255, 50 / 255]);
  var matahariCone4_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, matahariCone4_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(matahariCone4.vertices), GL.STATIC_DRAW);
  var matahariCone4_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, matahariCone4_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(matahariCone4.colors), GL.STATIC_DRAW);
  var matahariCone4_faces = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, matahariCone4_faces);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(matahariCone4.faces), GL.STATIC_DRAW);

  // Matahari Cone 5
  var matahariCone5 = generateEllipticParboloid(-1.6, 0.7, -1, 0.07, 50, 0, 0, Math.PI, [255 / 255, 180 / 255, 50 / 255]);
  var matahariCone5_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, matahariCone5_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(matahariCone5.vertices), GL.STATIC_DRAW);
  var matahariCone5_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, matahariCone5_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(matahariCone5.colors), GL.STATIC_DRAW);
  var matahariCone5_faces = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, matahariCone5_faces);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(matahariCone5.faces), GL.STATIC_DRAW);

  // Matahari Cone 6
  var matahariCone6 = generateEllipticParboloid(-2.05, 0.9, -1, 0.07, 50, 0, 0, (3 * Math.PI) / 4, [255 / 255, 180 / 255, 50 / 255]);
  var matahariCone6_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, matahariCone6_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(matahariCone6.vertices), GL.STATIC_DRAW);
  var matahariCone6_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, matahariCone6_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(matahariCone6.colors), GL.STATIC_DRAW);
  var matahariCone6_faces = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, matahariCone6_faces);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(matahariCone6.faces), GL.STATIC_DRAW);

  // Matahari Cone 7
  var matahariCone7 = generateEllipticParboloid(-2.2, 1.3, -1, 0.07, 50, 0, 0, Math.PI / 2, [255 / 255, 180 / 255, 50 / 255]);
  var matahariCone7_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, matahariCone7_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(matahariCone7.vertices), GL.STATIC_DRAW);
  var matahariCone7_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, matahariCone7_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(matahariCone7.colors), GL.STATIC_DRAW);
  var matahariCone7_faces = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, matahariCone7_faces);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(matahariCone7.faces), GL.STATIC_DRAW);

  // Matahari Cone 8
  var matahariCone8 = generateEllipticParboloid(-2.05, 1.73, -1, 0.07, 50, 0, 0, Math.PI / 4, [255 / 255, 180 / 255, 50 / 255]);
  var matahariCone8_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, matahariCone8_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(matahariCone8.vertices), GL.STATIC_DRAW);
  var matahariCone8_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, matahariCone8_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(matahariCone8.colors), GL.STATIC_DRAW);
  var matahariCone8_faces = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, matahariCone8_faces);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(matahariCone8.faces), GL.STATIC_DRAW);

  // Matahari Mata Kanan
  var matahari_mataKanan = generateEllipsoid(-1.7, 1.3, -0.68, 0.04, 50, 1.3, 0, 0, Math.PI / 4, [0 / 255, 0 / 255, 0 / 255]); // matahari: x, y, z, radius, segments, ovalY, rotationX, rotationY, rotationZ, warna
  var matahari_mataKanan_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, matahari_mataKanan_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(matahari_mataKanan.vertices), GL.STATIC_DRAW);
  var matahari_mataKanan_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, matahari_mataKanan_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(matahari_mataKanan.colors), GL.STATIC_DRAW);
  var matahari_mataKanan_faces = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, matahari_mataKanan_faces);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(matahari_mataKanan.faces), GL.STATIC_DRAW);

  // Matahari Mata Kiri
  var matahari_mataKiri = generateEllipsoid(-1.5, 1.3, -0.68, 0.04, 50, 1.3, 0, 0, Math.PI / 4, [0 / 255, 0 / 255, 0 / 255]);
  var matahari_mataKiri_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, matahari_mataKiri_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(matahari_mataKiri.vertices), GL.STATIC_DRAW);
  var matahari_mataKiri_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, matahari_mataKiri_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(matahari_mataKiri.colors), GL.STATIC_DRAW);
  var matahari_mataKiri_faces = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, matahari_mataKiri_faces);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(matahari_mataKiri.faces), GL.STATIC_DRAW);
  ////Matahari End

  //Kotak Kain piknik
  var kainPiknik = generateKotak(-0.4, 1.4, -1, -0.88, 0.5, 1.7, 50, [0.3, 0, 0]);
  var kainPiknik_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, kainPiknik_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(kainPiknik.vertices), GL.STATIC_DRAW);
  var kainPiknik_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, kainPiknik_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(kainPiknik.colors), GL.STATIC_DRAW);
  var kainPiknik_ebo = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, kainPiknik_ebo);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(kainPiknik.faces), GL.STATIC_DRAW);

  ////Kado-kado Start
  //Kotak Kado 1
  var kotakKado1 = generateKotak(-1.1, -0.5, -1, -0.4, -0.8, -0.2, 50, [0, 0, 1]);
  var kotakKado1_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, kotakKado1_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(kotakKado1.vertices), GL.STATIC_DRAW);
  var kotakKado1_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, kotakKado1_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(kotakKado1.colors), GL.STATIC_DRAW);
  var kotakKado1_ebo = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, kotakKado1_ebo);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(kotakKado1.faces), GL.STATIC_DRAW);

  // Tutup Kotak Kado 1
  var TutupkotakKado1 = generateKotak(-1.125, -0.475, -0.45, -0.3, -0.825, -0.175, 50, [1, 0, 1]);
  var TutupkotakKado1_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, TutupkotakKado1_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(TutupkotakKado1.vertices), GL.STATIC_DRAW);
  var TutupkotakKado1_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, TutupkotakKado1_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(TutupkotakKado1.colors), GL.STATIC_DRAW);
  var TutupkotakKado1_ebo = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TutupkotakKado1_ebo);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(TutupkotakKado1.faces), GL.STATIC_DRAW);

  //Kotak Kado 2
  var kotakKado2 = generateKotak(-1.6, -1.1, -1, -0.5, -0.65, -0.1, 50, [0.5, 0.5, 0.5]);
  var kotakKado2_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, kotakKado2_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(kotakKado2.vertices), GL.STATIC_DRAW);
  var kotakKado2_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, kotakKado2_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(kotakKado2.colors), GL.STATIC_DRAW);
  var kotakKado2_ebo = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, kotakKado2_ebo);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(kotakKado2.faces), GL.STATIC_DRAW);

  //Kotak Kado 3
  var kotakKado3 = generateKotak(-1.45, -1.18, -0.5, -0.17, -0.6, -0.3, 50, [1, 0, 0]);
  var kotakKado3_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, kotakKado3_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(kotakKado3.vertices), GL.STATIC_DRAW);
  var kotakKado3_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, kotakKado3_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(kotakKado3.colors), GL.STATIC_DRAW);
  var kotakKado3_ebo = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, kotakKado3_ebo);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(kotakKado3.faces), GL.STATIC_DRAW);

  //Kotak Kado 4
  var kotakKado4 = generateKotak(-0.47, 0, -1, -0.6, -0.65, -0.15, 50, [0.5, 0.5, 0.5]);
  var kotakKado4_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, kotakKado4_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(kotakKado4.vertices), GL.STATIC_DRAW);
  var kotakKado4_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, kotakKado4_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(kotakKado4.colors), GL.STATIC_DRAW);
  var kotakKado4_ebo = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, kotakKado4_ebo);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(kotakKado4.faces), GL.STATIC_DRAW);

  //Kotak Kado 5
  var kotakKado5 = generateKotak(-0.4, -0.03, -0.7, -0.45, -0.35, -0.6, 50, [1, 1, 0]);
  var kotakKado5_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, kotakKado5_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(kotakKado5.vertices), GL.STATIC_DRAW);
  var kotakKado5_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, kotakKado5_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(kotakKado5.colors), GL.STATIC_DRAW);
  var kotakKado5_ebo = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, kotakKado5_ebo);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(kotakKado5.faces), GL.STATIC_DRAW);

  //Kotak Kado 6
  var kotakKado6 = generateKotak(-1.2, -0.8, -1, -0.7, -0.1, 0.25, 50, [0, 0, 0]);
  var kotakKado6_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, kotakKado6_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(kotakKado6.vertices), GL.STATIC_DRAW);
  var kotakKado6_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, kotakKado6_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(kotakKado6.colors), GL.STATIC_DRAW);
  var kotakKado6_ebo = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, kotakKado6_ebo);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(kotakKado6.faces), GL.STATIC_DRAW);

  //Kotak Kado 7
  var kotakKado7 = generateKotak(-0.6, -0.25, -1, -0.6, -0.15, 0.15, 50, [0, 0.5, 0.6]);
  var kotakKado7_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, kotakKado7_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(kotakKado7.vertices), GL.STATIC_DRAW);
  var kotakKado7_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, kotakKado7_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(kotakKado7.colors), GL.STATIC_DRAW);
  var kotakKado7_ebo = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, kotakKado7_ebo);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(kotakKado7.faces), GL.STATIC_DRAW);

  ////Kado-kado End

  // inisialisasi awan
  // bola 1
  var awan1_1 = generateBall(0, 2.1, -1, 0.2, 50, [209 / 255, 210 / 255, 212 / 255]);
  var awan1_1_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, awan1_1_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(awan1_1.vertices), GL.STATIC_DRAW);
  var awan1_1_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, awan1_1_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(awan1_1.colors), GL.STATIC_DRAW);
  var awan1_1_ebo = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, awan1_1_ebo);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(awan1_1.faces), GL.STATIC_DRAW);

  // bola 2
  var awan1_2 = generateBall(-0.6, 1.6, -1, 0.2, 50, [209 / 255, 210 / 255, 212 / 255]);
  var awan1_2_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, awan1_2_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(awan1_2.vertices), GL.STATIC_DRAW);
  var awan1_2_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, awan1_2_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(awan1_2.colors), GL.STATIC_DRAW);
  var awan1_2_ebo = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, awan1_2_ebo);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(awan1_2.faces), GL.STATIC_DRAW);

  // bola 3
  var awan1_3 = generateBall(0.6, 1.6, -1, 0.2, 50, [209 / 255, 210 / 255, 212 / 255]);
  var awan1_3_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, awan1_3_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(awan1_3.vertices), GL.STATIC_DRAW);
  var awan1_3_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, awan1_3_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(awan1_3.colors), GL.STATIC_DRAW);
  var awan1_3_ebo = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, awan1_3_ebo);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(awan1_3.faces), GL.STATIC_DRAW);

  // bola 4
  var awan1_4 = generateBall(0, 1.8, -1, 0.3, 50, [209 / 255, 210 / 255, 212 / 255]);
  var awan1_4_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, awan1_4_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(awan1_4.vertices), GL.STATIC_DRAW);
  var awan1_4_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, awan1_4_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(awan1_4.colors), GL.STATIC_DRAW);
  var awan1_4_ebo = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, awan1_4_ebo);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(awan1_4.faces), GL.STATIC_DRAW);

  // bola 5
  var awan1_5 = generateBall(-0.2, 2, -1, 0.2, 50, [209 / 255, 210 / 255, 212 / 255]);
  var awan1_5_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, awan1_5_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(awan1_5.vertices), GL.STATIC_DRAW);
  var awan1_5_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, awan1_5_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(awan1_5.colors), GL.STATIC_DRAW);
  var awan1_5_ebo = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, awan1_5_ebo);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(awan1_5.faces), GL.STATIC_DRAW);

  // bola 6
  var awan1_6 = generateBall(0.2, 2, -1, 0.2, 50, [209 / 255, 210 / 255, 212 / 255]);
  var awan1_6_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, awan1_6_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(awan1_6.vertices), GL.STATIC_DRAW);
  var awan1_6_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, awan1_6_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(awan1_6.colors), GL.STATIC_DRAW);
  var awan1_6_ebo = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, awan1_6_ebo);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(awan1_6.faces), GL.STATIC_DRAW);

  // bola 7
  var awan1_7 = generateBall(-0.2, 1.5, -1, 0.2, 50, [209 / 255, 210 / 255, 212 / 255]);
  var awan1_7_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, awan1_7_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(awan1_7.vertices), GL.STATIC_DRAW);
  var awan1_7_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, awan1_7_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(awan1_7.colors), GL.STATIC_DRAW);
  var awan1_7_ebo = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, awan1_7_ebo);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(awan1_7.faces), GL.STATIC_DRAW);

  // bola 8
  var awan1_8 = generateBall(0.2, 1.5, -1, 0.2, 50, [209 / 255, 210 / 255, 212 / 255]);
  var awan1_8_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, awan1_8_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(awan1_8.vertices), GL.STATIC_DRAW);
  var awan1_8_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, awan1_8_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(awan1_8.colors), GL.STATIC_DRAW);
  var awan1_8_ebo = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, awan1_8_ebo);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(awan1_8.faces), GL.STATIC_DRAW);

  // bola 9
  var awan1_9 = generateBall(0, 1.5, -0.7, 0.2, 50, [209 / 255, 210 / 255, 212 / 255]);
  var awan1_9_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, awan1_9_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(awan1_9.vertices), GL.STATIC_DRAW);
  var awan1_9_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, awan1_9_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(awan1_9.colors), GL.STATIC_DRAW);
  var awan1_9_ebo = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, awan1_9_ebo);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(awan1_9.faces), GL.STATIC_DRAW);

  // bola 10
  var awan1_10 = generateBall(-0.4, 1.8, -0.8, 0.2, 50, [209 / 255, 210 / 255, 212 / 255]);
  var awan1_10_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, awan1_10_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(awan1_10.vertices), GL.STATIC_DRAW);
  var awan1_10_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, awan1_10_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(awan1_10.colors), GL.STATIC_DRAW);
  var awan1_10_ebo = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, awan1_10_ebo);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(awan1_10.faces), GL.STATIC_DRAW);

  //bola 11
  var awan1_11 = generateBall(0.4, 1.8, -0.8, 0.2, 50, [209 / 255, 210 / 255, 212 / 255]);
  var awan1_11_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, awan1_11_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(awan1_11.vertices), GL.STATIC_DRAW);
  var awan1_11_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, awan1_11_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(awan1_11.colors), GL.STATIC_DRAW);
  var awan1_11_ebo = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, awan1_11_ebo);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(awan1_11.faces), GL.STATIC_DRAW);

  // bola 12
  var awan1_12 = generateBall(-0.3, 1.5, -0.8, 0.2, 50, [209 / 255, 210 / 255, 212 / 255]);
  var awan1_12_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, awan1_12_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(awan1_12.vertices), GL.STATIC_DRAW);
  var awan1_12_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, awan1_12_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(awan1_12.colors), GL.STATIC_DRAW);
  var awan1_12_ebo = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, awan1_12_ebo);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(awan1_12.faces), GL.STATIC_DRAW);

  // bola 13
  var awan1_13 = generateBall(0.3, 1.5, -0.8, 0.2, 50, [209 / 255, 210 / 255, 212 / 255]);
  var awan1_13_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, awan1_13_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(awan1_13.vertices), GL.STATIC_DRAW);
  var awan1_13_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, awan1_13_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(awan1_13.colors), GL.STATIC_DRAW);
  var awan1_13_ebo = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, awan1_13_ebo);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(awan1_13.faces), GL.STATIC_DRAW);

  // bola 14
  var awan1_14 = generateBall(-0.4, 1.8, -1.2, 0.2, 50, [209 / 255, 210 / 255, 212 / 255]);
  var awan1_14_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, awan1_14_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(awan1_14.vertices), GL.STATIC_DRAW);
  var awan1_14_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, awan1_14_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(awan1_14.colors), GL.STATIC_DRAW);
  var awan1_14_ebo = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, awan1_14_ebo);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(awan1_14.faces), GL.STATIC_DRAW);

  // bola 15
  var awan1_15 = generateBall(0.4, 1.8, -1.2, 0.2, 50, [209 / 255, 210 / 255, 212 / 255]);
  var awan1_15_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, awan1_15_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(awan1_15.vertices), GL.STATIC_DRAW);
  var awan1_15_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, awan1_15_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(awan1_15.colors), GL.STATIC_DRAW);
  var awan1_15_ebo = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, awan1_15_ebo);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(awan1_15.faces), GL.STATIC_DRAW);

  // bola 16
  var awan1_16 = generateBall(-0.3, 1.5, -1.2, 0.2, 50, [209 / 255, 210 / 255, 212 / 255]);
  var awan1_16_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, awan1_16_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(awan1_16.vertices), GL.STATIC_DRAW);
  var awan1_16_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, awan1_16_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(awan1_16.colors), GL.STATIC_DRAW);
  var awan1_16_ebo = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, awan1_16_ebo);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(awan1_16.faces), GL.STATIC_DRAW);

  // bola 17
  var awan1_17 = generateBall(0.3, 1.5, -1.2, 0.2, 50, [209 / 255, 210 / 255, 212 / 255]);
  var awan1_17_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, awan1_17_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(awan1_17.vertices), GL.STATIC_DRAW);
  var awan1_17_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, awan1_17_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(awan1_17.colors), GL.STATIC_DRAW);
  var awan1_17_ebo = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, awan1_17_ebo);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(awan1_17.faces), GL.STATIC_DRAW);

  // bola 18
  var awan1_18 = generateBall(0, 1.5, -1.3, 0.2, 50, [209 / 255, 210 / 255, 212 / 255]);
  var awan1_18_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, awan1_18_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(awan1_18.vertices), GL.STATIC_DRAW);
  var awan1_18_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, awan1_18_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(awan1_18.colors), GL.STATIC_DRAW);
  var awan1_18_ebo = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, awan1_18_ebo);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(awan1_18.faces), GL.STATIC_DRAW);

  ////pohon start
  //batang pohon 1
  //batang :xmin, x, ymin, y, zmin, z, segments, warna
  var batang = generateKotak(1, 1.25, -0.9, -0.4, -2, -1.70, 50, [108/255, 60/255, 12/255]);
  var batang_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, batang_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(batang.vertices), GL.STATIC_DRAW);
  var batang_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, batang_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(batang.colors), GL.STATIC_DRAW);
  var batang_ebo = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, batang_ebo);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(batang.faces), GL.STATIC_DRAW);

  // batang pohon 2
  //batang : xmin, x, ymin, y, zmin, z, segments, warna
  var batang1 = generateKotak(1.75, 2, -0.9, -0.4, -0.80, -1.05, 50, [108/255, 60/255, 12/255]);
  var batang1_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, batang1_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(batang1.vertices), GL.STATIC_DRAW);
  var batang1_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, batang1_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(batang1.colors), GL.STATIC_DRAW);
  var batang1_ebo = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, batang1_ebo);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(batang1.faces), GL.STATIC_DRAW);

// Daun Cone Bawah Pohon 1
// daun: x, y, z, radius, segments, rotationX, rotationY, rotationZ
var daunCone1 = generateEllipticParboloid(1.13, 0.30, -1.85, 0.30, 50, 0, 0, 0, [27 / 255, 146 / 255, 27 / 255]); 
var daunCone1_vbo = GL.createBuffer();
GL.bindBuffer(GL.ARRAY_BUFFER, daunCone1_vbo);
GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(daunCone1.vertices), GL.STATIC_DRAW);
var daunCone1_color = GL.createBuffer();
GL.bindBuffer(GL.ARRAY_BUFFER, daunCone1_color);
GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(daunCone1.colors), GL.STATIC_DRAW);
var daunCone1_faces = GL.createBuffer();
GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, daunCone1_faces);
GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(daunCone1.faces), GL.STATIC_DRAW);

// Daun Cone Atas Pohon 1
// daun: x, y, z, radius, segments, rotationX, rotationY, rotationZ
var daunCone2 = generateEllipticParboloid(1.13, 0.90, -1.85, 0.30, 50, 0, 0, 0, [27 / 255, 146 / 255, 27 / 255]); 
var daunCone2_vbo = GL.createBuffer();
GL.bindBuffer(GL.ARRAY_BUFFER, daunCone2_vbo);
GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(daunCone2.vertices), GL.STATIC_DRAW);
var daunCone2_color = GL.createBuffer();
GL.bindBuffer(GL.ARRAY_BUFFER, daunCone2_color);
GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(daunCone2.colors), GL.STATIC_DRAW);
var daunCone2_faces = GL.createBuffer();
GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, daunCone2_faces);
GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(daunCone2.faces), GL.STATIC_DRAW);

// Daun Cone Bawah Pohon 2
// daun: x, y, z, radius, segments, rotationX, rotationY, rotationZ
var daunCone3 = generateEllipticParboloid(1.89, 0.35, -0.90, 0.30, 50, 0, 0, 0, [27 / 255, 146 / 255, 27 / 255]); 
var daunCone3_vbo = GL.createBuffer();
GL.bindBuffer(GL.ARRAY_BUFFER, daunCone3_vbo);
GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(daunCone3.vertices), GL.STATIC_DRAW);
var daunCone3_color = GL.createBuffer();
GL.bindBuffer(GL.ARRAY_BUFFER, daunCone3_color);
GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(daunCone3.colors), GL.STATIC_DRAW);
var daunCone3_faces = GL.createBuffer();
GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, daunCone3_faces);
GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(daunCone3.faces), GL.STATIC_DRAW);

// Daun Cone Atas Pohon 2
// daun: x, y, z, radius, segments, rotationX, rotationY, rotationZ
var daunCone4 = generateEllipticParboloid(1.89, 0.90, -0.90, 0.30, 50, 0, 0, 0, [27 / 255, 146 / 255, 27 / 255]); 
var daunCone4_vbo = GL.createBuffer();
GL.bindBuffer(GL.ARRAY_BUFFER, daunCone4_vbo);
GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(daunCone4.vertices), GL.STATIC_DRAW);
var daunCone4_color = GL.createBuffer();
GL.bindBuffer(GL.ARRAY_BUFFER, daunCone4_color);
GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(daunCone4.colors), GL.STATIC_DRAW);
var daunCone4_faces = GL.createBuffer();
GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, daunCone4_faces);
GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(daunCone4.faces), GL.STATIC_DRAW);

////pohon end

  //matrix
  var PROJECTION_MATRIX = LIBS.get_projection(40, CANVAS.width / CANVAS.height, 1, 100);
  var VIEW_MATRIX = LIBS.get_I4();
  var MODEL_MATRIX = LIBS.get_I4();
  // LIBS.rotateX(MODEL_MATRIX, Math.PI);

  // Event listener untuk mouse movement
  document.addEventListener('mousemove', function (event) {
    if (isMouseDown) {
      var sensitivity = 0.01; // Adjust sensitivity here
      var dx = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
      var dy = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

      mouseX += dx * sensitivity;
      mouseY += dy * sensitivity;

      updateViewMatrix();
    }
  });
  // Event listener untuk mouse down
  document.addEventListener('mousedown', function (event) {
    isMouseDown = true;
    updateViewMatrix();
  });
  // Event listener untuk mouse up
  document.addEventListener('mouseup', function (event) {
    isMouseDown = false;
  });
  function updateViewMatrix() {
    var sensitivity = 0.001; // Adjust sensitivity here
    var dx = mouseX - prevMouseX;
    var dy = mouseY - prevMouseY;
    // Rotate the view matrix based on mouse movement
    LIBS.rotateY(VIEW_MATRIX, dx);
    LIBS.rotateX(VIEW_MATRIX, dy);
    prevMouseX = mouseX;
    prevMouseY = mouseY;
  }

  // Set view matrix to position the camera
  LIBS.translateZ(VIEW_MATRIX, -7);
  var zoomSpeed = 0.2; // Kecepatan zoom
  // Event listener untuk scroll mouse
  document.addEventListener('wheel', function (event) {
    // Menentukan arah scroll
    var delta = Math.max(-1, Math.min(1, event.wheelDelta || -event.detail));
    // Mengubah posisi kamera berdasarkan arah scroll
    LIBS.translateZ(VIEW_MATRIX, delta * zoomSpeed);
    // Memastikan kamera tidak terlalu dekat atau terlalu jauh
    if (VIEW_MATRIX[14] < -20) {
      VIEW_MATRIX[14] = -20;
    }
    if (VIEW_MATRIX[14] > -1) {
      VIEW_MATRIX[14] = -1;
    }
  });

  document.addEventListener('keydown', function (event) {
    var keyCode = event.keyCode;
    if (keyCode === 87) {
      // W key
      keysPressed.w = true;
    } else if (keyCode === 65) {
      // A key
      keysPressed.a = true;
    } else if (keyCode === 83) {
      // S key
      keysPressed.s = true;
    } else if (keyCode === 68) {
      // D key
      keysPressed.d = true;
    }
  });

  document.addEventListener('keyup', function (event) {
    var keyCode = event.keyCode;
    if (keyCode === 87) {
      // W key
      keysPressed.w = false;
    } else if (keyCode === 65) {
      // A key
      keysPressed.a = false;
    } else if (keyCode === 83) {
      // S key
      keysPressed.s = false;
    } else if (keyCode === 68) {
      // D key
      keysPressed.d = false;
    }
  });

  /*========================= DRAWING ========================= */
  GL.clearColor(0.0, 0.0, 1.0, 0.0);

  GL.enable(GL.DEPTH_TEST);
  GL.depthFunc(GL.LEQUAL);

  var cameraSpeed = 0.4; // Kecepatan pergerakan kamera

  var time_prev = 0;
  var animate = function (time) {
    GL.viewport(0, 0, CANVAS.width, CANVAS.height);
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

    var dt = time - time_prev;
    time_prev = time;

    if (keysPressed.w) {
      LIBS.translateZ(VIEW_MATRIX, cameraSpeed);
    }
    if (keysPressed.a) {
      LIBS.translateX(VIEW_MATRIX, cameraSpeed);
    }
    if (keysPressed.s) {
      LIBS.translateZ(VIEW_MATRIX, -cameraSpeed);
    }
    if (keysPressed.d) {
      LIBS.translateX(VIEW_MATRIX, -cameraSpeed);
    }

    // Base World
    GL.bindBuffer(GL.ARRAY_BUFFER, baseWorld_vbo);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, baseWorld_color);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, baseWorld_ebo);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    GL.drawElements(GL.TRIANGLES, baseWorld.faces.length, GL.UNSIGNED_SHORT, 0);

    ////Matahari Start
    // Matahari Bulat
    GL.bindBuffer(GL.ARRAY_BUFFER, matahariBulat_vbo);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, matahariBulat_color);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, matahariBulat_faces);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    GL.drawElements(GL.TRIANGLES, matahariBulat.faces.length, GL.UNSIGNED_SHORT, 0);

    // Matahari Cone1
    GL.bindBuffer(GL.ARRAY_BUFFER, matahariCone1_vbo);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, matahariCone1_color);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, matahariCone1_faces);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    GL.drawElements(GL.TRIANGLES, matahariCone1.faces.length, GL.UNSIGNED_SHORT, 0);

    // Matahari Cone2
    GL.bindBuffer(GL.ARRAY_BUFFER, matahariCone2_vbo);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, matahariCone2_color);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, matahariCone2_faces);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    GL.drawElements(GL.TRIANGLES, matahariCone2.faces.length, GL.UNSIGNED_SHORT, 0);

    // Matahari Cone3
    GL.bindBuffer(GL.ARRAY_BUFFER, matahariCone3_vbo);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, matahariCone3_color);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, matahariCone3_faces);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    GL.drawElements(GL.TRIANGLES, matahariCone3.faces.length, GL.UNSIGNED_SHORT, 0);

    // Matahari Cone4
    GL.bindBuffer(GL.ARRAY_BUFFER, matahariCone4_vbo);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, matahariCone4_color);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, matahariCone4_faces);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    GL.drawElements(GL.TRIANGLES, matahariCone4.faces.length, GL.UNSIGNED_SHORT, 0);

    // Matahari Cone5
    GL.bindBuffer(GL.ARRAY_BUFFER, matahariCone5_vbo);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, matahariCone5_color);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, matahariCone5_faces);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    GL.drawElements(GL.TRIANGLES, matahariCone5.faces.length, GL.UNSIGNED_SHORT, 0);

    // Matahari Cone6
    GL.bindBuffer(GL.ARRAY_BUFFER, matahariCone6_vbo);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, matahariCone6_color);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, matahariCone6_faces);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    GL.drawElements(GL.TRIANGLES, matahariCone6.faces.length, GL.UNSIGNED_SHORT, 0);

    // Matahari Cone7
    GL.bindBuffer(GL.ARRAY_BUFFER, matahariCone7_vbo);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, matahariCone7_color);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, matahariCone7_faces);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    GL.drawElements(GL.TRIANGLES, matahariCone7.faces.length, GL.UNSIGNED_SHORT, 0);

    // Matahari Cone8
    GL.bindBuffer(GL.ARRAY_BUFFER, matahariCone8_vbo);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, matahariCone8_color);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, matahariCone8_faces);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    GL.drawElements(GL.TRIANGLES, matahariCone8.faces.length, GL.UNSIGNED_SHORT, 0);

    // Mata Kanan
    GL.bindBuffer(GL.ARRAY_BUFFER, matahari_mataKanan_vbo);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, matahari_mataKanan_color);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, matahari_mataKanan_faces);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    GL.drawElements(GL.TRIANGLES, matahari_mataKanan.faces.length, GL.UNSIGNED_SHORT, 0);

    // Mata Kiri
    GL.bindBuffer(GL.ARRAY_BUFFER, matahari_mataKiri_vbo);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, matahari_mataKiri_color);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, matahari_mataKiri_faces);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    GL.drawElements(GL.TRIANGLES, matahari_mataKiri.faces.length, GL.UNSIGNED_SHORT, 0);
    ////Matahari End

    // Kain Piknik
    GL.bindBuffer(GL.ARRAY_BUFFER, kainPiknik_vbo);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, kainPiknik_color);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, kainPiknik_ebo);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    GL.drawElements(GL.TRIANGLES, kainPiknik.faces.length, GL.UNSIGNED_SHORT, 0);

    ////Kado-kado Start
    // Kotak Kado1
    GL.bindBuffer(GL.ARRAY_BUFFER, kotakKado1_vbo);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, kotakKado1_color);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, kotakKado1_ebo);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    GL.drawElements(GL.TRIANGLES, kotakKado1.faces.length, GL.UNSIGNED_SHORT, 0);

    // Tutup Kotak Kado1
    GL.bindBuffer(GL.ARRAY_BUFFER, TutupkotakKado1_vbo);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, TutupkotakKado1_color);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TutupkotakKado1_ebo);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    GL.drawElements(GL.TRIANGLES, TutupkotakKado1.faces.length, GL.UNSIGNED_SHORT, 0);

    // Kotak Kado2
    GL.bindBuffer(GL.ARRAY_BUFFER, kotakKado2_vbo);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, kotakKado2_color);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, kotakKado2_ebo);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    GL.drawElements(GL.TRIANGLES, kotakKado2.faces.length, GL.UNSIGNED_SHORT, 0);

    // Kotak Kado3
    GL.bindBuffer(GL.ARRAY_BUFFER, kotakKado3_vbo);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, kotakKado3_color);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, kotakKado3_ebo);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    GL.drawElements(GL.TRIANGLES, kotakKado3.faces.length, GL.UNSIGNED_SHORT, 0);

    // Kotak Kado4
    GL.bindBuffer(GL.ARRAY_BUFFER, kotakKado4_vbo);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, kotakKado4_color);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, kotakKado4_ebo);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    GL.drawElements(GL.TRIANGLES, kotakKado4.faces.length, GL.UNSIGNED_SHORT, 0);

    // Kotak Kado5
    GL.bindBuffer(GL.ARRAY_BUFFER, kotakKado5_vbo);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, kotakKado5_color);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, kotakKado5_ebo);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    GL.drawElements(GL.TRIANGLES, kotakKado5.faces.length, GL.UNSIGNED_SHORT, 0);

    // Kotak Kado6
    GL.bindBuffer(GL.ARRAY_BUFFER, kotakKado6_vbo);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, kotakKado6_color);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, kotakKado6_ebo);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    GL.drawElements(GL.TRIANGLES, kotakKado6.faces.length, GL.UNSIGNED_SHORT, 0);

    // Kotak Kado7
    GL.bindBuffer(GL.ARRAY_BUFFER, kotakKado7_vbo);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, kotakKado7_color);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, kotakKado7_ebo);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    GL.drawElements(GL.TRIANGLES, kotakKado7.faces.length, GL.UNSIGNED_SHORT, 0);

    ////Kado-kado End

    // awan start
    // bola1
    GL.bindBuffer(GL.ARRAY_BUFFER, awan1_1_vbo);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, awan1_1_color);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, awan1_1_ebo);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.drawElements(GL.TRIANGLES, awan1_1.faces.length, GL.UNSIGNED_SHORT, 0);

    // bola2
    GL.bindBuffer(GL.ARRAY_BUFFER, awan1_2_vbo);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, awan1_2_color);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, awan1_2_ebo);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.drawElements(GL.TRIANGLES, awan1_2.faces.length, GL.UNSIGNED_SHORT, 0);

    // bola3
    GL.bindBuffer(GL.ARRAY_BUFFER, awan1_3_vbo);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, awan1_3_color);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, awan1_3_ebo);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.drawElements(GL.TRIANGLES, awan1_3.faces.length, GL.UNSIGNED_SHORT, 0);

    // bola4
    GL.bindBuffer(GL.ARRAY_BUFFER, awan1_4_vbo);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, awan1_4_color);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, awan1_4_ebo);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.drawElements(GL.TRIANGLES, awan1_4.faces.length, GL.UNSIGNED_SHORT, 0);

    // bola5
    GL.bindBuffer(GL.ARRAY_BUFFER, awan1_5_vbo);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, awan1_5_color);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, awan1_5_ebo);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.drawElements(GL.TRIANGLES, awan1_5.faces.length, GL.UNSIGNED_SHORT, 0);

    // bola6
    GL.bindBuffer(GL.ARRAY_BUFFER, awan1_6_vbo);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, awan1_6_color);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, awan1_6_ebo);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.drawElements(GL.TRIANGLES, awan1_6.faces.length, GL.UNSIGNED_SHORT, 0);

    // bola7
    GL.bindBuffer(GL.ARRAY_BUFFER, awan1_7_vbo);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, awan1_7_color);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, awan1_7_ebo);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.drawElements(GL.TRIANGLES, awan1_7.faces.length, GL.UNSIGNED_SHORT, 0);

    // bola8
    GL.bindBuffer(GL.ARRAY_BUFFER, awan1_8_vbo);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, awan1_8_color);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, awan1_8_ebo);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.drawElements(GL.TRIANGLES, awan1_8.faces.length, GL.UNSIGNED_SHORT, 0);

    // bola9
    GL.bindBuffer(GL.ARRAY_BUFFER, awan1_9_vbo);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, awan1_9_color);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, awan1_9_ebo);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.drawElements(GL.TRIANGLES, awan1_9.faces.length, GL.UNSIGNED_SHORT, 0);

    // bola10
    GL.bindBuffer(GL.ARRAY_BUFFER, awan1_10_vbo);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, awan1_10_color);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, awan1_10_ebo);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.drawElements(GL.TRIANGLES, awan1_10.faces.length, GL.UNSIGNED_SHORT, 0);

    // bola11
    GL.bindBuffer(GL.ARRAY_BUFFER, awan1_11_vbo);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, awan1_11_color);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, awan1_11_ebo);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.drawElements(GL.TRIANGLES, awan1_11.faces.length, GL.UNSIGNED_SHORT, 0);

    // bola12
    GL.bindBuffer(GL.ARRAY_BUFFER, awan1_12_vbo);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, awan1_12_color);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, awan1_12_ebo);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.drawElements(GL.TRIANGLES, awan1_12.faces.length, GL.UNSIGNED_SHORT, 0);

    // bola13
    GL.bindBuffer(GL.ARRAY_BUFFER, awan1_13_vbo);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, awan1_13_color);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, awan1_13_ebo);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.drawElements(GL.TRIANGLES, awan1_13.faces.length, GL.UNSIGNED_SHORT, 0);

    // bola14
    GL.bindBuffer(GL.ARRAY_BUFFER, awan1_14_vbo);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, awan1_14_color);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, awan1_14_ebo);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.drawElements(GL.TRIANGLES, awan1_14.faces.length, GL.UNSIGNED_SHORT, 0);

    // bola15
    GL.bindBuffer(GL.ARRAY_BUFFER, awan1_15_vbo);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, awan1_15_color);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, awan1_15_ebo);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.drawElements(GL.TRIANGLES, awan1_15.faces.length, GL.UNSIGNED_SHORT, 0);

    // bola16
    GL.bindBuffer(GL.ARRAY_BUFFER, awan1_16_vbo);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, awan1_16_color);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, awan1_16_ebo);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.drawElements(GL.TRIANGLES, awan1_16.faces.length, GL.UNSIGNED_SHORT, 0);

    // bola17
    GL.bindBuffer(GL.ARRAY_BUFFER, awan1_17_vbo);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, awan1_17_color);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, awan1_17_ebo);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.drawElements(GL.TRIANGLES, awan1_17.faces.length, GL.UNSIGNED_SHORT, 0);

    // bola18
    GL.bindBuffer(GL.ARRAY_BUFFER, awan1_18_vbo);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, awan1_18_color);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, awan1_18_ebo);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.drawElements(GL.TRIANGLES, awan1_18.faces.length, GL.UNSIGNED_SHORT, 0);

    ////pohon start
    //batang pohon 1
    GL.bindBuffer(GL.ARRAY_BUFFER, batang_vbo);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, batang_color);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, batang_ebo);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    GL.drawElements(GL.TRIANGLES, batang.faces.length, GL.UNSIGNED_SHORT, 0);

    //batang pohon 2
    GL.bindBuffer(GL.ARRAY_BUFFER, batang1_vbo);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, batang1_color);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, batang1_ebo);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    GL.drawElements(GL.TRIANGLES, batang1.faces.length, GL.UNSIGNED_SHORT, 0);

    // daun Cone Bawah Pohon 1
    GL.bindBuffer(GL.ARRAY_BUFFER, daunCone1_vbo);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, daunCone1_color);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, daunCone1_faces);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    GL.drawElements(GL.TRIANGLES, daunCone1.faces.length, GL.UNSIGNED_SHORT, 0);

    // daun Cone Atas Pohon 1
    GL.bindBuffer(GL.ARRAY_BUFFER, daunCone2_vbo);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, daunCone2_color);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, daunCone2_faces);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    GL.drawElements(GL.TRIANGLES, daunCone2.faces.length, GL.UNSIGNED_SHORT, 0);

    // daun Cone Bawah Pohon 2
    GL.bindBuffer(GL.ARRAY_BUFFER, daunCone3_vbo);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, daunCone3_color);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, daunCone3_faces);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    GL.drawElements(GL.TRIANGLES, daunCone3.faces.length, GL.UNSIGNED_SHORT, 0);

    // daun Cone Atas Pohon 2
    GL.bindBuffer(GL.ARRAY_BUFFER, daunCone4_vbo);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, daunCone4_color);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, daunCone4_faces);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    GL.drawElements(GL.TRIANGLES, daunCone4.faces.length, GL.UNSIGNED_SHORT, 0);

    ////pohon end

    GL.flush();

    window.requestAnimationFrame(animate);
  };

  animate(0);
}

window.addEventListener('load', main);
