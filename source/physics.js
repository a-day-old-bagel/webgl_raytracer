var physics = {
  oldTime: performance.now(),
  animTime: undefined,
  animMaxTime: undefined,
  pausedTime: undefined,
  animHasStarted: false,
  animIsRunning: true,
  animSpeed: 0.001953125,
  animStep: 0.001953125,
  totalTime: -4.0,
  timeReadout: undefined,
  speedReadout: undefined,

  tick: function() {
    this.newTime = performance.now();
    var dt = this.newTime - this.oldTime;

    controls.handleKeys(dt);
    camera.tickShmooze(dt);

    if (this.animIsRunning) {
      var animLoopTime = this.newTime - this.animTime;
      if (animLoopTime > this.animMaxTime) {
        do {
          animLoopTime -= this.animMaxTime;
        } while (animLoopTime > this.animMaxTime);
        this.animTime = this.newTime - animLoopTime;
      }
      this.totalTime += this.animSpeed * dt;
      this.timeReadout.innerHTML = "Time: " + this.totalTime;
      this.speedReadout.innerHTML = "Speed: " + this.animSpeed;
    }

    this.oldTime = this.newTime;
  },

  beginAnim: function() {
    this.animTime = performance.now();
    this.animIsRunning = true;
    this.animHasStarted = true;
  },

  pauseAnim: function() {
    this.pausedTime = performance.now();
    this.animIsRunning = false;
  },

  resumeAnim: function() {
    this.animTime += performance.now() - this.pausedTime;
    this.animIsRunning = true;
  },

  toggleAnim: function() {
    if (this.animHasStarted) {
      if (this.animIsRunning) {
        this.pauseAnim();
      } else {
        this.resumeAnim();
      }
    } else {
      this.beginAnim();
    }
  },

  init: function() {
    this.timeReadout = document.getElementById('timer');
    this.speedReadout = document.getElementById('speed');
  }
};
