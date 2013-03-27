(function(namespace) {

  var ns = window[namespace] = window[namespace] || {};

  function Npc(character) {
    this._character = character;
  }

  Npc.prototype = {

  };

  ns.Npc = Npc;

})('skookum');