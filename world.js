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

var GL;
class myObject {
  CANVAS = null;
  vertex = [];
  faces = [];
  colors = [];

  SHADER_PROGRAM = null;
  _color = null;
  _position = null;

  _MMatrix = LIBS.get_I4();
  _PMatrix = LIBS.get_I4();
  _VMatrix = LIBS.get_I4();

  object_vbo = null;
  object_colors = null;
  object_ebo = null;

  MODEL_MATRIX = LIBS.get_I4();
  childs = [];

  constructor(vertex, faces, colors, shader_vertex_source, shader_fragment_source) {
    this.vertex = vertex;
    this.faces = faces;
    this.colors = colors;

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

    this.SHADER_PROGRAM = GL.createProgram();
    GL.attachShader(this.SHADER_PROGRAM, shader_vertex);
    GL.attachShader(this.SHADER_PROGRAM, shader_fragment);

    GL.linkProgram(this.SHADER_PROGRAM);

    //vao
    this._position = GL.getAttribLocation(this.SHADER_PROGRAM, 'position');
    this._color = GL.getAttribLocation(this.SHADER_PROGRAM, 'color');

    //uniform
    this._PMatrix = GL.getUniformLocation(this.SHADER_PROGRAM, 'PMatrix');
    this._VMatrix = GL.getUniformLocation(this.SHADER_PROGRAM, 'VMatrix');
    this._MMatrix = GL.getUniformLocation(this.SHADER_PROGRAM, 'MMatrix');

    GL.enableVertexAttribArray(this._position);
    GL.enableVertexAttribArray(this._color);
    GL.useProgram(this.SHADER_PROGRAM);

    // create buffer
    this.object_vbo = GL.createBuffer();
    this.object_colors = GL.createBuffer();
    this.object_ebo = GL.createBuffer();
  }

  setup() {
    // vbo
    GL.bindBuffer(GL.ARRAY_BUFFER, this.object_vbo);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(this.vertex), GL.STATIC_DRAW);

