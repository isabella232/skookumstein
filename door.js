(function(namespace) {

  var ns = window[namespace] = window[namespace] || {};

  var OFF_X = 600;
  var OFF_Y = 600;

  function Door(texture, opening, x1, y1, x2, y2) {
    this.texture = texture;
    this.opening = opening;
    this[0] = x1 - OFF_X;
    this[1] = y1 - OFF_Y;
    this[2] = x2 - OFF_X;
    this[3] = y2 - OFF_Y;
  }

  Door.prototype = {

  };

  ns.Door = Door;

})('skookum');