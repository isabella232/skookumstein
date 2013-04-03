(function(namespace) {

  var ns = window[namespace] = window[namespace] || {};

  var OFF_X = 600;
  var OFF_Y = 600;
  var OPEN_ANGLE = Math.PI * 0.7;
  var FAR_DISTANCE = 140;
  var OPEN_SPEED = 2.5;

  function Door(texture, opening, x1, y1, x2, y2) {
    this.texture = texture;
    this.opening = opening;
    this[0] = x1 - OFF_X;
    this[1] = y1 - OFF_Y;
    this[2] = x2 - OFF_X;
    this[3] = y2 - OFF_Y;

    this.buildGeometry();
  }

  Door.prototype = {

    buildGeometry: function() {
      if (this.opening === 'left') {
        this.hinge = [this[0], this[1]];
        var dx = this[2] - this[0];
        var dy = this[3] - this[1];
        this.width = Math.sqrt(dx * dx + dy * dy);
        this.closedAngle = Math.atan2(dy, dx);
      }
    },

    openNear: function(x, y) {
      var dx = x - this.hinge[0];
      var dy = y - this.hinge[1];
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > FAR_DISTANCE) {
        this.angle = this.closedAngle;
      }
      else {
        var openness = Math.min(1, (1 - dist / FAR_DISTANCE) * OPEN_SPEED);
        this.angle = this.closedAngle + OPEN_ANGLE * openness;
      }
      if (this.opening === 'left') {
        this[2] = this[0] + Math.cos(this.angle) * this.width;
        this[3] = this[1] + Math.sin(this.angle) * this.width;
      }
    }
  };

  ns.Door = Door;

})('skookum');