(function(namespace) {

  var ns = window[namespace] = window[namespace] || {};

  var RAF = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

  function Gameloop() {
    this.last = undefined;
    this.frameCount = 0;
    this.fps = 0;
    this.lastFps = 0;
  }

  Gameloop.prototype = {

    start: function(fn) {
      var self = this;

      this.last = Date.now();
      RAF(frame);

      function frame(timestamp) {
        var now = Date.now();
        fn(now - self.last);
        self.frameCount++;
        if (now >= self.lastFps + 1000) {
          self.fps = self.frameCount;
          self.frameCount = 0;
          self.lastFps = now;
        }
        self.last = now;

        RAF(frame);
      }
    }

  };

  ns.Gameloop = Gameloop;

})('skookum');