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

// normalize screen
function normalizeScreen(x, y, width, height) {
  var nx = (2 * x) / width - 1;
  var ny = (-2 * y) / height + 1;
  return [nx, ny];
}

// generate heart
function generateHead(x, y, z, radius, segments, rotationX, rotationY, rotationZ) {
  var vertices = [];
  var colors = [];

  var rainbowColors = [[209 / 255, 210 / 255, 212 / 255]];

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

// generate eyes
function generateEyes(x, y, z, radius, segments, scaleX, scaleY, scaleZ, rotationX, rotationY, rotationZ, warna) {
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

      var xCoord = cosLon * cosLat * scaleX;
      var yCoord = sinLon * cosLat * 1.5 * scaleY;
      var zCoord = sinLat * scaleZ;

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

// generate body parts
function generateBodyParts(x, y, z, radius, segments, scaleX, scaleY, scaleZ, rotationX, rotationY, rotationZ) {
  var vertices = [];
  var colors = [];

  var rainbowColors = [[75 / 255, 26 / 255, 4 / 255]];

  for (var i = 0; i <= segments; i++) {
    var latAngle = Math.PI * (-0.5 + i / segments);
    var sinLat = Math.sin(latAngle);
    var cosLat = Math.cos(latAngle);

    for (var j = 0; j <= segments; j++) {
      var lonAngle = 2 * Math.PI * (j / segments);
      var sinLon = Math.sin(lonAngle);
      var cosLon = Math.cos(lonAngle);

      var xCoord = cosLon * sinLat * scaleX;
      var yCoord = -cosLat * scaleY;
      var zCoord = sinLon * sinLat * scaleZ;

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

// generate badan
function generateBody(x, y, z, radius, height, segments) {
  var vertices = [];
  var colors = [];

  var rainbowColors = [[209 / 255, 210 / 255, 212 / 255]];

  for (var i = 0; i <= segments; i++) {
    var angle = 2 * Math.PI * (i / segments);
    var sinAngle = Math.sin(angle);
    var cosAngle = Math.cos(angle);

    for (var j = 0; j <= segments; j++) {
      var heightFraction = j / segments;
      var xCoord = radius * cosAngle;
      var zCoord = radius * sinAngle;
      var yCoord = height * heightFraction - height / 2;

      var vertexX = x + xCoord;
      var vertexY = y + yCoord;
      var vertexZ = z + zCoord;

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

// generate circle
function generateCircle(x, y, z, radius) {
  var vertices = [];
  var colors = [];

  var rainbowColors = [[209 / 255, 210 / 255, 212 / 255]];

  for (let i = 0; i < 360; i++) {
    var a = radius * Math.cos((i / 180) * Math.PI) + x;
    var b = radius * Math.sin((i / 180) * Math.PI) + z;
    vertices.push(a, -y / 2, b);

    var colorIndex = i % rainbowColors.length;
    colors = colors.concat(rainbowColors[colorIndex]);
  }

  var faces = [];
  for (let i = 1; i < vertices.length / 3 - 1; i++) {
    faces.push(0);
    faces.push(i);

    if (i == vertices.length / 3 - 1 - 1) {
      faces.push(1);
    } else faces.push(i + 1);
  }
  return { vertices: vertices, colors: colors, faces: faces };
}

// generate curves
function generateCurves(object, z, segments) {
  var vertices = [];
  var colors = [];

  var rainbowColors = [[0, 0, 0]];

  for (var i = 0; i <= segments; i++) {
    var t = i / segments;
    var x = Math.pow(1 - t, 3) * object[0][0] + 3 * Math.pow(1 - t, 2) * t * object[1][0] + 3 * (1 - t) * Math.pow(t, 2) * object[2][0] + Math.pow(t, 3) * object[3][0];
    var y = Math.pow(1 - t, 3) * object[0][1] + 3 * Math.pow(1 - t, 2) * t * object[1][1] + 3 * (1 - t) * Math.pow(t, 2) * object[2][1] + Math.pow(t, 3) * object[3][1];

    // Add vertices for the thicker lines
    vertices.push(x - 0.02, y - 0.02, z); // offset for thickness
    vertices.push(x + 0.02, y - 0.02, z);
    vertices.push(x, y + 0.02, z);

    for (var j = 0; j <= segments; j++) {
      var colorIndex = j % rainbowColors.length;
      colors = colors.concat(rainbowColors[colorIndex]);
    }
  }

  var faces = [];
  for (var i = 0; i < segments; i++) {
    var index = i * 3;
    faces.push(index, index + 1, index + 2); // create triangles for each vertex
  }

  return { vertices: vertices, colors: colors, faces: faces };
}

function main() {
  // setup
  var CANVAS = document.getElementById('myCanvas');
  CANVAS.width = window.innerWidth;
  CANVAS.height = window.innerHeight;

  //eventListener
  var mouseDown = function (e) {
    var coord = normalizeScreen(e.pageX, e.pageY, CANVAS.width, CANVAS.height);
    console.log(coord[0] + ', ' + coord[1]);
  };

  CANVAS.addEventListener('mousedown', mouseDown, false);

  // webgl setup
  var GL;
  try {
    GL = CANVAS.getContext('webgl', { antialias: true });
  } catch (e) {
    alert(e);
    return false;
  }

  // shaders
  var shader_vertex_source = `
    precision mediump float;
    attribute vec3 position;
    attribute vec3 color;
    
    uniform mat4 wMatrix;
    uniform mat4 vMatrix;
    uniform mat4 pMatrix;
    
    varying vec3 fragColor;
    void main(void) {
      fragColor = color;
      gl_Position = pMatrix * vMatrix * wMatrix * vec4(position, 1.);
    }`;

  var shader_fragment_source = `
    precision mediump float;
    
    varying vec3 fragColor;
    void main(void) {
      gl_FragColor = vec4(fragColor, 1.);
    }`;

  // compile shaders
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

  // program
  var SHADER_PROGRAM = GL.createProgram();
  GL.attachShader(SHADER_PROGRAM, shader_vertex);
  GL.attachShader(SHADER_PROGRAM, shader_fragment);

  GL.linkProgram(SHADER_PROGRAM);

  // object details
  var leftHead = generateHead(-0.7, 0.8, 0, 1.3, 50, 0, 0, 0);
  var rightHead = generateHead(0.7, 0.8, 0, 1.3, 50, 0, 0, 0);
  var leftEye = generateEyes(-0.55, 0.3, 1, 0.28, 50, 1, 1, 1, 0, 0, 0, [2 / 255, 147 / 255, 238 / 255]);
  var rightEye = generateEyes(0.55, 0.3, 1, 0.28, 50, 1, 1, 1, 0, 0, 0, [255 / 255, 47 / 255, 84 / 255]);
  var leftEyeHorizontal = generateEyes(-0.55, 0.2, 1.2, 0.15, 50, 0.2, 1, 1, 0, 0, 0, [0, 0, 0]);
  var leftEyeVertical = generateEyes(-0.55, 0.2, 1.2, 0.15, 50, 0.2, 1, 1, 0, 0, Math.PI / 2, [0, 0, 0]);
  var rightEyeHorizontal = generateEyes(0.55, 0.2, 1.2, 0.15, 50, 0.2, 1, 1, 0, 0, 0, [0, 0, 0]);
  var rightEyeVertical = generateEyes(0.55, 0.2, 1.2, 0.15, 50, 0.2, 1, 1, 0, 0, Math.PI / 2, [0, 0, 0]);
  var body = generateBody(0, 0, 0, 0.8, 2, 50, 0, 0, 0, 0.1, 50);
  var circle = generateCircle(0, 2, 0, 0.8);
  var leftHand = generateBodyParts(-0.6, -0.4, 0, 0.2, 50, 1.2, 4, 1.2, 0, 0, -1);
  var rightHand = generateBodyParts(0.6, -0.4, 0, 0.2, 50, 1.2, 4, 1.2, 0, 0, 1);
  var leftLeg = generateBodyParts(-0.35, -1, 0, 0.2, 50, 1.2, 2.5, 1.2, 0, 0, 0);
  var rightLeg = generateBodyParts(0.35, -1, 0, 0.2, 50, 1.2, 2.5, 1.2, 0, 0, 0);
  var mouth = generateCurves(
    [
      [-0.15, -0.1],
      [-0.12, -0.3],
      [0.12, -0.3],
      [0.15, -0.1],
    ],
    0.8,
    100
  );
  var leftEyebrow = generateCurves(
    [
      [-0.83, 0.7],
      [-0.73, 0.9],
      [-0.37, 0.9],
      [-0.27, 0.7],
    ],
    1.3,
    100
  );
  var rightEyebrow = generateCurves(
    [
      [0.27, 0.7],
      [0.37, 0.9],
      [0.73, 0.9],
      [0.83, 0.7],
    ],
    1.3,
    100
  );
  // end

  // vao
  var position_vao = GL.getAttribLocation(SHADER_PROGRAM, 'position');
  var color_vao = GL.getAttribLocation(SHADER_PROGRAM, 'color');
  GL.enableVertexAttribArray(position_vao);
  GL.enableVertexAttribArray(color_vao);
  GL.useProgram(SHADER_PROGRAM);

  // vbo
  // left head
  var leftHead_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, leftHead_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(leftHead.vertices), GL.STATIC_DRAW);
  var leftHead_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, leftHead_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(leftHead.colors), GL.STATIC_DRAW);

  // right head
  var rightHead_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, rightHead_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(rightHead.vertices), GL.STATIC_DRAW);
  var rightHead_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, rightHead_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(rightHead.colors), GL.STATIC_DRAW);

  // left eye
  var leftEye_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, leftEye_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(leftEye.vertices), GL.STATIC_DRAW);
  var leftEye_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, leftEye_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(leftEye.colors), GL.STATIC_DRAW);

  // right eye
  var rightEye_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, rightEye_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(rightEye.vertices), GL.STATIC_DRAW);
  var rightEye_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, rightEye_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(rightEye.colors), GL.STATIC_DRAW);

  // left eye horizontal
  var leftEyeHorizontal_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, leftEyeHorizontal_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(leftEyeHorizontal.vertices), GL.STATIC_DRAW);
  var leftEyeHorizontal_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, leftEyeHorizontal_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(leftEyeHorizontal.colors), GL.STATIC_DRAW);

  // right eye Horizontal
  var rightEyeHorizontal_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, rightEyeHorizontal_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(rightEyeHorizontal.vertices), GL.STATIC_DRAW);
  var rightEyeHorizontal_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, rightEyeHorizontal_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(rightEyeHorizontal.colors), GL.STATIC_DRAW);

  // left eye vertical
  var leftEyeVertical_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, leftEyeVertical_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(leftEyeVertical.vertices), GL.STATIC_DRAW);
  var leftEyeVertical_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, leftEyeVertical_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(leftEyeVertical.colors), GL.STATIC_DRAW);

  // right eye vertical
  var rightEyeVertical_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, rightEyeVertical_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(rightEyeVertical.vertices), GL.STATIC_DRAW);
  var rightEyeVertical_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, rightEyeVertical_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(rightEyeVertical.colors), GL.STATIC_DRAW);

  // body
  var body_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, body_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(body.vertices), GL.STATIC_DRAW);
  var body_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, body_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(body.colors), GL.STATIC_DRAW);

  // circle
  var circle_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, circle_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(circle.vertices), GL.STATIC_DRAW);
  var circle_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, circle_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(circle.colors), GL.STATIC_DRAW);

  // left hand
  var leftHand_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, leftHand_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(leftHand.vertices), GL.STATIC_DRAW);
  var leftHand_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, leftHand_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(leftHand.colors), GL.STATIC_DRAW);

  // right hand
  var rightHand_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, rightHand_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(rightHand.vertices), GL.STATIC_DRAW);
  var rightHand_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, rightHand_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(rightHand.colors), GL.STATIC_DRAW);

  // left leg
  var leftLeg_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, leftLeg_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(leftLeg.vertices), GL.STATIC_DRAW);
  var leftLeg_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, leftLeg_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(leftLeg.colors), GL.STATIC_DRAW);

  // right leg
  var rightLeg_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, rightLeg_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(rightLeg.vertices), GL.STATIC_DRAW);
  var rightLeg_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, rightLeg_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(rightLeg.colors), GL.STATIC_DRAW);

  // mouth
  var mouth_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, mouth_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(mouth.vertices), GL.STATIC_DRAW);
  var mouth_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, mouth_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(mouth.colors), GL.STATIC_DRAW);

  // leftEyebrow
  var leftEyebrow_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, leftEyebrow_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(leftEyebrow.vertices), GL.STATIC_DRAW);
  var leftEyebrow_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, leftEyebrow_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(leftEyebrow.colors), GL.STATIC_DRAW);

  // rightEyebrow
  var rightEyebrow_vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, rightEyebrow_vbo);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(rightEyebrow.vertices), GL.STATIC_DRAW);
  var rightEyebrow_color = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, rightEyebrow_color);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(rightEyebrow.colors), GL.STATIC_DRAW);

  // ebo
  // left head
  var leftHead_ebo = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, leftHead_ebo);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(leftHead.faces), GL.STATIC_DRAW);

  // right head
  var rightHead_ebo = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, rightHead_ebo);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(rightHead.faces), GL.STATIC_DRAW);

  // left eye
  var leftEye_ebo = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, leftEye_ebo);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(leftEye.faces), GL.STATIC_DRAW);

  // right eye
  var rightEye_ebo = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, rightEye_ebo);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(rightEye.faces), GL.STATIC_DRAW);

  // left eye horizontal
  var leftEyeHorizontal_ebo = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, leftEyeHorizontal_ebo);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(leftEyeHorizontal.faces), GL.STATIC_DRAW);

  // right eye horizontal
  var rightEyeHorizontal_ebo = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, rightEyeHorizontal_ebo);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(rightEyeHorizontal.faces), GL.STATIC_DRAW);

  // left eye vertical
  var leftEyeVertical_ebo = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, leftEyeVertical_ebo);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(leftEyeVertical.faces), GL.STATIC_DRAW);

  // right eye vertical
  var rightEyeVertical_ebo = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, rightEyeVertical_ebo);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(rightEyeVertical.faces), GL.STATIC_DRAW);

  // body
  var body_ebo = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, body_ebo);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(body.faces), GL.STATIC_DRAW);

  // circle
  var circle_ebo = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, circle_ebo);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(circle.faces), GL.STATIC_DRAW);

  // left hand
  var leftHand_ebo = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, leftHand_ebo);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(leftHand.faces), GL.STATIC_DRAW);

  // right hand
  var rightHand_ebo = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, rightHand_ebo);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(rightHand.faces), GL.STATIC_DRAW);

  // left leg
  var leftLeg_ebo = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, leftLeg_ebo);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(leftLeg.faces), GL.STATIC_DRAW);

  // right leg
  var rightLeg_ebo = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, rightLeg_ebo);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(rightLeg.faces), GL.STATIC_DRAW);

  // mouth
  var mouth_ebo = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, mouth_ebo);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(mouth_ebo), GL.STATIC_DRAW);

  // leftEyebrow
  var leftEyebrow_ebo = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, leftEyebrow_ebo);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(leftEyebrow_ebo), GL.STATIC_DRAW);

  // rightEyebrow
  var rightEyebrow_ebo = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, rightEyebrow_ebo);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(rightEyebrow_ebo), GL.STATIC_DRAW);
  // end

  // uniform
  var _WMatrix = GL.getUniformLocation(SHADER_PROGRAM, 'wMatrix');
  var _VMatrix = GL.getUniformLocation(SHADER_PROGRAM, 'vMatrix');
  var _PMatrix = GL.getUniformLocation(SHADER_PROGRAM, 'pMatrix');

  // uniform details
  var WORLD_MATRIX = LIBS.get_I4();
  var VIEW_MATRIX = LIBS.get_I4();
  var PROJECTION_MATRIX = LIBS.get_projection(65, CANVAS.width / CANVAS.height, 1, 100);

  LIBS.translateZ(VIEW_MATRIX, -3);

  // depth
  GL.enable(GL.DEPTH_TEST);
  GL.depthFunc(GL.LEQUAL);

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
  LIBS.translateZ(VIEW_MATRIX, -5);
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

  // animation
  var animate = function () {
    GL.clearColor(0, 0, 0, 0);
    GL.viewport(0, 0, CANVAS.width, CANVAS.height);
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

    if (keysPressed.w) {
      LIBS.translateZ(VIEW_MATRIX, -cameraSpeed);
    }
    if (keysPressed.a) {
      LIBS.translateX(VIEW_MATRIX, -cameraSpeed);
    }
    if (keysPressed.s) {
      LIBS.translateZ(VIEW_MATRIX, cameraSpeed);
    }
    if (keysPressed.d) {
      LIBS.translateX(VIEW_MATRIX, cameraSpeed);
    }

    // left head
    GL.bindBuffer(GL.ARRAY_BUFFER, leftHead_vbo);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, leftHead_color);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, leftHead_ebo);
    GL.uniformMatrix4fv(_WMatrix, false, WORLD_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.drawElements(GL.TRIANGLES, leftHead.faces.length, GL.UNSIGNED_SHORT, 0);

    // right head
    GL.bindBuffer(GL.ARRAY_BUFFER, rightHead_vbo);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, rightHead_color);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, rightHead_ebo);
    GL.uniformMatrix4fv(_WMatrix, false, WORLD_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.drawElements(GL.TRIANGLES, rightHead.faces.length, GL.UNSIGNED_SHORT, 0);

    // left eye
    GL.bindBuffer(GL.ARRAY_BUFFER, leftEye_vbo);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, leftEye_color);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, leftEye_ebo);
    GL.uniformMatrix4fv(_WMatrix, false, WORLD_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.drawElements(GL.TRIANGLES, leftEye.faces.length, GL.UNSIGNED_SHORT, 0);

    // right eye
    GL.bindBuffer(GL.ARRAY_BUFFER, rightEye_vbo);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, rightEye_color);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, rightEye_ebo);
    GL.uniformMatrix4fv(_WMatrix, false, WORLD_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.drawElements(GL.TRIANGLES, rightEye.faces.length, GL.UNSIGNED_SHORT, 0);

    // left eye horizontal
    GL.bindBuffer(GL.ARRAY_BUFFER, leftEyeHorizontal_vbo);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, leftEyeHorizontal_color);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, leftEyeHorizontal_ebo);
    GL.uniformMatrix4fv(_WMatrix, false, WORLD_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.drawElements(GL.TRIANGLES, leftEyeHorizontal.faces.length, GL.UNSIGNED_SHORT, 0);

    // right eye horizontal
    GL.bindBuffer(GL.ARRAY_BUFFER, rightEyeHorizontal_vbo);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, rightEyeHorizontal_color);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, rightEyeHorizontal_ebo);
    GL.uniformMatrix4fv(_WMatrix, false, WORLD_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.drawElements(GL.TRIANGLES, rightEyeHorizontal.faces.length, GL.UNSIGNED_SHORT, 0);

    // left eye vertical
    GL.bindBuffer(GL.ARRAY_BUFFER, leftEyeVertical_vbo);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, leftEyeVertical_color);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, leftEyeVertical_ebo);
    GL.uniformMatrix4fv(_WMatrix, false, WORLD_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.drawElements(GL.TRIANGLES, leftEyeVertical.faces.length, GL.UNSIGNED_SHORT, 0);

    // right eye vertical
    GL.bindBuffer(GL.ARRAY_BUFFER, rightEyeVertical_vbo);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, rightEyeVertical_color);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, rightEyeVertical_ebo);
    GL.uniformMatrix4fv(_WMatrix, false, WORLD_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.drawElements(GL.TRIANGLES, rightEyeVertical.faces.length, GL.UNSIGNED_SHORT, 0);

    // body
    GL.bindBuffer(GL.ARRAY_BUFFER, body_vbo);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, body_color);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, body_ebo);
    GL.uniformMatrix4fv(_WMatrix, false, WORLD_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.drawElements(GL.TRIANGLES, body.faces.length, GL.UNSIGNED_SHORT, 0);

    // circle
    GL.bindBuffer(GL.ARRAY_BUFFER, circle_vbo);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, circle_color);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, circle_ebo);
    GL.uniformMatrix4fv(_WMatrix, false, WORLD_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.drawElements(GL.TRIANGLES, circle.faces.length, GL.UNSIGNED_SHORT, 0);

    // left hand
    GL.bindBuffer(GL.ARRAY_BUFFER, leftHand_vbo);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, leftHand_color);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, leftHand_ebo);
    GL.uniformMatrix4fv(_WMatrix, false, WORLD_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.drawElements(GL.TRIANGLES, leftHand.faces.length, GL.UNSIGNED_SHORT, 0);

    // right hand
    GL.bindBuffer(GL.ARRAY_BUFFER, rightHand_vbo);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, rightHand_color);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, rightHead_ebo);
    GL.uniformMatrix4fv(_WMatrix, false, WORLD_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.drawElements(GL.TRIANGLES, rightHand.faces.length, GL.UNSIGNED_SHORT, 0);

    // left leg
    GL.bindBuffer(GL.ARRAY_BUFFER, leftLeg_vbo);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, leftLeg_color);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, leftLeg_ebo);
    GL.uniformMatrix4fv(_WMatrix, false, WORLD_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.drawElements(GL.TRIANGLES, leftLeg.faces.length, GL.UNSIGNED_SHORT, 0);

    // right leg
    GL.bindBuffer(GL.ARRAY_BUFFER, rightLeg_vbo);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, rightLeg_color);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, rightLeg_ebo);
    GL.uniformMatrix4fv(_WMatrix, false, WORLD_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.drawElements(GL.TRIANGLES, rightLeg.faces.length, GL.UNSIGNED_SHORT, 0);

    // mouth
    GL.bindBuffer(GL.ARRAY_BUFFER, mouth_vbo);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, mouth_color);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, mouth_ebo);
    GL.uniformMatrix4fv(_WMatrix, false, WORLD_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.drawArrays(GL.TRIANGLES, 0, mouth.vertices.length / 3);

    // leftEyebrow
    GL.bindBuffer(GL.ARRAY_BUFFER, leftEyebrow_vbo);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, leftEyebrow_color);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, leftEyebrow_ebo);
    GL.uniformMatrix4fv(_WMatrix, false, WORLD_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.drawArrays(GL.TRIANGLES, 0, leftEyebrow.vertices.length / 3);

    // rightEyebrow
    GL.bindBuffer(GL.ARRAY_BUFFER, rightEyebrow_vbo);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, rightEyebrow_color);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, rightEyebrow_ebo);
    GL.uniformMatrix4fv(_WMatrix, false, WORLD_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.drawArrays(GL.TRIANGLES, 0, rightEyebrow.vertices.length / 3);

    GL.flush();

    window.requestAnimationFrame(animate);
  };
  animate();
}
window.addEventListener('load', main);
