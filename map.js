(function(namespace) {

  var ns = window[namespace] = window[namespace] || {};

  function Map() {
    this.images = {};
    this.loadTextures();
  }

  Map.prototype = {

    walls: [
      [100, 100, 200, 100, 'x'],
      [200, 100, 200, 200, 'x'],
      [200, 200, 100, 200, 'x'],
      [100, 200, 100, 100, 'x'],
      [-100, -100, 200, -100, 'x'],
      [-100, -100, -100, 200, 'x']
    ],

    textures: {
      'x': 'textures/x.jpg'
    },

    texture: function(name) {
      return this.images[name];
    },

    loadTextures: function() {
      var self = this;

      for (var key in this.textures) {
        var newImage = this.images[key] = new Image();
        newImage.onload = bump;
        newImage.src = this.textures[key];
      }

      function bump() {
        self.loaded++;
        if (self.loaded >= self.toLoad) self.ready = true;
      }
    }

  };

  ns.Map = Map;

})('skookum');