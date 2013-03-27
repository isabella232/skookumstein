(function(namespace) {

  var ns = window[namespace] = window[namespace] || {};

  var PLAYER_COLOR = '#f44';
  var WALL_COLOR = '#fff';

  function Topdown() {
    this.setDefaults();
  }

  Topdown.prototype = {

    setDefaults: function() {
      this.viewport =
      this.map =
      this.npcs =
      this.player =
      undefined;
    },

    render: function() {
      if (!ns.Config.topdown) return;
      this.renderPlayer();
      this.renderMap();
      this.renderIntersections();
    },

    renderPlayer: function() {
      var px = this.player.x;
      var py = this.player.y;

      this.viewport.circle(px, py, 7, PLAYER_COLOR);
    },

    renderMap: function() {
      if (!ns.Config.map) return;
      var i = this.map.walls.length;
      var wall;
      while (i--) {
        wall = this.map.walls[i];
        this.viewport.line(wall[0], wall[1], wall[2], wall[3], WALL_COLOR);
      }
      this.viewport.drawCenter();
    },

    renderIntersections: function() {
      var intersections = this.player.intersections;
      var i = intersections.length;
      var inter;
      var px = this.player.x;
      var py = this.player.y;
      while (i--) {
        inter = intersections[i];
        this.viewport.line(px, py, inter.rayX, inter.rayY, PLAYER_COLOR);
        if (inter.dist < Infinity && ns.Config.intersections) {
          this.viewport.line(px, py, inter.x, inter.y, WALL_COLOR);
          this.viewport.circle(inter.x, inter.y, 5, WALL_COLOR);
        }
      }
    }

  };

  ns.Topdown = Topdown;

})('skookum');