var environment = {
  // normalize screen
  normalizeScreen: function (x, y, width, height) {
    var nx = (2 * x) / width - 1;
    var ny = (-2 * y) / height + 1;
    return [nx, ny];
  },

  //Half Sphere
  generateHalfSphere: function (x, y, z, radius, segments, warna) {
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
  },

  //Sphere
  generateBall: function (x, y, z, radius, segments, warna) {
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
  },

  // Elliptic Paraboloid
  generateEllipticParboloid: function (x, y, z, radius, segments, rotationX, rotationY, rotationZ, warna) {
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
  },

  // Ellipsoid
  generateEllipsoid: function (x, y, z, radius, segments, ovalY, warna) {
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
  },

  // Cube bisa adjust
  generateKotak: function (xmin, x, ymin, y, zmin, z, segments, warna) {
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
  },

  // Tabung
  generateTabung: function (x, y, z, radius, height, segments, warna) {
    var vertices = [];
    var colors = [];

    var rainbowColors = [warna];

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
  },

  // generate circle untuk tutup tabung
  generateCircle: function (x, y, z, radius, warna) {
    var vertices = [];
    var colors = [];

    var rainbowColors = [warna];

    for (let i = 0; i < 360; i++) {
      var a = radius * Math.cos((i / 180) * Math.PI) + x;
      var b = radius * Math.sin((i / 180) * Math.PI) + z;
      vertices.push(a, y, b);

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
  },

  // generate curves
  generateCurves: function (object, z, segments) {
    var vertices = [];
    var colors = [];

    var rainbowColors = [[0, 0, 0]];

    for (var i = 0; i <= segments; i++) {
      var t = i / segments;
      var x = Math.pow(1 - t, 4) * object[0][0] + 4 * Math.pow(1 - t, 3) * t * object[1][0] + 6 * Math.pow(1 - t, 2) * Math.pow(t, 2) * object[2][0] + 4 * (1 - t) * Math.pow(t, 3) * object[3][0] + Math.pow(t, 4) * object[4][0];
      var y = Math.pow(1 - t, 4) * object[0][1] + 4 * Math.pow(1 - t, 3) * t * object[1][1] + 6 * Math.pow(1 - t, 2) * Math.pow(t, 2) * object[2][1] + 4 * (1 - t) * Math.pow(t, 3) * object[3][1] + Math.pow(t, 4) * object[4][1];

      //   // Add vertices for the thicker lines
      //   vertices.push(x - 0.01, y - 0.01, z); // offset for thickness
      //   vertices.push(x + 0.01, y - 0.01, z);
      vertices.push(x, y, z);

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
  },
};
