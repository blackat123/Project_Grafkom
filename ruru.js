var ruru={

    // normalize screen
    normalizeScreen : function(x, y, width, height) {
        var nx = (2 * x) / width - 1;
        var ny = (-2 * y) / height + 1;
        return [nx, ny];
      },
    
    // Kepala
    generateSphere :  function (x, y, z, radius, segments, scaleX, scaleY, scaleZ) {
        var vertices = [];
        var colors = [];
    
        var rainbowColors = [
            [245 / 255, 239 / 255, 230 / 255]
        ];
    
        for (var i = 0; i <= segments; i++) {
            var latAngle = Math.PI * (-0.5 + (i / segments));
            var sinLat = Math.sin(latAngle);
            var cosLat = Math.cos(latAngle);
            
            for (var j = 0; j <= segments; j++) {
                var lonAngle = 2 * Math.PI * (j / segments);
                var sinLon = Math.sin(lonAngle);
                var cosLon = Math.cos(lonAngle);
    
                var xCoord = cosLon * cosLat * scaleX;
                var yCoord = sinLon * cosLat * scaleY;
                var zCoord = sinLat * scaleZ;
    
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
    
    //telinga
    generateEllipticParaboloid : function(x, y, z, radius, segments, scaleX, scaleY, scaleZ, rotasiX, rotasiY, rotasiZ) {
        var vertices = [];
        var colors = [];
    
        var angleIncrement = (2 * Math.PI) / segments;
    
        var rainbowColors = [
            [2245 / 255, 239 / 255, 230 / 255]
        ];
    
        for (var i = 0; i <= segments; i++) {
            var latAngle = Math.PI * (-0.5 + (i / segments));
            var vLat = latAngle;
    
            for (var j = 0; j <= segments; j++) {
                var lonAngle = 2 * Math.PI * Math.max(0, (j / segments));
                var sinLon = Math.sin(lonAngle);
                var cosLon = Math.cos(lonAngle);
    
                var xCoord = cosLon * vLat * scaleX;
                var zCoord = sinLon * vLat * scaleY;
                var yCoord = -Math.pow(vLat, 2) * scaleZ;
    
                // Rotasi
                var rotatedX = xCoord * Math.cos(rotasiZ) - yCoord * Math.sin(rotasiZ);
                var rotatedY = xCoord * Math.sin(rotasiZ) + yCoord * Math.cos(rotasiZ);
                var rotatedZ = zCoord;
    
                // Pemutaran tambahan untuk diagonal
                rotatedY = rotatedY * Math.cos(rotasiX) - rotatedZ * Math.sin(rotasiX);
                rotatedZ = rotatedY * Math.sin(rotasiX) + rotatedZ * Math.cos(rotasiX);
                rotatedX = rotatedX * Math.cos(rotasiY) - rotatedZ * Math.sin(rotasiY);
                rotatedZ = rotatedX * Math.sin(rotasiY) + rotatedZ * Math.cos(rotasiY);
                var vertexX = x + rotatedX * radius;
                var vertexY = y + rotatedY * radius;
                var vertexZ = z + rotatedZ * radius;
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
    
    //kaki
    generateEllipticParaboloid1: function(x, y, z, radius, segments, scaleX, scaleY, scaleZ, rotasiX, rotasiY, rotasiZ) {
        var vertices = [];
        var colors = [];
    
        var angleIncrement = (2 * Math.PI) / segments;
    
        var rainbowColors = [
            [245 / 255, 239 / 255, 230 / 255]
        ];
    
        for (var i = 0; i <= segments; i++) {
            var latAngle = Math.PI * (-0.5 + (i / segments));
            var vLat = latAngle;
    
            for (var j = 0; j <= segments; j++) {
                var lonAngle = 2 * Math.PI * Math.max(0, (j / segments));
                var sinLon = Math.sin(lonAngle);
                var cosLon = Math.cos(lonAngle);
    
                var xCoord = cosLon * vLat * scaleX;
                var zCoord = sinLon * vLat * scaleY;
                var yCoord = Math.pow(vLat, 2) * scaleZ;
    
                // Rotasi
                var rotatedX = xCoord * Math.cos(rotasiZ) - yCoord * Math.sin(rotasiZ);
                var rotatedY = xCoord * Math.sin(rotasiZ) + yCoord * Math.cos(rotasiZ);
                var rotatedZ = zCoord;
    
                // Pemutaran tambahan untuk diagonal
                rotatedY = rotatedY * Math.cos(rotasiX) - rotatedZ * Math.sin(rotasiX);
                rotatedZ = rotatedY * Math.sin(rotasiX) + rotatedZ * Math.cos(rotasiX);
                rotatedX = rotatedX * Math.cos(rotasiY) - rotatedZ * Math.sin(rotasiY);
                rotatedZ = rotatedX * Math.sin(rotasiY) + rotatedZ * Math.cos(rotasiY);
    
                var vertexX = x + rotatedX * radius;
                var vertexY = y + rotatedY * radius;
                var vertexZ = z + rotatedZ * radius;
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
    
    //dalamnya telinga
    generateTelinga: function(x, y, z, radius, segments, scaleX, scaleY, scaleZ, rotasiX, rotasiY, rotasiZ) {
        var vertices = [];
        var colors = [];
    
        var rainbowColors = [
            [255 / 255, 205 / 255, 234 / 255]
        ];
    
        for (var i = 0; i <= segments; i++) {
            var latAngle = Math.PI * (-0.5 + (i / segments));
            var sinLat = Math.sin(latAngle);
            var cosLat = Math.cos(latAngle);
            for (var j = 0; j <= segments; j++) {
                var lonAngle = 2 * Math.PI * (j / segments);
                var sinLon = Math.sin(lonAngle);
                var cosLon = Math.cos(lonAngle);
                
                var xCoord = cosLon * cosLat * scaleX;
                var zCoord = sinLon * cosLat * scaleY;
                var yCoord = sinLat * scaleZ;
    
                 // Rotasi
                 var rotatedX = xCoord * Math.cos(rotasiZ) - yCoord * Math.sin(rotasiZ);
                 var rotatedY = xCoord * Math.sin(rotasiZ) + yCoord * Math.cos(rotasiZ);
                 var rotatedZ = zCoord;
     
                 // Pemutaran tambahan untuk diagonal
                 rotatedY = rotatedY * Math.cos(rotasiX) - rotatedZ * Math.sin(rotasiX);
                 rotatedZ = rotatedY * Math.sin(rotasiX) + rotatedZ * Math.cos(rotasiX);
                 rotatedX = rotatedX * Math.cos(rotasiY) - rotatedZ * Math.sin(rotasiY);
                 rotatedZ = rotatedX * Math.sin(rotasiY) + rotatedZ * Math.cos(rotasiY);
     
                 var vertexX = x + rotatedX * radius;
                 var vertexY = y + rotatedY * radius;
                 var vertexZ = z + rotatedZ * radius;
    
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
    
    //tangan
    generateTangan: function(x, y, z, radius, height, segments, rotationX, rotationY, rotationZ) {
        var vertices = [];
        var colors = [];
        var rainbowColors = [
          [245 / 255, 239 / 255, 230 / 255], 
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
      },
    
    // jari tangan
    generateJari:function(x, y, z, radius, segments, rotationX, rotationY, rotationZ, warna) {
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
    
    // mata dan pipi
    generateEllipsoid: function(x, y, z, radius, segments, ovalY, rotationX, rotationY, rotationZ,warna) {
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
    
    //topi
    generateEllipticParaboloid2:function(x, y, z, radius, segments, scaleX, scaleY, scaleZ, rotasiX, rotasiY, rotasiZ) {
        var vertices = [];
        var colors = [];
    
        var angleIncrement = (2 * Math.PI) / segments;
    
        var rainbowColors = [
            [243 / 255, 177 / 255, 205 / 255]
        ];
    
        for (var i = 0; i <= segments; i++) {
            var latAngle = Math.PI * (-0.5 + (i / segments));
            var vLat = latAngle;
    
            for (var j = 0; j <= segments; j++) {
                var lonAngle = 2 * Math.PI * Math.max(0, (j / segments));
                var sinLon = Math.sin(lonAngle);
                var cosLon = Math.cos(lonAngle);
    
                var xCoord = cosLon * vLat * scaleX;
                var zCoord = sinLon * vLat * scaleY;
                var yCoord = -Math.pow(vLat, 2) * scaleZ;
    
                // Rotasi
                var rotatedX = xCoord * Math.cos(rotasiZ) - yCoord * Math.sin(rotasiZ);
                var rotatedY = xCoord * Math.sin(rotasiZ) + yCoord * Math.cos(rotasiZ);
                var rotatedZ = zCoord;
    
                // Pemutaran tambahan untuk diagonal
                rotatedY = rotatedY * Math.cos(rotasiX) - rotatedZ * Math.sin(rotasiX);
                rotatedZ = rotatedY * Math.sin(rotasiX) + rotatedZ * Math.cos(rotasiX);
                rotatedX = rotatedX * Math.cos(rotasiY) - rotatedZ * Math.sin(rotasiY);
                rotatedZ = rotatedX * Math.sin(rotasiY) + rotatedZ * Math.cos(rotasiY);
                var vertexX = x + rotatedX * radius;
                var vertexY = y + rotatedY * radius;
                var vertexZ = z + rotatedZ * radius;
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
    
    // mulut
    // generate curves
    generateCurves:function(object, z, segments) {
        var vertices = [];
        var colors = [];
      
        var rainbowColors = [[0, 0, 0]];
      
        for (var i = 0; i <= segments; i++) {
          var t = i / segments;
          var x = Math.pow(1 - t, 4) * object[0][0] + 4 * Math.pow(1 - t, 3) * t * object[1][0] + 6 * Math.pow(1 - t, 2) * Math.pow(t, 2) * object[2][0] + 4 * (1 - t) * Math.pow(t, 3) * object[3][0] + Math.pow(t, 4) * object[4][0];
            var y = Math.pow(1 - t, 4) * object[0][1] + 4 * Math.pow(1 - t, 3) * t * object[1][1] + 6 * Math.pow(1 - t, 2) * Math.pow(t, 2) * object[2][1] + 4 * (1 - t) * Math.pow(t, 3) * object[3][1] + Math.pow(t, 4) * object[4][1];
      
          // Add vertices for the thicker lines
          vertices.push(x - 0.01, y - 0.01, z); // offset for thickness
          vertices.push(x + 0.01, y - 0.01, z);
          vertices.push(x, y + 0.01, z);
      
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
    };