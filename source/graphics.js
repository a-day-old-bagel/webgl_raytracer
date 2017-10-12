var graphics = {

  gl: undefined,

  shdr_prog: undefined,
  shdr_time: 0.0,
  shdr_scrInfo: undefined,

  scrInfo: undefined,

  // width: undefined,
  // height: undefined,
  // aspect: undefined,

  render: function() {
    gl.clear(gl.DEPTH_BUFFER_BIT);
    camera.updateVPMat();

    gl.useProgram(this.shdr_prog);
    this.drawSky(this.sky);
  },

  drawSky: function() {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.skyVertexBuffer);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    gl.uniform1f(this.shdr_time, physics.totalTime * 0.1)
    gl.uniform3f(this.shdr_scrInfo, this.scrInfo[0], this.scrInfo[1], this.scrInfo[2]);

    gl.drawArrays(gl.TRIANGLES, 0, this.skyVertCount);
  },

  initSky: function() {
    this.skyVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.skyVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW);
    this.skyVertCount = 3;
  },

  loadCubeMap: function(base, extension, targetTex, targetTexChannel, callback) {
    gl.activeTexture(targetTexChannel);
    targetTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, targetTex);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER,
      gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    var faces = [['posx.' + extension, gl.TEXTURE_CUBE_MAP_POSITIVE_X],
                 ['negx.' + extension, gl.TEXTURE_CUBE_MAP_NEGATIVE_X],
                 ['posy.' + extension, gl.TEXTURE_CUBE_MAP_POSITIVE_Y],
                 ['negy.' + extension, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y],
                 ['posz.' + extension, gl.TEXTURE_CUBE_MAP_POSITIVE_Z],
                 ['negz.' + extension, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z]];
    for (var i = 0; i < faces.length; ++i) {
      var face = faces[i][1];
      var image = new Image();
      image.onload = callback(targetTex, face, image);
      image.src = base + '/' + faces[i][0];
    }
  },

  init: function(canvas) {
    // Initialize WebGL
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
      alert("WebGL isn't available");
    } else {
      console.log('WebGL Initialized.');
    }
    this.width = canvas.width;
    this.height = canvas.height;

    // Configure WebGL
    gl.viewport(0, 0, this.width, this.height);
    gl.clearColor(0.25, 0.18, 0.1, 1.0);
    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CCW);
    gl.enable(gl.CULL_FACE);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.DEPTH_TEST);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);

    // Background shader
    this.shdr_prog = initShaders(gl, 'ray.vert', 'ray.frag');
    this.shdr_time = gl.getUniformLocation(this.shdr_prog, 'time');
    this.shdr_scrInfo = gl.getUniformLocation(this.shdr_prog, 'scrInfo');

    // Configure Camera
    camera.setAspectX(canvas.width);
    camera.setAspectY(canvas.height);
    camera.zoomedFocus = [0, 0, 0];
    camera.zoomedFTarget = camera.zoomedFocus;

    this.scrInfo = [canvas.width, canvas.height, canvas.height / canvas.width];

    this.initSky();

    // At most 2 attributes per vertex will be used in any shader.
    gl.enableVertexAttribArray(0);
  }
};