    // colors
    GL.bindBuffer(GL.ARRAY_BUFFER, this.object_colors);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(this.colors), GL.STATIC_DRAW);

    // ebo
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.object_ebo);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.faces), GL.STATIC_DRAW);

    this.childs.forEach((child) => {
      child.setup();
    });
  }

  render(VIEW_MATRIX, PROJECTION_MATRIX) {
    GL.useProgram(this.SHADER_PROGRAM);

    GL.bindBuffer(GL.ARRAY_BUFFER, this.object_vbo);
    GL.vertexAttribPointer(this._position, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, this.object_colors);
    GL.vertexAttribPointer(this._color, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.object_ebo);

    GL.uniformMatrix4fv(this._PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(this._VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(this._MMatrix, false, this.MODEL_MATRIX);
    GL.drawElements(GL.TRIANGLES, this.faces.length, GL.UNSIGNED_SHORT, 0);

    this.childs.forEach((childs) => {
      childs.render(VIEW_MATRIX, PROJECTION_MATRIX);
    });

    GL.flush();
  }
}

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

  //eventListener
  var mouseDown = function (e) {
    var coord = normalizeScreen(e.pageX, e.pageY, CANVAS.width, CANVAS.height);
    console.log(coord[0] + ', ' + coord[1]);
  };

  CANVAS.addEventListener('mousedown', mouseDown, false);

  try {
    GL = CANVAS.getContext('webgl', { antialias: true });
    var EXT = GL.getExtension('OES_element_index_uint');
  } catch (e) {
    alert('WebGL context cannot be initialized');
    return false;
  }

  //shaders
  var shader_vertex_source = `
      precision mediump float;
      attribute vec3 position;
      attribute vec3 color;
  
      uniform mat4 PMatrix;
      uniform mat4 VMatrix;
      uniform mat4 MMatrix;
      
      varying vec3 vColor;
      void main(void) {
      gl_Position = PMatrix * VMatrix * MMatrix * vec4(position, 1.);
      vColor = color;
      }`;
  var shader_fragment_source = `
      precision mediump float;

      varying vec3 vColor;
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

  /* inisialisasi object */
  /* environment */
  // base world
  var baseWorldData = environment.generateHalfSphere(0, -0.9, 0, 2.7, 50, [0.0, 1.0, 0.0]);
  var baseWorld = new myObject(baseWorldData.vertices, baseWorldData.faces, baseWorldData.colors, shader_vertex_source, shader_fragment_source);
  baseWorld.setup();

  // matahari
  var matahariBulatData = environment.generateBall(-1.6, 1.3, -1, 0.35, 50, [255 / 255, 214 / 255, 79 / 255]); // matahari: x, y, z, radius, segments, warna
  var matahariBulat = new myObject(matahariBulatData.vertices, matahariBulatData.faces, matahariBulatData.colors, shader_vertex_source, shader_fragment_source);
  matahariBulat.setup();

  var matahariCone1Data = environment.generateEllipticParboloid(-1.6, 1.9, -1, 0.07, 50, 0, 0, 0, [255 / 255, 180 / 255, 50 / 255]); // matahari: x, y, z, radius, segments, rotationX, rotationY, rotationZ, warna
  var matahariCone1 = new myObject(matahariCone1Data.vertices, matahariCone1Data.faces, matahariCone1Data.colors, shader_vertex_source, shader_fragment_source);
  matahariCone1.setup();

  var matahariCone2Data = environment.generateEllipticParboloid(-1.17, 1.73, -1, 0.07, 50, 0, 0, -Math.PI / 4, [255 / 255, 180 / 255, 50 / 255]);
  var matahariCone2 = new myObject(matahariCone2Data.vertices, matahariCone2Data.faces, matahariCone2Data.colors, shader_vertex_source, shader_fragment_source);
  matahariCone2.setup();

  var matahariCone3Data = environment.generateEllipticParboloid(-1, 1.3, -1, 0.07, 50, 0, 0, -Math.PI / 2, [255 / 255, 180 / 255, 50 / 255]);
  var matahariCone3 = new myObject(matahariCone3Data.vertices, matahariCone3Data.faces, matahariCone3Data.colors, shader_vertex_source, shader_fragment_source);
  matahariCone3.setup();

  var matahariCone4Data = environment.generateEllipticParboloid(-1.17, 0.9, -1, 0.07, 50, 0, 0, (-3 * Math.PI) / 4, [255 / 255, 180 / 255, 50 / 255]);
  var matahariCone4 = new myObject(matahariCone4Data.vertices, matahariCone4Data.faces, matahariCone4Data.colors, shader_vertex_source, shader_fragment_source);
  matahariCone4.setup();

  var matahariCone5Data = environment.generateEllipticParboloid(-1.6, 0.7, -1, 0.07, 50, 0, 0, Math.PI, [255 / 255, 180 / 255, 50 / 255]);
  var matahariCone5 = new myObject(matahariCone5Data.vertices, matahariCone5Data.faces, matahariCone5Data.colors, shader_vertex_source, shader_fragment_source);
  matahariCone5.setup();

  var matahariCone6Data = environment.generateEllipticParboloid(-2.05, 0.9, -1, 0.07, 50, 0, 0, (3 * Math.PI) / 4, [255 / 255, 180 / 255, 50 / 255]);
  var matahariCone6 = new myObject(matahariCone6Data.vertices, matahariCone6Data.faces, matahariCone6Data.colors, shader_vertex_source, shader_fragment_source);
  matahariCone6.setup();

  var matahariCone7Data = environment.generateEllipticParboloid(-2.2, 1.3, -1, 0.07, 50, 0, 0, Math.PI / 2, [255 / 255, 180 / 255, 50 / 255]);
  var matahariCone7 = new myObject(matahariCone7Data.vertices, matahariCone7Data.faces, matahariCone7Data.colors, shader_vertex_source, shader_fragment_source);
  matahariCone7.setup();

  var matahariCone8Data = environment.generateEllipticParboloid(-2.05, 1.73, -1, 0.07, 50, 0, 0, Math.PI / 4, [255 / 255, 180 / 255, 50 / 255]);
  var matahariCone8 = new myObject(matahariCone8Data.vertices, matahariCone8Data.faces, matahariCone8Data.colors, shader_vertex_source, shader_fragment_source);
  matahariCone8.setup();

  var matahari_mataKananData = environment.generateEllipsoid(-1.7, 1.3, -0.68, 0.04, 50, 1.3, 0, 0, Math.PI / 4, [0 / 255, 0 / 255, 0 / 255]); // matahari: x, y, z, radius, segments, ovalY, rotationX, rotationY, rotationZ, warna
  var matahari_mataKanan = new myObject(matahari_mataKananData.vertices, matahari_mataKananData.faces, matahari_mataKananData.colors, shader_vertex_source, shader_fragment_source);
  matahari_mataKanan.setup();

  var matahari_mataKiriData = environment.generateEllipsoid(-1.5, 1.3, -0.68, 0.04, 50, 1.3, 0, 0, Math.PI / 4, [0 / 255, 0 / 255, 0 / 255]);
  var matahari_mataKiri = new myObject(matahari_mataKiriData.vertices, matahari_mataKiriData.faces, matahari_mataKiriData.colors, shader_vertex_source, shader_fragment_source);
  matahari_mataKiri.setup();

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

    /* render object */
    // base world render
    baseWorld.render(VIEW_MATRIX, PROJECTION_MATRIX);

    // matahari render
    matahariBulat.render(VIEW_MATRIX, PROJECTION_MATRIX);
    matahariCone1.render(VIEW_MATRIX, PROJECTION_MATRIX);
    matahariCone2.render(VIEW_MATRIX, PROJECTION_MATRIX);
    matahariCone3.render(VIEW_MATRIX, PROJECTION_MATRIX);
    matahariCone4.render(VIEW_MATRIX, PROJECTION_MATRIX);
    matahariCone5.render(VIEW_MATRIX, PROJECTION_MATRIX);
    matahariCone6.render(VIEW_MATRIX, PROJECTION_MATRIX);
    matahariCone7.render(VIEW_MATRIX, PROJECTION_MATRIX);
    matahariCone8.render(VIEW_MATRIX, PROJECTION_MATRIX);
    matahari_mataKanan.render(VIEW_MATRIX, PROJECTION_MATRIX);
    matahari_mataKiri.render(VIEW_MATRIX, PROJECTION_MATRIX);

    GL.flush();

    window.requestAnimationFrame(animate);
  };

  animate(0);
}

window.addEventListener('load', main);
