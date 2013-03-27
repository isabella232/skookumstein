(function(namespace) {

  var ns = window[namespace] = window[namespace] || {};

  function Map() {
    this.images = {};
    this.applyOffsets();
    this.loadTextures();
  }

  Map.prototype = {

    offX: 600,
    offY: 600,

    walls: [
      [550, 305, 575, 305, 'wood_wall'], // outside wall right
      [475, 305, 450, 305, 'wood_wall'], // outside wall left
      [375, 305, 450, 305, 'wood_wall'], // outside wall far left
      [675, 305, 575, 305, 'wood_wall'], // outside wall far right
      [550, 200, 550, 270, 'wall'], // entry wall right
      [550, 305, 550, 270, 'wood_wall'], // entry wall right wood
      [475, 305, 475, 270, 'wood_wall'], // entry wall left wood
      [450, 205, 550, 205, 'skookum_wall'], // skookum logo wall
      [450, 200, 450, 205, 'wall'],  // skookum logo wall side
      [475, 270, 470, 270, 'wall'], // entry wall left wood side
      [470, 270, 470, 300, 'wall'],
      [470, 300, 375, 300, 'wall'] // wall to left of Melissa

      /*[200, 100, 100, 100, 'skookum_poster'],
      [200, 100, 200, 200, 'x'],
      [200, 200, 100, 200, 'x'],
      [100, 100, 100, 200, 'skookum_wall'],
      [-100, -100, 200, -100, 'wall'],
      [-100, -100, -100, 200, 'wall']*/
    ],

    textures: {
      'x': 'textures/x.jpg',
      'skookum_poster': 'textures/skookum_poster.jpg',
      'wall': 'textures/wall.jpg',
      'skookum_wall': 'textures/skookum_wall.jpg',
      'wood_wall': 'textures/wood_wall.jpg'
    },

    texture: function(name) {
      return this.images[name];
    },

    loadTextures: function() {
      var self = this;

      for (var key in this.textures) {
        var newImage = this.images[key] = new Image();
        newImage.src = this.textures[key];
      }
    },

    applyOffsets: function() {
      var i = this.walls.length;
      while (i--) {
        this.walls[i][0] -= this.offX;
        this.walls[i][1] -= this.offY;
        this.walls[i][2] -= this.offX;
        this.walls[i][3] -= this.offY;
      }
    }

  };

  ns.Map = Map;

})('skookum');