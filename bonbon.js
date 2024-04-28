var bonbon = {
  // normalize screen
  normalizeScreen: function (x, y, width, height) {
    var nx = (2 * x) / width - 1;
    var ny = (-2 * y) / height + 1;
    return [nx, ny];
  },

  // generate heart
  generateHead: function (x, y, z, radius, segments) {
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

  // generate eyes
  generateEyes: function (x, y, z, radius, segments, scaleX, scaleY, scaleZ, rotationX, rotationY, rotationZ, warna) {
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
        var yCoord = sinLon * cosLat * 1.4 * scaleY;
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
  },

  // generate body parts
  generateBodyParts: function (x, y, z, radius, segments, scaleX, scaleY, scaleZ, rotationX, rotationY, rotationZ) {
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
  },

  // generate badan
  generateBody: function (x, y, z, radius, height, segments) {
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
  },

  // generate circle
  generateCircle: function (x, y, z, radius) {
    var vertices = [];
    var colors = [];

    var rainbowColors = [[209 / 255, 210 / 255, 212 / 255]];

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
      var x = Math.pow(1 - t, 3) * object[0][0] + 3 * Math.pow(1 - t, 2) * t * object[1][0] + 3 * (1 - t) * Math.pow(t, 2) * object[2][0] + Math.pow(t, 3) * object[3][0];
      var y = Math.pow(1 - t, 3) * object[0][1] + 3 * Math.pow(1 - t, 2) * t * object[1][1] + 3 * (1 - t) * Math.pow(t, 2) * object[2][1] + Math.pow(t, 3) * object[3][1];

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
