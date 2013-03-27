(function(namespace) {

  var ns = window[namespace] = window[namespace] || {};

  var RAF = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

  function Gameloop() {

  }

  Gameloop.prototype = {

    start: function(fn) {
      var last = Date.now();

      RAF(frame);

      function frame(timestamp) {
        var now = Date.now();
        fn(now - last);
        last = now;
        RAF(frame);
      }
    }

  };

  ns.Gameloop = Gameloop;

})('skookum');