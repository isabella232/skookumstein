(function(namespace) {

  var ns = window[namespace] = window[namespace] || {};

  function Config() {
    this.loadBundle('119');
    this.listen();
  }

  Config.prototype = {
    bundles: {

      // 1
      '49': {
        topdown: true,
        raycaster: false,
        map: false,
        npcs: false,
        segments: 1,
        intersections: false,
        columns: 'flat',
        textures: false,
        shadows: false
      },

      // 2
      '50': {
        topdown: true,
        raycaster: false,
        map: true,
        npcs: false,
        segments: 1,
        intersections: false,
        columns: 'flat',
        textures: false,
        shadows: false
      },

      // 3
      '51': {
        topdown: true,
        raycaster: false,
        map: true,
        npcs: false,
        segments: 8,
        intersections: true,
        columns: 'flat',
        textures: false,
        shadows: false
      },

      // 4
      '52': {
        topdown: true,
        raycaster: true,
        map: true,
        npcs: false,
        segments: 8,
        intersections: true,
        columns: 'flat',
        textures: false,
        shadows: false
      },

      // 5
      '53': {
        topdown: true,
        raycaster: true,
        map: true,
        npcs: false,
        segments: 128,
        intersections: true,
        columns: 'flat',
        textures: false,
        shadows: false
      },

      // 6
      '54': {
        topdown: false,
        raycaster: true,
        map: true,
        npcs: false,
        segments: 128,
        intersections: true,
        columns: 'flat',
        textures: false,
        shadows: false
      },

      // 7
      '55': {
        topdown: false,
        raycaster: true,
        map: false,
        npcs: false,
        segments: 128,
        intersections: true,
        columns: 'deep',
        textures: false,
        shadows: false
      },

      // 8
      '56': {
        topdown: false,
        raycaster: true,
        map: false,
        npcs: false,
        segments: 128,
        intersections: true,
        columns: 'textured',
        textures: true,
        shadows: false
      },

      // 9
      '57': {
        topdown: false,
        raycaster: true,
        map: false,
        npcs: false,
        segments: 128,
        intersections: true,
        columns: 'textured',
        textures: false,
        shadows: true
      },

      // Q
      '113': {
        topdown: false,
        raycaster: true,
        map: false,
        npcs: false,
        segments: 256,
        intersections: true,
        columns: 'textured',
        textures: true,
        shadows: true
      },

      // W
      '119': {
        topdown: false,
        raycaster: true,
        map: false,
        npcs: false,
        segments: 128,
        intersections: true,
        columns: 'textured',
        textures: true,
        shadows: true
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