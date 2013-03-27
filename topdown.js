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

      this.scaleX = 0.5;
      this.scaleY = 0.5;
    },

    render: function() {
      if (!ns.Config.topdown) return;
      this.renderPlayer();
      this.renderMap();
      this.renderIntersections();
    },

    renderPlayer: function() {
      var px = this.player.x * this.scaleX;
      var py = this.player.y * this.scaleY;

      this.viewport.circle(px, py, 7, PLAYER_COLOR);
    },

    renderMap: function() {
      if (!ns.Config.map) return;
      var i = this.map.walls.length;
      var wall;
      while (i--) {
        wall = this.map.walls[i];
        this.viewport.line(wall[0] * this.scaleX, wall[1] * this.scaleY, wall[2] * this.scaleX, wall[3] * this.scaleY, WALL_COLOR);
      }
      this.viewport.drawCenter();
    },

    renderIntersections: function() {
      var intersections = this.player.intersections;
      var i = intersections.length;
      var inter;
      var px = this.player.x * this.scaleX;
      var py = this.player.y * this.scaleY;
      while (i--) {
        inter = intersections[i];
        this.viewport.line(px, py, inter.rayX * this.scaleX, inter.rayY * this.scaleY, PLAYER_COLOR);
        if (inter.dist < Infinity && ns.Config.intersections) {
          this.viewport.line(px, py, inter.x * this.scaleX, inter.y * this.scaleY, WALL_COLOR);
          this.viewport.circle(inter.x * this.scaleX, inter.y * this.scaleY, 5, WALL_COLOR);
        }
      }
    }

  };

  ns.Topdown = Topdown;

})('skookum');