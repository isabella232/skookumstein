(function(namespace) {

  var ns = window[namespace] = window[namespace] || {};

  function Config() {
    this.loadBundle('49');
    this.listen();
  }

  Config.prototype = {
    bundles: {

      // 1 - Nothing on screen

      '49': {
        topdown: false,
        raycaster: false,
        map: false,
        npcs: false,
        segments: 1,
        intersections: false,
        columns: 'flat',
        textures: false,
        shadows: false,
        collisions: false
      },

      // 2 - Player on screen

      '50': {
        topdown: true,
        raycaster: false,
        map: false,
        npcs: false,
        segments: 1,
        intersections: false,
        columns: 'flat',
        textures: false,
        shadows: false,
        collisions: false
      },

      // 3 - Map on screen

      '51': {
        topdown: true,
        raycaster: false,
        map: true,
        npcs: false,
        segments: 1,
        intersections: false,
        columns: 'flat',
        textures: false,
        shadows: false,
        collisions: false
      },

      // 4 - Intersections

      '52': {
        topdown: true,
        raycaster: false,
        map: true,
        npcs: false,
        segments: 1,
        intersections: true,
        columns: 'flat',
        textures: false,
        shadows: false,
        collisions: true
      },

      // 5 - Field of View

      '53': {
        topdown: true,
        raycaster: false,
        map: true,
        npcs: false,
        segments: 8,
        intersections: true,
        columns: 'flat',
        textures: false,
        shadows: false,
        collisions: true
      },

      // 6 - Walls (3d, flat, blocky)

      '54': {
        topdown: true,
        raycaster: true,
        map: true,
        npcs: false,
        segments: 8,
        intersections: true,
        columns: 'flat',
        textures: false,
        shadows: false,
        collisions: true
      },

      // 7 - Walls (3d, flat, smooth)

      '55': {
        topdown: true,
        raycaster: true,
        map: true,
        npcs: false,
        segments: 128,
        intersections: true,
        columns: 'flat',
        textures: false,
        shadows: false,
        collisions: true
      },

      // 8 - Lights

      '56': {
        topdown: false,
        raycaster: true,
        map: false,
        npcs: false,
        segments: 128,
        intersections: true,
        columns: 'deep',
        textures: false,
        shadows: false,
        collisions: true
      },

      // 9 - Textures

      '57': {
        topdown: false,
        raycaster: true,
        map: false,
        npcs: false,
        segments: 128,
        intersections: true,
        columns: 'textured',
        textures: true,
        shadows: true,
        collisions: true
      },

      // Q - Low resolution
      //
      '113': {
        topdown: false,
        raycaster: true,
        map: false,
        npcs: false,
        segments: 32,
        intersections: true,
        columns: 'textured',
        textures: true,
        shadows: true,
        collisions: true
      },

      // W - High resolution

      '119': {
        topdown: false,
        raycaster: true,
        map: false,
        npcs: false,
        segments: 256,
        intersections: true,
        columns: 'textured',
        textures: true,
        shadows: true,
        collisions: true
      },

      // E
      '101': {

      },

      // R
      '114': {

      }
    },

    listen: function() {
      var self = this;
      $(window).on('keypress', function(e) {
        self.loadBundle(e.which + '');
      });
    },

    // TODO: this would be more elegant with underscore but whatever

    loadBundle: function(name) {
      for (var key in this.bundles) {
        if (key === name) {
          for (var k in this.bundles[key]) {
            this[k] = this.bundles[key][k];
          }
        }
      }
    }
  };

  ns.Config = new Config();

})('skookum');