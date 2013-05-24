(function(namespace) {

  var ns = window[namespace] = window[namespace] || {};

  var PLAYER_COLOR = '#f44';
  var WALL_COLOR = '#fff';
  var DOOR_COLOR = '#00f';

  function Topdown(viewport) {
    this.viewport = viewport;
    this.scaleX = 0.7;
    this.scaleY = 0.7;
  }

  Topdown.prototype = {

    render: function(player, map, intersections) {
      if (!ns.Config.topdown) return;
      this.renderPlayer(player);
      this.renderMap(map);
      this.renderIntersections(player, intersections);
    },

    renderPlayer: function(player) {
      var px = player.x * this.scaleX;
      var py = player.y * this.scaleY;

      this.viewport.circle(px, py, 7, PLAYER_COLOR);
    },

    renderMap: function(map) {
      if (!ns.Config.map) return;
      var i = map.walls.length;
      var wall;
      while (i--) {
        wall = map.walls[i];
        var texture = map.texture(wall.texture);
        if (texture.isBlocking) {
          this.viewport.line(wall[0] * this.scaleX, wall[1] * this.scaleY, wall[2] * this.scaleX, wall[3] * this.scaleY, WALL_COLOR);
        }
        else {
          this.viewport.line(wall[0] * this.scaleX, wall[1] * this.scaleY, wall[2] * this.scaleX, wall[3] * this.scaleY, DOOR_COLOR);
        }
      }
      this.viewport.drawCenter();
    },

    renderIntersections: function(player, rays) {
      var i = rays.length;
      var hits, hit;
      var px = player.x * this.scaleX;
      var py = player.y * this.scaleY;

      // loop through all rays
      while (i--) {

        // draw each ray as a line
        this.viewport.line(px, py, rays[i].rayX * this.scaleX, rays[i].rayY * this.scaleY, PLAYER_COLOR);

        // draw line to and circle on nearest intersection
        if (ns.Config.intersections && rays[i].hits.length) {
          hit = rays[i].hits[0];
          this.viewport.line(px, py, hit.x * this.scaleX, hit.y * this.scaleY, WALL_COLOR);
          this.viewport.circle(hit.x * this.scaleX, hit.y * this.scaleY, 5, WALL_COLOR);
        }
      }
    }

  };

  ns.Topdown = Topdown;

})('skookum');