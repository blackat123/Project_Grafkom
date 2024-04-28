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
  colors = []

  SHADER_PROGRAM = null;
  _color = null;
  _position = null;

  _MMatrix = LIBS.get_I4();
  _PMatrix = LIBS.get_I4();
  _VMatrix = LIBS.get_I4();

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
  }

  setup() {
    //vbo
    GL.bindBuffer(GL.ARRAY_BUFFER, this.cube_vbo);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(this.vertex), GL.STATIC_DRAW);

    // ebo
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.cube_ebo);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.faces), GL.STATIC_DRAW);

    this.childs.forEach((childs) => {
      childs.setup();
    });
  }

  render(VIEW_MATRIX, PROJECTION_MATRIX) {
    GL.useProgram(this.SHADER_PROGRAM);
    GL.bindBuffer(GL.ARRAY_BUFFER, this.cube_vbo);
    GL.bindBuffer(GL.ELEMENTS_ARRAY_BUFFER, this.cube_ebo);

    GL.vertexAttribPointer(this.position_vao, 3, GL.FLOAT, false, 4 * (3 + 3), 0);
    GL.vertexAttribPointer(this.color_vao, 3, GL.FLOAT, false, 4 * (3 + 3), 3 * 4);

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
