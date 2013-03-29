(function(namespace) {

  var ns = window[namespace] = window[namespace] || {};

  var RIGHT_ANGLE = Math.PI * 0.5;

  var CHARACTERS = {
    'melissa': {
      texture: 'melissa2',
      width: 18,
      base: 456
    },
    'light': {
      texture: 'circle_light',
      width: 70
    }
  };

  // TODO: copy values instead of using getters

  function Npc(character, x, y) {
    this._character = character;
    this.x = x;
    this.y = y;
    this.shadow = true;
  }

  Npc.prototype = {

    getCoords: function(px, py) {
      var chr = CHARACTERS[this._character];
      var angle = RIGHT_ANGLE - Math.atan2(this.x - px, this.y - py);
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
    },

    getTexture: function() {
      return CHARACTERS[this._character].texture;
    },

    getWidth: function() {
      return CHARACTERS[this._character].width;
    }

  };

  ns.Npc = Npc;

})('skookum');