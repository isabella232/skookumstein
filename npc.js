(function(namespace) {

  var ns = window[namespace] = window[namespace] || {};

  var RIGHT_ANGLE = Math.PI * 0.5;

  var CHARACTERS = {
    'melissa': {
      texture: 'melissa2',
      width: 18
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
    this.texture = CHARACTERS[character].texture;
    this.width = CHARACTERS[character].width;

    this.faceCoords(0, 0);
  }

  Npc.prototype = {

    faceCoords: function(px, py) {
      var angle = RIGHT_ANGLE - Math.atan2(this.x - px, this.y - py);
      var half = this.width * 0.5;
      this[0] = this.x + Math.cos(angle - RIGHT_ANGLE) * half;
      this[1] = this.y + Math.sin(angle - RIGHT_ANGLE) * half;
      this[2] = this.x + Math.cos(angle + RIGHT_ANGLE) * half;
      this[3] = this.y + Math.sin(angle + RIGHT_ANGLE) * half;
    }

  };

  ns.Npc = Npc;

})('skookum');