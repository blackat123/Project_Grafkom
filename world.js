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

  renderCurves(VIEW_MATRIX, PROJECTION_MATRIX) {
    GL.useProgram(this.SHADER_PROGRAM);

    GL.bindBuffer(GL.ARRAY_BUFFER, this.object_vbo);
    GL.vertexAttribPointer(this._position, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, this.object_colors);
    GL.vertexAttribPointer(this._color, 3, GL.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.object_ebo);

    GL.uniformMatrix4fv(this._PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(this._VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(this._MMatrix, false, this.MODEL_MATRIX);
    GL.drawArrays(GL.LINE_STRIP, 0, this.vertex.length / 3);

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
  /* ENVIRONMENT */
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

  // kain piknik
  var kainPiknikData = environment.generateKotak(-0.4, 1.4, -1, -0.88, 0.5, 1.7, 50, [1, 0, 0]);
  var kainPiknik = new myObject(kainPiknikData.vertices, kainPiknikData.faces, kainPiknikData.colors, shader_vertex_source, shader_fragment_source);
  kainPiknik.setup();

  // kado
  var kotakKado1Data = environment.generateKotak(-1.1, -0.5, -1, -0.4, -0.8, -0.2, 50, [0, 0, 1]);
  var kotakKado1 = new myObject(kotakKado1Data.vertices, kotakKado1Data.faces, kotakKado1Data.colors, shader_vertex_source, shader_fragment_source);
  kotakKado1.setup();

  var TutupkotakKado1Data = environment.generateKotak(-1.125, -0.475, -0.45, -0.3, -0.825, -0.175, 50, [1, 0, 1]);
  var TutupkotakKado1 = new myObject(TutupkotakKado1Data.vertices, TutupkotakKado1Data.faces, TutupkotakKado1Data.colors, shader_vertex_source, shader_fragment_source);
  TutupkotakKado1.setup();

  var kotakKado2Data = environment.generateKotak(-1.6, -1.1, -1, -0.5, -0.65, -0.1, 50, [0.5, 0.5, 0.5]);
  var kotakKado2 = new myObject(kotakKado2Data.vertices, kotakKado2Data.faces, kotakKado2Data.colors, shader_vertex_source, shader_fragment_source);
  kotakKado2.setup();

  var kotakKado3Data = environment.generateKotak(-1.45, -1.18, -0.5, -0.17, -0.6, -0.3, 50, [1, 0, 0]);
  var kotakKado3 = new myObject(kotakKado3Data.vertices, kotakKado3Data.faces, kotakKado3Data.colors, shader_vertex_source, shader_fragment_source);
  kotakKado3.setup();

  var kotakKado4Data = environment.generateKotak(-0.47, 0, -1, -0.6, -0.65, -0.15, 50, [0.5, 0.5, 0.5]);
  var kotakKado4 = new myObject(kotakKado4Data.vertices, kotakKado4Data.faces, kotakKado4Data.colors, shader_vertex_source, shader_fragment_source);
  kotakKado4.setup();

  var kotakKado5Data = environment.generateKotak(-0.4, -0.03, -0.7, -0.45, -0.35, -0.6, 50, [1, 1, 0]);
  var kotakKado5 = new myObject(kotakKado5Data.vertices, kotakKado5Data.faces, kotakKado5Data.colors, shader_vertex_source, shader_fragment_source);
  kotakKado5.setup();

  var kotakKado6Data = environment.generateKotak(-1.2, -0.8, -1, -0.7, -0.1, 0.25, 50, [0, 0, 0]);
  var kotakKado6 = new myObject(kotakKado6Data.vertices, kotakKado6Data.faces, kotakKado6Data.colors, shader_vertex_source, shader_fragment_source);
  kotakKado6.setup();

  var kotakKado7Data = environment.generateKotak(-0.6, -0.25, -1, -0.6, -0.15, 0.15, 50, [0, 0.5, 0.6]);
  var kotakKado7 = new myObject(kotakKado7Data.vertices, kotakKado7Data.faces, kotakKado7Data.colors, shader_vertex_source, shader_fragment_source);
  kotakKado7.setup();

  // awan satu
  var awan1_1Data = environment.generateBall(0.1, 1.1, -1, 0.25, 50, [220 / 255, 218 / 255, 219 / 255]);
  var awan1_1 = new myObject(awan1_1Data.vertices, awan1_1Data.faces, awan1_1Data.colors, shader_vertex_source, shader_fragment_source);
  awan1_1.setup();

  var awan1_2Data = environment.generateBall(-0.29, 0.9, -1, 0.2, 50, [220 / 255, 218 / 255, 219 / 255]);
  var awan1_2 = new myObject(awan1_2Data.vertices, awan1_2Data.faces, awan1_2Data.colors, shader_vertex_source, shader_fragment_source);
  awan1_2.setup();

  var awan1_3Data = environment.generateBall(0.4, 0.9, -1, 0.2, 50, [220 / 255, 218 / 255, 219 / 255]);
  var awan1_3 = new myObject(awan1_3Data.vertices, awan1_3Data.faces, awan1_3Data.colors, shader_vertex_source, shader_fragment_source);
  awan1_3.setup();

  var awan1_4Data = environment.generateBall(0, 0.8, -1, 0.15, 50, [220 / 255, 218 / 255, 219 / 255]);
  var awan1_4 = new myObject(awan1_4Data.vertices, awan1_4Data.faces, awan1_4Data.colors, shader_vertex_source, shader_fragment_source);
  awan1_4.setup();

  var awan1_5Data = environment.generateBall(-0.15, 1.1, -1, 0.2, 50, [220 / 255, 218 / 255, 219 / 255]);
  var awan1_5 = new myObject(awan1_5Data.vertices, awan1_5Data.faces, awan1_5Data.colors, shader_vertex_source, shader_fragment_source);
  awan1_5.setup();

  var awan1_6Data = environment.generateBall(-0.55, 0.85, -1, 0.13, 50, [220 / 255, 218 / 255, 219 / 255]);
  var awan1_6 = new myObject(awan1_6Data.vertices, awan1_6Data.faces, awan1_6Data.colors, shader_vertex_source, shader_fragment_source);
  awan1_6.setup();

  var awan1_7Data = environment.generateBall(0.2, 0.8, -1, 0.1, 50, [220 / 255, 218 / 255, 219 / 255]);
  var awan1_7 = new myObject(awan1_7Data.vertices, awan1_7Data.faces, awan1_7Data.colors, shader_vertex_source, shader_fragment_source);
  awan1_7.setup();

  // awan dua
  var awan2_1Data = environment.generateBall(1.5, 1.3, 0, 0.25, 50, [220 / 255, 218 / 255, 219 / 255]);
  var awan2_1 = new myObject(awan2_1Data.vertices, awan2_1Data.faces, awan2_1Data.colors, shader_vertex_source, shader_fragment_source);
  awan2_1.setup();

  var awan2_2Data = environment.generateBall(1.2, 1.1, 0, 0.2, 50, [220 / 255, 218 / 255, 219 / 255]);
  var awan2_2 = new myObject(awan2_2Data.vertices, awan2_2Data.faces, awan2_2Data.colors, shader_vertex_source, shader_fragment_source);
  awan2_2.setup();

  var awan2_3Data = environment.generateBall(1.8, 1.1, 0, 0.2, 50, [220 / 255, 218 / 255, 219 / 255]);
  var awan2_3 = new myObject(awan2_3Data.vertices, awan2_3Data.faces, awan2_3Data.colors, shader_vertex_source, shader_fragment_source);
  awan2_3.setup();

  var awan2_4Data = environment.generateBall(1.5, 1, 0, 0.15, 50, [220 / 255, 218 / 255, 219 / 255]);
  var awan2_4 = new myObject(awan2_4Data.vertices, awan2_4Data.faces, awan2_4Data.colors, shader_vertex_source, shader_fragment_source);
  awan2_4.setup();

  var awan2_5Data = environment.generateBall(0.95, 1.07, 0, 0.13, 50, [220 / 255, 218 / 255, 219 / 255]);
  var awan2_5 = new myObject(awan2_5Data.vertices, awan2_5Data.faces, awan2_5Data.colors, shader_vertex_source, shader_fragment_source);
  awan2_5.setup();

  var awan2_6Data = environment.generateBall(2.05, 1.07, 0, 0.13, 50, [220 / 255, 218 / 255, 219 / 255]);
  var awan2_6 = new myObject(awan2_6Data.vertices, awan2_6Data.faces, awan2_6Data.colors, shader_vertex_source, shader_fragment_source);
  awan2_6.setup();

  // awan tiga
  var awan3_1Data = environment.generateBall(0.6, 2.3, -2.1, 0.22, 50, [220 / 255, 218 / 255, 219 / 255]);
  var awan3_1 = new myObject(awan3_1Data.vertices, awan3_1Data.faces, awan3_1Data.colors, shader_vertex_source, shader_fragment_source);
  awan3_1.setup();

  var awan3_2Data = environment.generateBall(0.2, 2.1, -2.1, 0.17, 50, [220 / 255, 218 / 255, 219 / 255]);
  var awan3_2 = new myObject(awan3_2Data.vertices, awan3_2Data.faces, awan3_2Data.colors, shader_vertex_source, shader_fragment_source);
  awan3_2.setup();

  var awan3_3Data = environment.generateBall(0.85, 2.1, -2.1, 0.17, 50, [220 / 255, 218 / 255, 219 / 255]);
  var awan3_3 = new myObject(awan3_3Data.vertices, awan3_3Data.faces, awan3_3Data.colors, shader_vertex_source, shader_fragment_source);
  awan3_3.setup();

  var awan3_4Data = environment.generateBall(0.65, 2.05, -2.1, 0.1, 50, [220 / 255, 218 / 255, 219 / 255]);
  var awan3_4 = new myObject(awan3_4Data.vertices, awan3_4Data.faces, awan3_4Data.colors, shader_vertex_source, shader_fragment_source);
  awan3_4.setup();

  var awan3_5Data = environment.generateBall(0.45, 2.11, -2.1, 0.15, 50, [220 / 255, 218 / 255, 219 / 255]);
  var awan3_5 = new myObject(awan3_5Data.vertices, awan3_5Data.faces, awan3_5Data.colors, shader_vertex_source, shader_fragment_source);
  awan3_5.setup();

  // pohon satu
  var batangData = environment.generateKotak(1, 1.25, -0.9, -0.4, -2, -1.7, 50, [108 / 255, 60 / 255, 12 / 255]);
  var batang = new myObject(batangData.vertices, batangData.faces, batangData.colors, shader_vertex_source, shader_fragment_source);
  batang.setup();

  var daunCone1Data = environment.generateEllipticParboloid(1.13, 0.3, -1.85, 0.3, 50, 0, 0, 0, [27 / 255, 146 / 255, 27 / 255]);
  var daunCone1 = new myObject(daunCone1Data.vertices, daunCone1Data.faces, daunCone1Data.colors, shader_vertex_source, shader_fragment_source);
  daunCone1.setup();

  var daunCone2Data = environment.generateEllipticParboloid(1.13, 0.9, -1.85, 0.3, 50, 0, 0, 0, [27 / 255, 146 / 255, 27 / 255]);
  var daunCone2 = new myObject(daunCone2Data.vertices, daunCone2Data.faces, daunCone2Data.colors, shader_vertex_source, shader_fragment_source);
  daunCone2.setup();

  // pohon dua
  var batang1Data = environment.generateKotak(1.75, 2, -0.9, -0.4, -0.8, -1.05, 50, [108 / 255, 60 / 255, 12 / 255]);
  var batang1 = new myObject(batang1Data.vertices, batang1Data.faces, batang1Data.colors, shader_vertex_source, shader_fragment_source);
  batang1.setup();

  var daunCone3Data = environment.generateEllipticParboloid(1.89, 0.35, -0.9, 0.3, 50, 0, 0, 0, [27 / 255, 146 / 255, 27 / 255]);
  var daunCone3 = new myObject(daunCone3Data.vertices, daunCone3Data.faces, daunCone3Data.colors, shader_vertex_source, shader_fragment_source);
  daunCone3.setup();

  var daunCone4Data = environment.generateEllipticParboloid(1.89, 0.9, -0.9, 0.3, 50, 0, 0, 0, [27 / 255, 146 / 255, 27 / 255]);
  var daunCone4 = new myObject(daunCone4Data.vertices, daunCone4Data.faces, daunCone4Data.colors, shader_vertex_source, shader_fragment_source);
  daunCone4.setup();

  // kue
  var kue1Data = environment.generateTabung(0.5, -0.85, 1.3, 0.18, 0.06, 50, [239 / 255, 212 / 255, 188 / 255]);
  var kue1 = new myObject(kue1Data.vertices, kue1Data.faces, kue1Data.colors, shader_vertex_source, shader_fragment_source);
  kue1.setup();

  var kue2Data = environment.generateTabung(0.5, -0.79, 1.3, 0.18, 0.06, 50, [229 / 255, 171 / 255, 124 / 255]);
  var kue2 = new myObject(kue2Data.vertices, kue2Data.faces, kue2Data.colors, shader_vertex_source, shader_fragment_source);
  kue2.setup();

  var kue3Data = environment.generateTabung(0.5, -0.73, 1.3, 0.18, 0.06, 50, [239 / 255, 212 / 255, 188 / 255]);
  var kue3 = new myObject(kue3Data.vertices, kue3Data.faces, kue3Data.colors, shader_vertex_source, shader_fragment_source);
  kue3.setup();

  var tutup_kue1Data = environment.generateCircle(0.5, -0.7, 1.3, 0.18, [239 / 255, 212 / 255, 188 / 255]);
  var tutup_kue1 = new myObject(tutup_kue1Data.vertices, tutup_kue1Data.faces, tutup_kue1Data.colors, shader_vertex_source, shader_fragment_source);
  tutup_kue1.setup();

  var kue4Data = environment.generateTabung(0.5, -0.67, 1.3, 0.14, 0.06, 50, [239 / 255, 212 / 255, 188 / 255]);
  var kue4 = new myObject(kue4Data.vertices, kue4Data.faces, kue4Data.colors, shader_vertex_source, shader_fragment_source);
  kue4.setup();

  var kue5Data = environment.generateTabung(0.5, -0.61, 1.3, 0.14, 0.06, 50, [229 / 255, 171 / 255, 124 / 255]);
  var kue5 = new myObject(kue5Data.vertices, kue5Data.faces, kue5Data.colors, shader_vertex_source, shader_fragment_source);
  kue5.setup();

  var kue6Data = environment.generateTabung(0.5, -0.55, 1.3, 0.14, 0.06, 50, [239 / 255, 212 / 255, 188 / 255]);
  var kue6 = new myObject(kue6Data.vertices, kue6Data.faces, kue6Data.colors, shader_vertex_source, shader_fragment_source);
  kue6.setup();

  var tutup_kue2Data = environment.generateCircle(0.5, -0.52, 1.3, 0.14, [239 / 255, 212 / 255, 188 / 255]);
  var tutup_kue2 = new myObject(tutup_kue2Data.vertices, tutup_kue2Data.faces, tutup_kue2Data.colors, shader_vertex_source, shader_fragment_source);
  tutup_kue2.setup();

  // lilin satu
  var lilin1Data = environment.generateTabung(0.5, -0.5, 1.27, 0.01, 0.09, 50, [0 / 255, 0 / 255, 188 / 255]);
  var lilin1 = new myObject(lilin1Data.vertices, lilin1Data.faces, lilin1Data.colors, shader_vertex_source, shader_fragment_source);
  lilin1.setup();

  var tutup_lilin1Data = environment.generateCircle(0.5, -0.455, 1.27, 0.01, [255 / 255, 0 / 255, 0 / 255]);
  var tutup_lilin1 = new myObject(tutup_lilin1Data.vertices, tutup_lilin1Data.faces, tutup_lilin1Data.colors, shader_vertex_source, shader_fragment_source);
  tutup_lilin1.setup();

  var api1_lilin1_coneData = environment.generateEllipticParboloid(0.5, -0.4, 1.27, 0.009, 50, 0, 0, 0, [252 / 255, 73 / 255, 3 / 255]);
  var api1_lilin1_cone = new myObject(api1_lilin1_coneData.vertices, api1_lilin1_coneData.faces, api1_lilin1_coneData.colors, shader_vertex_source, shader_fragment_source);
  api1_lilin1_cone.setup();

  var api1_lilin1_ballData = environment.generateBall(0.5, -0.425, 1.27, 0.0139, 50, [252 / 255, 73 / 255, 3 / 255]);
  var api1_lilin1_ball = new myObject(api1_lilin1_ballData.vertices, api1_lilin1_ballData.faces, api1_lilin1_ballData.colors, shader_vertex_source, shader_fragment_source);
  api1_lilin1_ball.setup();

  var api2_lilin1_coneData = environment.generateEllipticParboloid(0.5, -0.405, 1.2755, 0.005, 50, 0, 0, 0, [255 / 255, 183 / 255, 82 / 255]);
  var api2_lilin1_cone = new myObject(api2_lilin1_coneData.vertices, api2_lilin1_coneData.faces, api2_lilin1_coneData.colors, shader_vertex_source, shader_fragment_source);
  api2_lilin1_cone.setup();

  var api2_lilin1_ballData = environment.generateBall(0.5, -0.425, 1.2755, 0.01, 50, [255 / 255, 183 / 255, 82 / 255]);
  var api2_lilin1_ball = new myObject(api2_lilin1_ballData.vertices, api2_lilin1_ballData.faces, api2_lilin1_ballData.colors, shader_vertex_source, shader_fragment_source);
  api2_lilin1_ball.setup();

  // lilin dua
  var lilin2Data = environment.generateTabung(0.44, -0.5, 1.32, 0.01, 0.09, 50, [0 / 255, 0 / 255, 188 / 255]);
  var lilin2 = new myObject(lilin2Data.vertices, lilin2Data.faces, lilin2Data.colors, shader_vertex_source, shader_fragment_source);
  lilin2.setup();

  var tutup_lilin2Data = environment.generateCircle(0.44, -0.455, 1.32, 0.01, [255 / 255, 0 / 255, 0 / 255]);
  var tutup_lilin2 = new myObject(tutup_lilin2Data.vertices, tutup_lilin2Data.faces, tutup_lilin2Data.colors, shader_vertex_source, shader_fragment_source);
  tutup_lilin2.setup();

  var api1_lilin2_coneData = environment.generateEllipticParboloid(0.44, -0.4, 1.32, 0.009, 50, 0, 0, 0, [252 / 255, 73 / 255, 3 / 255]);
  var api1_lilin2_cone = new myObject(api1_lilin2_coneData.vertices, api1_lilin2_coneData.faces, api1_lilin2_coneData.colors, shader_vertex_source, shader_fragment_source);
  api1_lilin2_cone.setup();

  var api1_lilin2_ballData = environment.generateBall(0.44, -0.425, 1.32, 0.0139, 50, [252 / 255, 73 / 255, 3 / 255]);
  var api1_lilin2_ball = new myObject(api1_lilin2_ballData.vertices, api1_lilin2_ballData.faces, api1_lilin2_ballData.colors, shader_vertex_source, shader_fragment_source);
  api1_lilin2_ball.setup();

  var api2_lilin2_coneData = environment.generateEllipticParboloid(0.44, -0.405, 1.3255, 0.005, 50, 0, 0, 0, [255 / 255, 183 / 255, 82 / 255]);
  var api2_lilin2_cone = new myObject(api2_lilin2_coneData.vertices, api2_lilin2_coneData.faces, api2_lilin2_coneData.colors, shader_vertex_source, shader_fragment_source);
  api2_lilin2_cone.setup();

  var api2_lilin2_ballData = environment.generateBall(0.44, -0.425, 1.3255, 0.01, 50, [255 / 255, 183 / 255, 82 / 255]);
  var api2_lilin2_ball = new myObject(api2_lilin2_ballData.vertices, api2_lilin2_ballData.faces, api2_lilin2_ballData.colors, shader_vertex_source, shader_fragment_source);
  api2_lilin2_ball.setup();

  // lilin tiga
  var lilin3Data = environment.generateTabung(0.56, -0.5, 1.32, 0.01, 0.09, 50, [0 / 255, 0 / 255, 188 / 255]);
  var lilin3 = new myObject(lilin3Data.vertices, lilin3Data.faces, lilin3Data.colors, shader_vertex_source, shader_fragment_source);
  lilin3.setup();

  var tutup_lilin3Data = environment.generateCircle(0.56, -0.455, 1.32, 0.01, [255 / 255, 0 / 255, 0 / 255]);
  var tutup_lilin3 = new myObject(tutup_lilin3Data.vertices, tutup_lilin3Data.faces, tutup_lilin3Data.colors, shader_vertex_source, shader_fragment_source);
  tutup_lilin3.setup();

  var api1_lilin3_coneData = environment.generateEllipticParboloid(0.56, -0.4, 1.32, 0.009, 50, 0, 0, 0, [252 / 255, 73 / 255, 3 / 255]);
  var api1_lilin3_cone = new myObject(api1_lilin3_coneData.vertices, api1_lilin3_coneData.faces, api1_lilin3_coneData.colors, shader_vertex_source, shader_fragment_source);
  api1_lilin3_cone.setup();

  var api1_lilin3_ballData = environment.generateBall(0.56, -0.425, 1.32, 0.0139, 50, [252 / 255, 73 / 255, 3 / 255]);
  var api1_lilin3_ball = new myObject(api1_lilin3_ballData.vertices, api1_lilin3_ballData.faces, api1_lilin3_ballData.colors, shader_vertex_source, shader_fragment_source);
  api1_lilin3_ball.setup();

  var api2_lilin3_coneData = environment.generateEllipticParboloid(0.56, -0.405, 1.3255, 0.005, 50, 0, 0, 0, [255 / 255, 183 / 255, 82 / 255]);
  var api2_lilin3_cone = new myObject(api2_lilin3_coneData.vertices, api2_lilin3_coneData.faces, api2_lilin3_coneData.colors, shader_vertex_source, shader_fragment_source);
  api2_lilin3_cone.setup();

  var api2_lilin3_ballData = environment.generateBall(0.56, -0.425, 1.3255, 0.01, 50, [255 / 255, 183 / 255, 82 / 255]);
  var api2_lilin3_ball = new myObject(api2_lilin3_ballData.vertices, api2_lilin3_ballData.faces, api2_lilin3_ballData.colors, shader_vertex_source, shader_fragment_source);
  api2_lilin3_ball.setup();

  // balon satu
  var balon1Data = environment.generateEllipsoid(-2, 0, -0.5, 0.2, 50, 1.2, [243 / 255, 177 / 255, 205 / 255]);
  var balon1 = new myObject(balon1Data.vertices, balon1Data.faces, balon1Data.colors, shader_vertex_source, shader_fragment_source);
  balon1.setup();

  var ujungBalon1Data = environment.generateEllipticParboloid(-2, -0.23, -0.5, 0.02, 50, 0, 0, 0, [243 / 255, 177 / 255, 205 / 255]);
  var ujungBalon1 = new myObject(ujungBalon1Data.vertices, ujungBalon1Data.faces, ujungBalon1Data.colors, shader_vertex_source, shader_fragment_source);
  ujungBalon1.setup();

  var tali1Data = environment.generateCurves(
    [
      [-2, -0.23],
      [-1.95, -0.5],
      [-2.25, -0.5],
      [-1.8, -0.7],
      [-2, -0.9],
    ],
    -0.5,
    100
  );
  var tali1 = new myObject(tali1Data.vertices, tali1Data.faces, tali1Data.colors, shader_vertex_source, shader_fragment_source);
  tali1.setup();

  // balon dua
  var balon2Data = environment.generateEllipsoid(0.3, 0, -0.5, 0.2, 50, 1.2, [171 / 255, 197 / 255, 254 / 255]);
  var balon2 = new myObject(balon2Data.vertices, balon2Data.faces, balon2Data.colors, shader_vertex_source, shader_fragment_source);
  balon2.setup();

  var ujungBalon2Data = environment.generateEllipticParboloid(0.3, -0.23, -0.5, 0.02, 50, 0, 0, 0, [171 / 255, 197 / 255, 254 / 255]);
  var ujungBalon2 = new myObject(ujungBalon2Data.vertices, ujungBalon2Data.faces, ujungBalon2Data.colors, shader_vertex_source, shader_fragment_source);
  ujungBalon2.setup();

  var tali2Data = environment.generateCurves(
    [
      [0.3, -0.23],
      [0.35, -0.5],
      [0.05, -0.5],
      [0.5, -0.7],
      [0.3, -0.9],
    ],
    -0.5,
    100
  );
  var tali2 = new myObject(tali2Data.vertices, tali2Data.faces, tali2Data.colors, shader_vertex_source, shader_fragment_source);
  tali2.setup();

  // papan
  var tiang1Data = environment.generateTabung(-1.8, -0.5, -1.2, 0.035, 1.7, 50, [46 / 255, 28 / 255, 2 / 255]);
  var tiang1 = new myObject(tiang1Data.vertices, tiang1Data.faces, tiang1Data.colors, shader_vertex_source, shader_fragment_source);
  tiang1.setup();

  var tutup_tiang1Data = environment.generateCircle(-1.8, 0.35, -1.2, 0.035, [46 / 255, 28 / 255, 2 / 255]);
  var tutup_tiang1 = new myObject(tutup_tiang1Data.vertices, tutup_tiang1Data.faces, tutup_tiang1Data.colors, shader_vertex_source, shader_fragment_source);
  tutup_tiang1.setup();

  var tiang2Data = environment.generateTabung(-0.15, -0.5, -1.2, 0.035, 1.7, 50, [46 / 255, 28 / 255, 2 / 255]);
  var tiang2 = new myObject(tiang2Data.vertices, tiang2Data.faces, tiang2Data.colors, shader_vertex_source, shader_fragment_source);
  tiang2.setup();

  var tutup_tiang2Data = environment.generateCircle(-0.15, 0.35, -1.2, 0.035, [46 / 255, 28 / 255, 2 / 255]);
  var tutup_tiang2 = new myObject(tutup_tiang2Data.vertices, tutup_tiang2Data.faces, tutup_tiang2Data.colors, shader_vertex_source, shader_fragment_source);
  tutup_tiang2.setup();

  // banner
  var bannerPapanData = environment.generateKotak(-1.8, -0.15, 0.05, 0.5, -1.19, -1.21, 50, [254 / 255, 184 / 255, 147 / 255]);
  var bannerPapan = new myObject(bannerPapanData.vertices, bannerPapanData.faces, bannerPapanData.colors, shader_vertex_source, shader_fragment_source);
  bannerPapan.setup();

  /* BONBON */
  // kepala
  var leftHeadData = bonbon.generateHead(1.4, -0.44, 0, 0.25, 50);
  var leftHead = new myObject(leftHeadData.vertices, leftHeadData.faces, leftHeadData.colors, shader_vertex_source, shader_fragment_source);
  leftHead.setup();

  var rightHeadData = bonbon.generateHead(1.7, -0.44, 0, 0.25, 50);
  var rightHead = new myObject(rightHeadData.vertices, rightHeadData.faces, rightHeadData.colors, shader_vertex_source, shader_fragment_source);
  rightHead.setup();

  // mata
  var leftEyeData = bonbon.generateEyes(1.43, -0.52, 0.22, 0.05, 50, 1, 1, 1, 0, 0, 0, [2 / 255, 147 / 255, 238 / 255]);
  var leftEye = new myObject(leftEyeData.vertices, leftEyeData.faces, leftEyeData.colors, shader_vertex_source, shader_fragment_source);
  leftEye.setup();

  var rightEyeData = bonbon.generateEyes(1.67, -0.52, 0.22, 0.05, 50, 1, 1, 1, 0, 0, 0, [255 / 255, 47 / 255, 84 / 255]);
  var rightEye = new myObject(rightEyeData.vertices, rightEyeData.faces, rightEyeData.colors, shader_vertex_source, shader_fragment_source);
  rightEye.setup();

  var leftEyeHorizontalData = bonbon.generateEyes(1.43, -0.525, 0.25, 0.025, 50, 0.4, 1, 1, 0, 0, Math.PI / 2, [0, 0, 0]);
  var leftEyeHorizontal = new myObject(leftEyeHorizontalData.vertices, leftEyeHorizontalData.faces, leftEyeHorizontalData.colors, shader_vertex_source, shader_fragment_source);
  leftEyeHorizontal.setup();

  var leftEyeVerticalData = bonbon.generateEyes(1.43, -0.525, 0.25, 0.03, 50, 0.3, 1, 1, 0, 0, 0, [0, 0, 0]);
  var leftEyeVertical = new myObject(leftEyeVerticalData.vertices, leftEyeVerticalData.faces, leftEyeVerticalData.colors, shader_vertex_source, shader_fragment_source);
  leftEyeVertical.setup();

  var rightEyeHorizontalData = bonbon.generateEyes(1.67, -0.525, 0.25, 0.025, 50, 0.4, 1, 1, 0, 0, Math.PI / 2, [0, 0, 0]);
  var rightEyeHorizontal = new myObject(rightEyeHorizontalData.vertices, rightEyeHorizontalData.faces, rightEyeHorizontalData.colors, shader_vertex_source, shader_fragment_source);
  rightEyeHorizontal.setup();

  var rightEyeVerticalData = bonbon.generateEyes(1.67, -0.525, 0.25, 0.03, 50, 0.3, 1, 1, 0, 0, 0, [0, 0, 0]);
  var rightEyeVertical = new myObject(rightEyeVerticalData.vertices, rightEyeVerticalData.faces, rightEyeVerticalData.colors, shader_vertex_source, shader_fragment_source);
  rightEyeVertical.setup();

  // badan
  var bodyData = bonbon.generateBody(1.55, -0.62, 0, 0.165, 0.35, 50, 0, 0, 0, 0.1, 50);
  var body = new myObject(bodyData.vertices, bodyData.faces, bodyData.colors, shader_vertex_source, shader_fragment_source);
  body.setup();

  var circleData = bonbon.generateCircle(1.55, -0.795, 0, 0.165);
  var circle = new myObject(circleData.vertices, circleData.faces, circleData.colors, shader_vertex_source, shader_fragment_source);
  circle.setup();

  // tangan
  var leftHandData = bonbon.generateBodyParts(1.4, -0.67, 0, 0.04, 50, 1.2, 4, 1.2, 0, 0, LIBS.degToRad(-45));
  var leftHand = new myObject(leftHandData.vertices, leftHandData.faces, leftHandData.colors, shader_vertex_source, shader_fragment_source);
  leftHand.setup();

  var rightHandData = bonbon.generateBodyParts(1.7, -0.67, 0, 0.04, 50, 1.2, 4, 1.2, 0, 0, LIBS.degToRad(45));
  var rightHand = new myObject(rightHandData.vertices, rightHandData.faces, rightHandData.colors, shader_vertex_source, shader_fragment_source);
  rightHand.setup();

  // kaki
  var leftLegData = bonbon.generateBodyParts(1.47, -0.795, 0, 0.04, 50, 1.2, 2.5, 1.2, 0, 0, 0);
  var leftLeg = new myObject(leftLegData.vertices, leftLegData.faces, leftLegData.colors, shader_vertex_source, shader_fragment_source);
  leftLeg.setup();

  var rightLegData = bonbon.generateBodyParts(1.63, -0.795, 0, 0.04, 50, 1.2, 2.5, 1.2, 0, 0, 0);
  var rightLeg = new myObject(rightLegData.vertices, rightLegData.faces, rightLegData.colors, shader_vertex_source, shader_fragment_source);
  rightLeg.setup();

  // mulut dan alis
  var mouthData = bonbon.generateCurves(
    [
      [1.51, -0.61],
      [1.51, -0.66],
      [1.59, -0.66],
      [1.59, -0.61],
    ],
    0.165,
    100
  );
  var mouth = new myObject(mouthData.vertices, mouthData.faces, mouthData.colors, shader_vertex_source, shader_fragment_source);
  mouth.setup();

  var leftEyebrowData = bonbon.generateCurves(
    [
      [1.38, -0.4],
      [1.4, -0.35],
      [1.46, -0.35],
      [1.48, -0.4],
    ],
    0.245,
    100
  );
  var leftEyebrow = new myObject(leftEyebrowData.vertices, leftEyebrowData.faces, leftEyebrowData.colors, shader_vertex_source, shader_fragment_source);
  leftEyebrow.setup();

  var rightEyebrowData = bonbon.generateCurves(
    [
      [1.62, -0.4],
      [1.64, -0.35],
      [1.7, -0.35],
      [1.72, -0.4],
    ],
    0.245,
    100
  );
  var rightEyebrow = new myObject(rightEyebrowData.vertices, rightEyebrowData.faces, rightEyebrowData.colors, shader_vertex_source, shader_fragment_source);
  rightEyebrow.setup();

  /* WOOPY */
  //Badan Kepala
  var w_badankepalaData = woopy.generateBadan(0.1, -0.519, 0.4, 0.25, 50);
  var w_badankepala = new myObject(w_badankepalaData.vertices, w_badankepalaData.faces, w_badankepalaData.colors, shader_vertex_source, shader_fragment_source);
  w_badankepala.setup();

  // Telinga Kiri
  var w_telingaKiriData = woopy.generateTelinga(0.29, -0.199, 0.4, 0.072, 50, 1, 1, 1, -0.3, 0.6, 0);
  var w_telingaKiri = new myObject(w_telingaKiriData.vertices, w_telingaKiriData.faces, w_telingaKiriData.colors, shader_vertex_source, shader_fragment_source);
  w_telingaKiri.setup();

  // Telinga Kanan
  var w_telingaKananData = woopy.generateTelinga(-0.09, -0.199, 0.4, 0.072, 50, 1, 1, 1, -0.3, -0.6, 0);
  var w_telingaKanan = new myObject(w_telingaKananData.vertices, w_telingaKananData.faces, w_telingaKananData.colors, shader_vertex_source, shader_fragment_source);
  w_telingaKanan.setup();

  // Wajah
  var w_wajahData = woopy.generateWajah(0.1, -0.519, 0.475, 0.2, 50);
  var w_wajah = new myObject(w_wajahData.vertices, w_wajahData.faces, w_wajahData.colors, shader_vertex_source, shader_fragment_source);
  w_wajah.setup();

  // Pipi Kanan
  var w_pipiKananData = woopy.generatePipi(-0.052, -0.542, 0.62, 0.04, 50);
  var w_pipiKanan = new myObject(w_pipiKananData.vertices, w_pipiKananData.faces, w_pipiKananData.colors, shader_vertex_source, shader_fragment_source);
  w_pipiKanan.setup();

  //Pipi Kiri
  var w_pipiKiriData = woopy.generatePipi(0.245, -0.542, 0.62, 0.04, 50);
  var w_pipiKiri = new myObject(w_pipiKiriData.vertices, w_pipiKiriData.faces, w_pipiKiriData.colors, shader_vertex_source, shader_fragment_source);
  w_pipiKiri.setup();

  // Kaki Kanan
  var w_kakiKananData = woopy.generateKaki(-0.063, -0.769, 0.4, 0.175, 1.1, 50, 0, 0, 0);
  var w_kakiKanan = new myObject(w_kakiKananData.vertices, w_kakiKananData.faces, w_kakiKananData.colors, shader_vertex_source, shader_fragment_source);
  w_kakiKanan.setup();

  // Kaki Kiri
  var w_kakiKiriData = woopy.generateKaki(0.25, -0.769, 0.4, 0.175, 1.1, 50, 0, 0, 0);
  var w_kakiKiri = new myObject(w_kakiKiriData.vertices, w_kakiKiriData.faces, w_kakiKiriData.colors, shader_vertex_source, shader_fragment_source);
  w_kakiKiri.setup();

  // Tangan kanan
  var w_tanganKananData = woopy.generateTangan(-0.23, -0.609, 0.4, 0.15, 1.5, 50, 0, 0, LIBS.degToRad(-45));
  var w_tanganKanan = new myObject(w_tanganKananData.vertices, w_tanganKananData.faces, w_tanganKananData.colors, shader_vertex_source, shader_fragment_source);
  w_tanganKanan.setup();

  // Tangan kiri
  var w_tanganKiriData = woopy.generateTangan(0.43, -0.609, 0.4, 0.15, 1.5, 50, 0, 0, LIBS.degToRad(45));
  var w_tanganKiri = new myObject(w_tanganKiriData.vertices, w_tanganKiriData.faces, w_tanganKiriData.colors, shader_vertex_source, shader_fragment_source);
  w_tanganKiri.setup();

  // Ujung kaki kanan
  var w_ujungKakiKananData = woopy.generateUjungKaki(-0.063, -0.864, 0.4, 0.031, 50, 0, 0, 0);
  var w_ujungKakiKanan = new myObject(w_ujungKakiKananData.vertices, w_ujungKakiKananData.faces, w_ujungKakiKananData.colors, shader_vertex_source, shader_fragment_source);
  w_ujungKakiKanan.setup();

  // Ujung kaki kiri
  var w_ujungKakiKiriData = woopy.generateUjungKaki(0.25, -0.864, 0.4, 0.031, 50, 0, 0, 0);
  var w_ujungKakiKiri = new myObject(w_ujungKakiKiriData.vertices, w_ujungKakiKiriData.faces, w_ujungKakiKiriData.colors, shader_vertex_source, shader_fragment_source);
  w_ujungKakiKiri.setup();

  // Ujung tangan kanan
  var w_ujungTanganKananData = woopy.generateUjungTangan(-0.31, -0.69, 0.4, 0.024, 50, 0, 0, LIBS.degToRad(45));
  var w_ujungTanganKanan = new myObject(w_ujungTanganKananData.vertices, w_ujungTanganKananData.faces, w_ujungTanganKananData.colors, shader_vertex_source, shader_fragment_source);
  w_ujungTanganKanan.setup();

  // Ujung tangan kiri
  var w_ujungTanganKiriData = woopy.generateUjungTangan(0.51, -0.69, 0.4, 0.024, 50, 0, 0, LIBS.degToRad(135));
  var w_ujungTanganKiri = new myObject(w_ujungTanganKiriData.vertices, w_ujungTanganKiriData.faces, w_ujungTanganKiriData.colors, shader_vertex_source, shader_fragment_source);
  w_ujungTanganKiri.setup();

  // Isi Wajah Woopy
  // Mata Kanan
  var w_mataKananData = woopy.generateMata(0.02, -0.489, 0.64, 0.03, 50);
  var w_mataKanan = new myObject(w_mataKananData.vertices, w_mataKananData.faces, w_mataKananData, shader_vertex_source, shader_fragment_source);
  w_mataKanan.setup();

  // Mata Kiri
  var w_mataKiriData = woopy.generateMata(0.18, -0.489, 0.64, 0.03, 50);
  var w_mataKiri = new myObject(w_mataKiriData.vertices, w_mataKiriData.faces, w_mataKiriData.colors, shader_vertex_source, shader_fragment_source);
  w_mataKiri.setup();

  // Hidung
  var w_HidungData = woopy.generateHidung(0.1, -0.519, 0.65, 0.034, 50);
  var w_Hidung = new myObject(w_HidungData.vertices, w_HidungData.faces, w_HidungData.colors, shader_vertex_source, shader_fragment_source);
  w_Hidung.setup();

  // Alis Kanan
  var w_alisKananData = woopy.generateCurves(
    [
      [-0.02, -0.44],
      [0, -0.43],
      [0.014, -0.42],
      [0.04, -0.43],
      [0.05, -0.44],
    ],
    0.66,
    100
  );
  var w_alisKanan = new myObject(w_alisKananData.vertices, w_alisKananData.faces, w_alisKananData.colors, shader_vertex_source, shader_fragment_source);
  w_alisKanan.setup();

  // Alis Kiri
  var w_alisKiriData = woopy.generateCurves(
    [
      [0.15, -0.44],
      [0.16, -0.43],
      [0.184, -0.42],
      [0.21, -0.43],
      [0.22, -0.44],
    ],
    0.66,
    100
  );
  var w_alisKiri = new myObject(w_alisKiriData.vertices, w_alisKiriData.faces, w_alisKiriData.colors, shader_vertex_source, shader_fragment_source);
  w_alisKiri.setup();

  // Mulut
  var w_mulutData = woopy.generateCurves(
    [
      [0.015, -0.55],
      [0.06, -0.67],
      [0.1, -0.42],
      [0.12, -0.67],
      [0.18, -0.55],
    ],
    0.675,
    100
  );
  var w_mulut = new myObject(w_mulutData.vertices, w_mulutData.faces, w_mulutData.colors, shader_vertex_source, shader_fragment_source);
  w_mulut.setup();

  /* RURU */

  //badan
  var r_badanData = ruru.generateSphere(0.8, -0.55, 0.15, 0.30, 50, 1.15, 0.9, 1);
  var r_badan = new myObject(r_badanData.vertices, r_badanData.faces, r_badanData.colors, shader_vertex_source, shader_fragment_source);
  r_badan.setup();

  //telinga kanan
  var r_telingaKananData = ruru.generateEllipticParaboloid(1, -0.25, 0.15, 0.15, 50, 0.35, 0.25, 0.35, 0, (5*Math.PI), 0.3);
  var r_telingaKanan = new myObject(r_telingaKananData.vertices, r_telingaKananData.faces, r_telingaKananData.colors, shader_vertex_source, shader_fragment_source);
  r_telingaKanan.setup();

  //telinga kiri
  var r_telingaKiriData = ruru.generateEllipticParaboloid(0.65, -0.24, 0.15, 0.15, 50, 0.35, 0.25, 0.35, 0, -(5 * Math.PI), -0.3);
  var r_telingaKiri = new myObject(r_telingaKiriData.vertices, r_telingaKiriData.faces, r_telingaKiriData.colors, shader_vertex_source, shader_fragment_source);
  r_telingaKiri.setup();

  //kaki kanan
  var r_kakiKananData = ruru.generateEllipticParaboloid1(0.97, -0.9, 0.15, 0.25, 50, 0.25, 0.25, 0.35, 0, (18 * Math.PI) / 180, 0.3);
  var r_kakiKanan = new myObject(r_kakiKananData.vertices, r_kakiKananData.faces, r_kakiKananData.colors, shader_vertex_source, shader_fragment_source);
  r_kakiKanan.setup();

  //kaki kiri
  var r_kakiKiriData = ruru.generateEllipticParaboloid1(0.65, -0.9, 0.15, 0.25, 50, 0.25, 0.25, 0.35, 0, (-18 * Math.PI) / 180, -0.3);
  var r_kakiKiri = new myObject(r_kakiKiriData.vertices, r_kakiKiriData.faces, r_kakiKiriData.colors, shader_vertex_source, shader_fragment_source);
  r_kakiKiri.setup();

  //dalam telinga kanan
  var r_dalamTelingaKananData = ruru.generateTelinga(0.97, -0.295, 0.19, 0.25, 50, 0.04, 0.01, 0.1, 0.5, 5 * Math.PI, 0.5);
  var r_dalamTelingaKanan = new myObject(r_dalamTelingaKananData.vertices, r_dalamTelingaKananData.faces, r_dalamTelingaKananData.colors, shader_vertex_source, shader_fragment_source);
  r_dalamTelingaKanan.setup();

  //dalam telinga kiri
  var r_dalamTelingaKiriData = ruru.generateTelinga(0.679, -0.284, 0.19, 0.25, 50, 0.04, 0.01, 0.1, -0.5, -(8 * Math.PI), 0.3);
  var r_dalamTelingaKiri = new myObject(r_dalamTelingaKiriData.vertices, r_dalamTelingaKiriData.faces, r_dalamTelingaKiriData.colors, shader_vertex_source, shader_fragment_source);
  r_dalamTelingaKiri.setup();

  //tangan kanan
  var r_tanganKananData = ruru.generateTangan(1.19, -0.55, 0.15, 0.20, 1, 50, 50, 0, 1.6);
  var r_tanganKanan = new myObject(r_tanganKananData.vertices, r_tanganKananData.faces, r_tanganKananData.colors, shader_vertex_source, shader_fragment_source);
  r_tanganKanan.setup();

  //tangan kiri
  var r_tanganKiriData = ruru.generateTangan(0.40, -0.55, 0.15, 0.20, 1, 50, 50, 0, 1.6);
  var r_tanganKiri = new myObject(r_tanganKiriData.vertices, r_tanganKiriData.faces, r_tanganKiriData.colors, shader_vertex_source, shader_fragment_source);
  r_tanganKiri.setup();

  //jari tangan kanan
  var r_jariTanganKananData = ruru.generateJari(1.29, -0.55, 0.15, 0.039, 50, 0, 0, 20.45, [245 / 255, 239 / 255, 230 / 255]);
  var r_jariTanganKanan = new myObject(r_jariTanganKananData.vertices, r_jariTanganKananData.faces, r_jariTanganKananData.colors, shader_vertex_source, shader_fragment_source);
  r_jariTanganKanan.setup();

  //jari tangan kiri
  var r_jariTanganKiriData = ruru.generateJari(0.30, -0.55, 0.15, 0.039, 50, 0, 0, -20.45, [245 / 255, 239 / 255, 230 / 255]);
  var r_jariTanganKiri = new myObject(r_jariTanganKiriData.vertices, r_jariTanganKiriData.faces, r_jariTanganKiriData.colors, shader_vertex_source, shader_fragment_source);
  r_jariTanganKiri.setup();

  //mata kanan
  var r_mataKananData = ruru.generateEllipsoid(0.90, -0.45, 0.428, 0.013, 50, 2.5, 0, 0, 0, [0 / 255, 0 / 255, 0 / 255]);
  var r_mataKanan = new myObject(r_mataKananData.vertices, r_mataKananData.faces, r_mataKananData.colors, shader_vertex_source, shader_fragment_source);
  r_mataKanan.setup();

  //mata kiri
  var r_mataKiriData = ruru.generateEllipsoid(0.66, -0.45, 0.418, 0.013, 50, 2.5, 0, 0, 0, [0 / 255, 0 / 255, 0 / 255]);
  var r_mataKiri = new myObject(r_mataKiriData.vertices, r_mataKiriData.faces, r_mataKiriData.colors, shader_vertex_source, shader_fragment_source);
  r_mataKiri.setup();

  //pipi kanan
  var r_pipiKananData = ruru.generateEllipsoid(0.959, -0.585, 0.425, 0.04, 50, 1.5, 0, 0, 20.45, [255 / 255, 205 / 255, 234 / 255]);
  var r_pipiKanan = new myObject(r_pipiKananData.vertices, r_pipiKananData.faces, r_pipiKananData.colors, shader_vertex_source, shader_fragment_source);
  r_pipiKanan.setup();

  //pipi kiri
  var r_pipiKiriData = ruru.generateEllipsoid(0.6, -0.585, 0.425, 0.04, 50, 1.5, 0, 0, 20.45, [255 / 255, 205 / 255, 234 / 255]);
  var r_pipiKiri = new myObject(r_pipiKiriData.vertices, r_pipiKiriData.faces, r_pipiKiriData.colors, shader_vertex_source, shader_fragment_source);
  r_pipiKiri.setup();

  //mulut 
  var r_mulutData = ruru.generateCurves(
    [
      [-0.2, -0.1],
      [-0.1, -0.3],
      [0.8, 0.1],
      [0.1, -0.3],
      [0.2, -0.1],
    ],
    0.425,
    100
  );
  var r_mulut = new myObject(r_mulutData.vertices,r_mulutData.faces, r_mulutData.colors, shader_vertex_source, shader_fragment_source);
  r_mulut.setup();

  //topi ultah
  var r_topiUltahData = ruru.generateEllipticParaboloid2(0.815, -0.1, 0.15, 0.25, 50, 0.35, 0.25, 0.7, 0, -(5 * Math.PI), 0);
  var r_topiUltah = new myObject(r_topiUltahData.vertices, r_topiUltahData.faces, r_topiUltahData.colors, shader_vertex_source, shader_fragment_source);
  r_topiUltah.setup();

  //bulat atasnya topi ultah
  var r_circleData = ruru.generateEllipsoid(0.815, -0.1, 0.15, 0.035, 50, 1, 0, 0, 20.45, [255 / 255, 205 / 255, 234 / 255]);
  var r_circle = new myObject(r_circleData.vertices, r_circleData.faces, r_circleData.colors, shader_vertex_source, shader_fragment_source);
  r_circle.setup();


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
  GL.clearColor(84 / 255, 199 / 255, 243 / 255, 1.0);

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
    /* ENVIRONMENT */
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

    // kain piknik render
    kainPiknik.render(VIEW_MATRIX, PROJECTION_MATRIX);

    // kado render
    kotakKado1.render(VIEW_MATRIX, PROJECTION_MATRIX);
    TutupkotakKado1.render(VIEW_MATRIX, PROJECTION_MATRIX);
    kotakKado2.render(VIEW_MATRIX, PROJECTION_MATRIX);
    kotakKado3.render(VIEW_MATRIX, PROJECTION_MATRIX);
    kotakKado4.render(VIEW_MATRIX, PROJECTION_MATRIX);
    kotakKado5.render(VIEW_MATRIX, PROJECTION_MATRIX);
    kotakKado6.render(VIEW_MATRIX, PROJECTION_MATRIX);
    kotakKado7.render(VIEW_MATRIX, PROJECTION_MATRIX);

    // awan satu render
    awan1_1.render(VIEW_MATRIX, PROJECTION_MATRIX);
    awan1_2.render(VIEW_MATRIX, PROJECTION_MATRIX);
    awan1_3.render(VIEW_MATRIX, PROJECTION_MATRIX);
    awan1_4.render(VIEW_MATRIX, PROJECTION_MATRIX);
    awan1_5.render(VIEW_MATRIX, PROJECTION_MATRIX);
    awan1_6.render(VIEW_MATRIX, PROJECTION_MATRIX);
    awan1_7.render(VIEW_MATRIX, PROJECTION_MATRIX);

    // awan dua render
    awan2_1.render(VIEW_MATRIX, PROJECTION_MATRIX);
    awan2_2.render(VIEW_MATRIX, PROJECTION_MATRIX);
    awan2_3.render(VIEW_MATRIX, PROJECTION_MATRIX);
    awan2_4.render(VIEW_MATRIX, PROJECTION_MATRIX);
    awan2_5.render(VIEW_MATRIX, PROJECTION_MATRIX);
    awan2_6.render(VIEW_MATRIX, PROJECTION_MATRIX);

    // awan tiga render
    awan3_1.render(VIEW_MATRIX, PROJECTION_MATRIX);
    awan3_2.render(VIEW_MATRIX, PROJECTION_MATRIX);
    awan3_3.render(VIEW_MATRIX, PROJECTION_MATRIX);
    awan3_4.render(VIEW_MATRIX, PROJECTION_MATRIX);
    awan3_5.render(VIEW_MATRIX, PROJECTION_MATRIX);

    // pohon satu render
    batang.render(VIEW_MATRIX, PROJECTION_MATRIX);
    daunCone1.render(VIEW_MATRIX, PROJECTION_MATRIX);
    daunCone2.render(VIEW_MATRIX, PROJECTION_MATRIX);

    // pohon dua render
    batang1.render(VIEW_MATRIX, PROJECTION_MATRIX);
    daunCone3.render(VIEW_MATRIX, PROJECTION_MATRIX);
    daunCone4.render(VIEW_MATRIX, PROJECTION_MATRIX);

    // kue layer satu render
    kue1.render(VIEW_MATRIX, PROJECTION_MATRIX);
    kue2.render(VIEW_MATRIX, PROJECTION_MATRIX);
    kue3.render(VIEW_MATRIX, PROJECTION_MATRIX);
    tutup_kue1.render(VIEW_MATRIX, PROJECTION_MATRIX);

    // kue layer dua render
    kue4.render(VIEW_MATRIX, PROJECTION_MATRIX);
    kue5.render(VIEW_MATRIX, PROJECTION_MATRIX);
    kue6.render(VIEW_MATRIX, PROJECTION_MATRIX);
    tutup_kue2.render(VIEW_MATRIX, PROJECTION_MATRIX);

    // lilin satu render
    lilin1.render(VIEW_MATRIX, PROJECTION_MATRIX);
    tutup_lilin1.render(VIEW_MATRIX, PROJECTION_MATRIX);
    api1_lilin1_cone.render(VIEW_MATRIX, PROJECTION_MATRIX);
    api1_lilin1_ball.render(VIEW_MATRIX, PROJECTION_MATRIX);
    api2_lilin1_cone.render(VIEW_MATRIX, PROJECTION_MATRIX);
    api2_lilin1_ball.render(VIEW_MATRIX, PROJECTION_MATRIX);

    // lilin dua render
    lilin2.render(VIEW_MATRIX, PROJECTION_MATRIX);
    tutup_lilin2.render(VIEW_MATRIX, PROJECTION_MATRIX);
    api1_lilin2_cone.render(VIEW_MATRIX, PROJECTION_MATRIX);
    api1_lilin2_ball.render(VIEW_MATRIX, PROJECTION_MATRIX);
    api2_lilin2_cone.render(VIEW_MATRIX, PROJECTION_MATRIX);
    api2_lilin2_ball.render(VIEW_MATRIX, PROJECTION_MATRIX);

    // lilin tiga render
    lilin3.render(VIEW_MATRIX, PROJECTION_MATRIX);
    tutup_lilin3.render(VIEW_MATRIX, PROJECTION_MATRIX);
    api1_lilin3_cone.render(VIEW_MATRIX, PROJECTION_MATRIX);
    api1_lilin3_ball.render(VIEW_MATRIX, PROJECTION_MATRIX);
    api2_lilin3_cone.render(VIEW_MATRIX, PROJECTION_MATRIX);
    api2_lilin3_ball.render(VIEW_MATRIX, PROJECTION_MATRIX);

    // balon satu render
    balon1.render(VIEW_MATRIX, PROJECTION_MATRIX);
    ujungBalon1.render(VIEW_MATRIX, PROJECTION_MATRIX);
    tali1.renderCurves(VIEW_MATRIX, PROJECTION_MATRIX);

    // balon dua render
    balon2.render(VIEW_MATRIX, PROJECTION_MATRIX);
    ujungBalon2.render(VIEW_MATRIX, PROJECTION_MATRIX);
    tali2.renderCurves(VIEW_MATRIX, PROJECTION_MATRIX);

    // tiang satu render
    tiang1.render(VIEW_MATRIX, PROJECTION_MATRIX);
    tutup_tiang1.render(VIEW_MATRIX, PROJECTION_MATRIX);

    // tiang dua render
    tiang2.render(VIEW_MATRIX, PROJECTION_MATRIX);
    tutup_tiang2.render(VIEW_MATRIX, PROJECTION_MATRIX);

    // banner render
    bannerPapan.render(VIEW_MATRIX, PROJECTION_MATRIX);

    /* RURU */
    r_badan.render(VIEW_MATRIX, PROJECTION_MATRIX);
    r_telingaKanan.render(VIEW_MATRIX, PROJECTION_MATRIX);
    r_telingaKiri.render(VIEW_MATRIX, PROJECTION_MATRIX);
    r_kakiKanan.render(VIEW_MATRIX, PROJECTION_MATRIX);
    r_kakiKiri.render(VIEW_MATRIX, PROJECTION_MATRIX);
    r_dalamTelingaKanan.render(VIEW_MATRIX, PROJECTION_MATRIX);
    r_dalamTelingaKiri.render(VIEW_MATRIX, PROJECTION_MATRIX);
    r_tanganKanan.render(VIEW_MATRIX, PROJECTION_MATRIX);
    r_tanganKiri.render(VIEW_MATRIX, PROJECTION_MATRIX);
    r_jariTanganKanan.render(VIEW_MATRIX, PROJECTION_MATRIX);
    r_jariTanganKiri.render(VIEW_MATRIX, PROJECTION_MATRIX);
    r_mataKanan.render(VIEW_MATRIX, PROJECTION_MATRIX);
    r_mataKiri.render(VIEW_MATRIX, PROJECTION_MATRIX);
    r_pipiKanan.render(VIEW_MATRIX, PROJECTION_MATRIX);
    r_pipiKiri.render(VIEW_MATRIX, PROJECTION_MATRIX);
    r_mulut.render(VIEW_MATRIX, PROJECTION_MATRIX);
    r_topiUltah.render(VIEW_MATRIX, PROJECTION_MATRIX);
    r_circle.render(VIEW_MATRIX, PROJECTION_MATRIX);

    // /* BONBON */
    leftHead.render(VIEW_MATRIX, PROJECTION_MATRIX);
    rightHead.render(VIEW_MATRIX, PROJECTION_MATRIX);
    leftEye.render(VIEW_MATRIX, PROJECTION_MATRIX);
    rightEye.render(VIEW_MATRIX, PROJECTION_MATRIX);
    leftEyeHorizontal.render(VIEW_MATRIX, PROJECTION_MATRIX);
    leftEyeVertical.render(VIEW_MATRIX, PROJECTION_MATRIX);
    rightEyeHorizontal.render(VIEW_MATRIX, PROJECTION_MATRIX);
    rightEyeVertical.render(VIEW_MATRIX, PROJECTION_MATRIX);
    body.render(VIEW_MATRIX, PROJECTION_MATRIX);
    circle.render(VIEW_MATRIX, PROJECTION_MATRIX);
    leftHand.render(VIEW_MATRIX, PROJECTION_MATRIX);
    rightHand.render(VIEW_MATRIX, PROJECTION_MATRIX);
    leftLeg.render(VIEW_MATRIX, PROJECTION_MATRIX);
    rightLeg.render(VIEW_MATRIX, PROJECTION_MATRIX);
    mouth.renderCurves(VIEW_MATRIX, PROJECTION_MATRIX);
    leftEyebrow.renderCurves(VIEW_MATRIX, PROJECTION_MATRIX);
    rightEyebrow.renderCurves(VIEW_MATRIX, PROJECTION_MATRIX);

    /* WOOPY */
    w_badankepala.render(VIEW_MATRIX, PROJECTION_MATRIX);
    w_telingaKiri.render(VIEW_MATRIX, PROJECTION_MATRIX);
    w_telingaKanan.render(VIEW_MATRIX, PROJECTION_MATRIX);
    w_wajah.render(VIEW_MATRIX, PROJECTION_MATRIX);
    w_pipiKanan.render(VIEW_MATRIX, PROJECTION_MATRIX);
    w_pipiKiri.render(VIEW_MATRIX, PROJECTION_MATRIX);
    w_kakiKanan.render(VIEW_MATRIX, PROJECTION_MATRIX);
    w_kakiKiri.render(VIEW_MATRIX, PROJECTION_MATRIX);
    w_tanganKanan.render(VIEW_MATRIX, PROJECTION_MATRIX);
    w_tanganKiri.render(VIEW_MATRIX, PROJECTION_MATRIX);
    w_ujungKakiKanan.render(VIEW_MATRIX, PROJECTION_MATRIX);
    w_ujungKakiKiri.render(VIEW_MATRIX, PROJECTION_MATRIX);
    w_ujungTanganKanan.render(VIEW_MATRIX, PROJECTION_MATRIX);
    w_ujungTanganKiri.render(VIEW_MATRIX, PROJECTION_MATRIX);
    w_mataKanan.render(VIEW_MATRIX, PROJECTION_MATRIX);
    w_mataKiri.render(VIEW_MATRIX, PROJECTION_MATRIX);
    w_Hidung.render(VIEW_MATRIX, PROJECTION_MATRIX);
    w_mulut.render(VIEW_MATRIX, PROJECTION_MATRIX);
    w_alisKanan.render(VIEW_MATRIX, PROJECTION_MATRIX);
    w_alisKiri.render(VIEW_MATRIX, PROJECTION_MATRIX);

    GL.flush();

    window.requestAnimationFrame(animate);
  };

  animate(0);
}

window.addEventListener('load', main);
