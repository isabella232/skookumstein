// TODO: add underscore.js for a lot of this default object bundle / override stuff

(function(namespace) {

  var ns = window[namespace] = window[namespace] || {};

  function Map() {
    this.images = {};             // The images that are drawn as the base layers for textures
    this.shadows = {};            // Shadows masked to mimic the transparency of textures
    this.transparency = {};     // Flag telling us whether or not we should paint behind this texture
    this.preprocessWalls();
    this.preprocessTextures();
    this.loadTextures();
  }

  Map.prototype = {

    offX: 600,
    offY: 600,
    scaleX: 1,
    scaleY: 1,

    npcs: [],
    doors: [],

    walls: [
      [275, 305, 275, 375, 'wood_wall'], // outside fake enclosure left
      [700, 305, 700, 375, 'wood_wall'], // outside fake enclosure right
      [540, 305, 575, 305, 'wood_wall'], // outside wall right
      [490, 305, 450, 305, 'wood_wall'], // outside wall left
      [275, 305, 450, 305, 'wood_wall'], // outside wall far left
      [700, 305, 575, 305, 'wood_wall'], // outside wall far right
      [540, 200, 540, 270, 'wall'], // entry wall right
      [540, 305, 540, 270, 'wood_wall'], // entry wall right wood
      [490, 305, 490, 285, 'wood_wall'], // entry wall left wood

      [455, 205, 540, 205, 'skookum_wall'], // skookum logo wall
      [455, 200, 455, 205, 'wall'],  // skookum logo wall side

      [430, 155, 755, 155, 'wall'],    // top hallway north side (top)
      [430, 155, 430, 160, 'wall'],    // top hallway north side (connector)
      [430, 160, 755, 160, 'wall'],    // top hallway north side (bottom)
      [455, 200, 755, 200, 'wall'],  // top hallway south side

      [485, 285, 490, 285, 'wall'], // entry wall left wood side
      [485, 285, 485, 300, 'wall'], //short left entry wall
      [485, 300, 375, 300, 'wall'], // wall to left of Melissa
      [375, 300, 375, 225, 'red_wall_boxes'], // red wall behind Melissa
      [375, 225, 370, 225, 'red_wall'], // side edge of lounge on left
      [370, 225, 370, 300, 'red_wall'],  // left wall of lounge
      [370, 300, 275, 300, 'charlotte_poster'], // back wall of lounge
      [275, 300, 275, 230, 'tv'], // tv in lounge

      [270, 300, 270, 225, 'wall'], // left conference room East wall
      [110, 300, 270, 300, 'wall'], // left conference room South wall
      [110, 210, 110, 300, 'wall'], // left conference room West wall
      [110, 210, 220, 210, 'wall'], // left conference room North wall
      [220, 210, 240, 190, 'wall'], // left conference room door diagonal wall

      [105, 85, 130, 85, 'wall'], // right conference room West wall NW column
      [130, 85, 130, 60, 'wall'], // right conference room North wall column section
      [130, 60, 175, 60, 'window'], // right conference room North wall 1st window
      [175, 60, 205, 60, 'wall'], // right conference room North wall 1st section
      [205, 60, 250, 60, 'window'], // right conference room North wall 2nd window
      [250, 60, 270, 60, 'wall'], // right conference room North wall 2nd section
      [130, 59, 250, 59, 'skyline'], // right conference room North wall skyline

      [270, 60, 270, 160, 'wall'], // right conference room East wall

      [275, 230, 240, 195, 'door_opening'], // door to design room
      [240, 195, 275, 160, 'door_opening'], // door to conference room

      [275, 160, 335, 160, 'wall'], // left wall isBlocking kitchen
      [335, 160, 335, 155, 'wall'], // left wall isBlocking kitchen side
      [335, 155, 275, 155, 'wall'], // left wall isBlocking kitchen inner

      [300, 155, 300, 125, 'fridge1_front'], // front of black fridge
      [300, 125, 275, 125, 'fridge1_side'], // side of black fridge
      [275, 155, 275, 60, 'red_wall'], // wall to right of black fridge

      [275, 60, 325, 60, 'window'], // left kitchen window
      [325, 60, 415, 60, 'wall'], // between kitchen window
      [415, 60, 465, 60, 'window'], // right kitchen window
      [465, 60, 465, 155, 'wall'], // East kitchen wall
      [275, 59, 465, 59, 'skyline'], // skyline behind kitchen windows

      [400, 230, 425, 230, 'desk_side'],  // right side of Melissa's desk
      [440, 250, 440, 300, 'desk_side'],  // left side of Melissa's desk
      [440, 250, 425, 230, 'desk_side'],  // corner of Melissa's desk
      [400, 230, 400, 240, 'desk_side'],  // side edge of Melissa's desk
      [425, 250, 425, 300, 'desk_side'],  // inside edge of Melissa's desk
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
      'door_opening': {
        src: 'textures/door_opening.png',
        hasShadow: true,
        mapping: 'default',
        isBlocking: false
      },
      'door': 'textures/door.png',
      'fridge1_front': 'textures/fridge1.png',
      'fridge1_side': 'textures/fridge1_side.png',
      'window': 'textures/window.png',
      'desk_side': 'textures/desk_side.png',
      'red_wall': 'textures/red_wall_empty.jpg',
      'melissa2': 'textures/melissa2.png',
      'circle_light': 'textures/circle_light.png',
      'skyline': {
        src: 'textures/outside_kitchen.jpg',
        hasShadow: false,
        mapping: 'angular',
        isBlocking: false
      }
    },

    texture: function(name) {
      return {
        image: this.images[name],
        shadow: this.shadows[name],
        transparent: this.transparency[name],
        mapping: this.textures[name].mapping,
        hasShadow: this.textures[name].hasShadow,
        isBlocking: this.textures[name].isBlocking
      };
    },

    shadow: function(name) {
      return this.shadows[name];
    },

    transparent: function(name) {
      return this.transparency[name];
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
      newImage.src = this.textures[key].src;

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
            if (pixels.data[i + 3] < 255) transparent = true;
          }
        }

        ctx.putImageData(pixels, 0, 0);
        self.shadows[key] = canvas;
        self.transparency[key] = transparent;
      }
    },

    preprocessWalls: function() {
      var i = this.walls.length;
      while (i--) {
        this.walls[i][0] = (this.walls[i][0] - this.offX) * this.scaleX;
        this.walls[i][1] = (this.walls[i][1] - this.offY) * this.scaleY;
        this.walls[i][2] = (this.walls[i][2] - this.offX) * this.scaleX;
        this.walls[i][3] = (this.walls[i][3] - this.offY) * this.scaleY;
        this.walls[i].texture = this.walls[i][4];
        delete this.walls[i][4];
      }
    },

    preprocessTextures: function() {
      for (var key in this.textures) {
        if (typeof this.textures[key] === 'string') {
          this.textures[key] = {
            src: this.textures[key],
            hasShadow: true,
            mapping: 'default',
            isBlocking: true
          };
        }
      }
    },

    npcsFacePlayer: function(player) {
      var i = this.npcs.length;
      while (i--) {
        this.npcs[i].faceCoords(player.x, player.y);
      }
    }

  };

  ns.Map = Map;

})('skookum');