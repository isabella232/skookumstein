(function(namespace) {

  var ns = window[namespace] = window[namespace] || {};

  var RIGHT_ANGLE = Math.PI * 0.5;

  var CHARACTERS = {
    'melissa': {
      texture: 'textures/melissa2.png',
      width: 10,
      base: 456
    }
  };

  function Npc(character, x, y) {
    this._character = character;
    this.x = x;
    this.y = y;
  }

  Npc.prototype = {

    getCoords: function(px, py) {
      var chr = CHARACTERS[this._character];
      var angle = Math.atan2(this.x - px, this.y - py);
      var half = chr.width * 0.5;
      var x1 = this.x + Math.cos(angle - RIGHT_ANGLE) * half;
      var y1 = this.y + Math.sin(angle - RIGHT_ANGLE) * half;
      var x2 = this.x + Math.cos(angle + RIGHT_ANGLE) * half;
      var y2 = this.y + Math.sin(angle + RIGHT_ANGLE) * half;
      return {
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2
      };
    }

  };

  ns.Npc = Npc;

})('skookum');