(function(namespace) {

  var ns = window[namespace] = window[namespace] || {};

  function Map() {
    this.images = {};             // The images that are drawn as the base layers for textures
    this.shadows = {};            // Shadows masked to mimic the transparencies of textures
    this.transparencies = {};     // Flag telling us whether or not we should paint behind this texture
    this.applyOffsetsAndScale();
    this.loadTextures();
  }

  Map.prototype = {

    offX: 600,
    offY: 600,
    scaleX: 1,
    scaleY: 1,

    walls: [
      [375, 305, 375, 375, 'wood_wall'], // outside fake enclosure left
      [675, 305, 675, 375, 'wood_wall'], // outside fake enclosure right
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
      [470, 300, 375, 300, 'wall'], // wall to left of Melissa
      [375, 300, 375, 225, 'red_wall_boxes'], // red wall behind Melissa
      [375, 225, 370, 225, 'red_wall'], // side edge of lounge on left
      [370, 225, 370, 300, 'red_wall'],  // left wall of lounge
      [370, 300, 275, 300, 'charlotte_poster'], // back wall of lounge
      [275, 300, 275, 225, 'tv'], // tv in lounge
      [275, 225, 225, 175, 'door'], // door to design room
      [225, 175, 275, 125, 'door'], // door to conference room
      [275, 125, 325, 125, 'wall'], // left wall blocking kitchen
      [325, 125, 325, 120, 'wall'], // left wall blocking kitchen side
      [325, 120, 275, 120, 'wall'], // left wall blocking kitchen inner
      [300, 120, 300, 90, 'fridge1_front'], // front of black fridge
      [300, 90, 275, 90, 'fridge1_side'], // side of black fridge
      [275, 120, 275, 25, 'red_wall'], // wall to right of black fridge
      [275, 25, 325, 25, 'window'], // left kitchen window
      [400, 230, 425, 230, 'desk_side'],  // right side of Melissa's desk
      [440, 250, 440, 300, 'desk_side'],  // left side of Melissa's desk
      [440, 250, 425, 230, 'desk_side'],  // corner of Melissa's desk
      [400, 230, 400, 240, 'desk_side'],  // side edge of Melissa's desk
      [425, 250, 425, 300, 'desk_side'],  // inside edge of Melissa's desk

      /*[200, 100, 100, 100, 'skookum_poster'],
      [200, 100, 200, 200, 'x'],
      [200, 200, 100, 200, 'x'],
      [100, 100, 100, 200, 'skookum_wall'],
      [-100, -100, 200, -100, 'wall'],
      [-100, -100, -100, 200, 'wall']*/
    ],

    // TODO: automatically build a transparency mask for the shadow overlays for each

    textures: {
      'x': 'textures/x.jpg',
      'skookum_poster': 'textures/skookum_poster.jpg',
      'wall': 'textures/wall.jpg',
      'skookum_wall': 'textures/skookum_wall.jpg',
      'wood_wall': 'textures/wood_wall.jpg',
      'red_wall_boxes': 'textures/red_wall.jpg',
      'charlotte_poster': 'textures/charlotte_poster_wall.jpg',
      'tv': 'textures/tv_wall.jpg',
      'door': 'textures/door.png',
      'fridge1_front': 'textures/fridge1.png',
      'fridge1_side': 'textures/fridge1_side.png',
      'window': 'textures/window.png',
      'desk_side': 'textures/desk_side.png',
      'red_wall': 'textures/red_wall_empty.jpg'
    },

    // todo: return an object with 'image' 'shadow' and 'transparent'
    texture: function(name) {
      return {
        image: this.images[name],
        shadow: this.shadows[name],
        transparent: this.transparencies[name] || true
      };
    },

    shadow: function(name) {
      return this.shadows[name];
    },

    transparent: function(name) {
      return this.transparencies[name] || true;
    },

    loadTextures: function() {
      var self = this;

      for (var key in this.textures) {
        this.loadTexture(key);
      }
    },

    loadTexture: function(key) {
      var self = this;
      var newImage = this.images[key] = document.createElement('image');

      newImage.onload = drawShadow;
      newImage.src = this.textures[key];

      function drawShadow() {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var width = newImage.width;
        var height = newImage.height;
        var transparent = false;

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(newImage, 0, 0);

        var pixels = ctx.getImageData(0, 0, width, height);
        for (var y = 0; y < height; y++) {
          for (var x = 0; x < width; x++) {
            var i = (y * width + x) * 4;
            pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = 0;
            if (!transparent && pixels.data[i + 3] < 255) trnasparent = true;
          }
        }

        ctx.putImageData(pixels, 0, 0);
        self.shadows[key] = canvas;
        self.transparencies[key] = transparent;
      }
    },

    applyOffsetsAndScale: function() {
      var i = this.walls.length;
      while (i--) {
        this.walls[i][0] = (this.walls[i][0] - this.offX) * this.scaleX;
        this.walls[i][1] = (this.walls[i][1] - this.offY) * this.scaleY;
        this.walls[i][2] = (this.walls[i][2] - this.offX) * this.scaleX;
        this.walls[i][3] = (this.walls[i][3] - this.offY) * this.scaleY;
      }
    }

  };

  ns.Map = Map;

})('skookum');