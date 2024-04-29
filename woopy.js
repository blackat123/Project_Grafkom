var woopy = {
  // normalize screen
  normalizeScreen: function (x, y, width, height) {
    var nx = (2 * x) / width - 1;
    var ny = (-2 * y) / height + 1;
    return [nx, ny];
  },

  // Ellipsoid (untuk badan)
  generateBadan: function (x, y, z, radius, segments) {
    var vertices = [];
    var colors = [];
    var center = [x, y, z]; // Center point of the sphere
    var rainbowColors = [
      [21 / 255, 76 / 255, 121 / 255], //warna : #042f66
    ];

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
        var vertexX = x + radius * xCoord * 1.35;
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
    return { vertices: vertices, colors: colors, faces: faces, center: center };
  },

  // Elliptic Cone (untuk telinga)
  generateTelinga: function (x, y, z, radius, segments, scaleX, scaleY, scaleZ, rotationX, rotationY, rotationZ) {
    var vertices = [];
    var colors = [];
    var rainbowColors = [
      [228 / 255, 24 / 255, 61 / 255],
    ];

    for (var i = 0; i <= segments; i++) {
      var latAngle = Math.PI * (-0.5 + i / segments);
      var vLat = latAngle;
      for (var j = 0; j <= segments; j++) {
        var lonAngle = 2 * Math.PI * Math.max(0, j / segments);
        var sinLon = Math.sin(lonAngle);
        var cosLon = Math.cos(lonAngle);
        var xCoord = cosLon * vLat * scaleX;
        var yCoord = -Math.pow(vLat, 2) * scaleY;
        var zCoord = sinLon * vLat * scaleZ;

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

  // Ellipsoid (untuk wajah)
  generateWajah: function (x, y, z, radius, segments) {
    var vertices = [];
    var colors = [];
    var rainbowColors = [
      [255 / 225, 255 / 225, 255 / 255], //warna : #ffffff
    ];

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
        var vertexX = x + radius * xCoord * 1.35;
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

  //Pipi
  generatePipi: function (x, y, z, radius, segments) {
      var vertices = [];
    var colors = [];
    var rainbowColors = [[238 / 255, 227 / 255, 51 / 255]];

    for (var i = 0; i <= segments; i++) {
      var latAngle = Math.PI * (-0.5 + i / segments);
      var sinLat = Math.sin(latAngle);
      var cosLat = Math.cos(latAngle);

      for (var j = 0; j <= segments; j++) {
        var lonAngle = 2 * Math.PI * (j / segments);
        var sinLon = Math.sin(lonAngle);
        var cosLon = Math.cos(lonAngle);

        var xCoord = sinLon * cosLat;
        var yCoord = sinLat;
        var zCoord = cosLon * cosLat;

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

  //Tabung (untuk kaki)
  generateKaki: function (x, y, z, radius, height, segments, rotationX, rotationY, rotationZ) {
    var vertices = [];
    var colors = [];
    var rainbowColors = [
      [21 / 255, 76 / 255, 121 / 255] //warna : #042f66
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

  //Tabung (untuk tangan)
  generateTangan: function (x, y, z, radius, height, segments, rotationX, rotationY, rotationZ) {
    var vertices = [];
    var colors = [];
    var rainbowColors = [
      [21 / 255, 76 / 255, 121 / 255] //warna : #042f66
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

  // Half Ellipsoid (untuk ujung kaki)
  generateUjungKaki: function (x, y, z, radius, segments) {
    var vertices = [];
    var colors = [];
    var rainbowColors = [[255 / 255, 255 / 255, 255 / 255]];

    for (var i = 0; i <= segments / 2; i++) {
      var latAngle = Math.PI * (-0.5 + i / segments);
      var sinLat = Math.sin(latAngle);
      var cosLat = Math.cos(latAngle);

      for (var j = 0; j <= segments; j++) {
        var lonAngle = 2 * Math.PI * (j / segments);
        var sinLon = Math.sin(lonAngle);
        var cosLon = Math.cos(lonAngle);

        var xCoord = sinLon * cosLat;
        var yCoord = sinLat;
        var zCoord = cosLon * cosLat;

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

  // Half Sphere (untuk ujung tangan)
  generateUjungTangan: function (x, y, z, radius, segments, rotationX, rotationY, rotationZ) {
    var vertices = [];
    var colors = [];
    var rainbowColors = [[255 / 255, 255 / 255, 255 / 255]];

    for (var i = 0; i <= segments / 2; i++) {
      var latAngle = Math.PI * (-0.5 + i / segments);
      var sinLat = Math.sin(latAngle);
      var cosLat = Math.cos(latAngle);

      for (var j = 0; j <= segments; j++) {
        var lonAngle = 2 * Math.PI * (j / segments);
        var sinLon = Math.sin(lonAngle);
        var cosLon = Math.cos(lonAngle);

        var xCoord = sinLat;
        var yCoord = sinLon * cosLat;
        var zCoord = cosLon * cosLat;

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

  // Sphere (untuk mata)
  generateMata: function (x, y, z, radius, segments) {
    var vertices = [];
    var colors = [];

    var rainbowColors = [[0 / 255, 0 / 255, 0 / 255]];

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

  // Ellipsoid (untuk hidung)
  generateHidung: function (x, y, z, radius, segments) {
    var vertices = [];
    var colors = [];

    var rainbowColors = [[232 / 255, 23 / 255, 61 / 255]];

    for (var i = 0; i <= segments; i++) {
      var latAngle = Math.PI * (-0.5 + i / segments);
      var sinLat = Math.sin(latAngle);
      var cosLat = Math.cos(latAngle);

      for (var j = 0; j <= segments; j++) {
        var lonAngle = 2 * Math.PI * (j / segments);
        var sinLon = Math.sin(lonAngle);
        var cosLon = Math.cos(lonAngle);

        var xCoord = cosLon * cosLat * 1.6;
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

  // generate curves
  generateCurves: function (object, z, segments) {
  var vertices = [];
  var colors = [];

  var rainbowColors = [[0, 0, 0]];

  for (var i = 0; i <= segments; i++) {
    var t = i / segments;
    var x = Math.pow(1 - t, 4) * object[0][0] + 4 * Math.pow(1 - t, 3) * t * object[1][0] + 6 * Math.pow(1 - t, 2) * Math.pow(t, 2) * object[2][0] + 4 * (1 - t) * Math.pow(t, 3) * object[3][0] + Math.pow(t, 4) * object[4][0];
    var y = Math.pow(1 - t, 4) * object[0][1] + 4 * Math.pow(1 - t, 3) * t * object[1][1] + 6 * Math.pow(1 - t, 2) * Math.pow(t, 2) * object[2][1] + 4 * (1 - t) * Math.pow(t, 3) * object[3][1] + Math.pow(t, 4) * object[4][1];

    // Add vertices for the thicker lines
    vertices.push(x - 0.006, y - 0.006, z); // offset for thickness
    vertices.push(x + 0.006, y - 0.006, z);
    vertices.push(x, y + 0.006, z);

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
