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
  object_ebo = null;
  object_colors = null;

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
    this.object_ebo = GL.createBuffer();
    this.object_colors = GL.createBuffer();
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
    GL.bindBuffer(GL.ARRAY_BUFFER, this.object_colors);
    GL.bindBuffer(GL.ELEMENTS_ARRAY_BUFFER, this.object_ebo);

    GL.vertexAttribPointer(this._position, 3, GL.FLOAT, Float32Array.BYTES_PER_ELEMENT, 0);
    GL.vertexAttribPointer(this._color, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);

    GL.uniformMatrix4fv(this._PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(this._VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(this._MMatrix, false, this.MODEL_MATRIX);
    GL.uniform1f(this._greyScality, 1);

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
    GL.flush();

    window.requestAnimationFrame(animate);
  };

  animate(0);
}

window.addEventListener('load', main);
