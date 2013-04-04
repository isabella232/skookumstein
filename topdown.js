(function(namespace) {

  var ns = window[namespace] = window[namespace] || {};

  var PLAYER_COLOR = '#f44';
  var WALL_COLOR = '#fff';
  var DOOR_COLOR = '#00f';

  function Topdown(viewport) {
    this.viewport = viewport;
    this.scaleX = 1;
    this.scaleY = 1;
  }

  Topdown.prototype = {

    render: function(player, map, intersections) {
      this.renderMap(map, player.x, player.y);
      this.renderPlayer(player, intersections);
    },

    renderPlayer: function(player, rays) {
      var px = player.x;
      var py = player.y;

      var x, y;

      this.viewport.circle(0, 0, 7, PLAYER_COLOR);

      x = (rays[0].rayX - px) * this.scaleX;
      y = (rays[0].rayY - py) * this.scaleY;

      this.viewport.line(0, 0, x, y, PLAYER_COLOR);

      x = (rays[rays.length - 1].rayX - px) * this.scaleX;
      y = (rays[rays.length - 1].rayY - py) * this.scaleY;

      this.viewport.line(0, 0, x, y, PLAYER_COLOR);
    },

    renderMap: function(map, xOff, yOff) {
      var x1, y1, x2, y2;
      var texture;

      var i = map.walls.length;
      var wall;
      while (i--) {
        wall = map.walls[i];
        texture = map.texture(wall.texture);
        x1 = (wall[0] - xOff) * this.scaleX;
        y1 = (wall[1] - yOff) * this.scaleY;
        x2 = (wall[2] - xOff) * this.scaleX;
        y2 = (wall[3] - yOff) * this.scaleY;
        this.viewport.line(x1, y1, x2, y2, texture.isBlocking ? WALL_COLOR : DOOR_COLOR);
      }
    },

    renderIntersections: function(player, rays) {
      var i = rays.length;
      var hits, hit;

      var px = player.x;
      var py = player.y;

      var x1 = 0;
      var y1 = 0;
      var x2, y2;

      // loop through all rays
      while (i--) {

        x2 = (rays[i].rayX - px) * this.scaleX;
        y2 = (rays[i].rayY - py) * this.scaleY;

        // draw each ray as a line
        this.viewport.line(x1, y1, x2, y2, PLAYER_COLOR);

        // draw line to and circle on nearest intersection
        if (ns.Config.intersections && rays[i].hits.length) {
          hit = rays[i].hits[0];
          x2 = (hit.x - px) * this.scaleX;
          y2 = (hit.y - py) * this.scaleX;
          this.viewport.line(x1, y1, x2, y2, WALL_COLOR);
          this.viewport.circle(x2, y2, 5, WALL_COLOR);
        }
      }
    }

  };

  ns.Topdown = Topdown;

})('skookum');