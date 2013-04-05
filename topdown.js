(function(namespace) {

  var ns = window[namespace] = window[namespace] || {};

  var ZOOMS = [
    { scale: 1, ticks: 25 },
    { scale: 2, ticks: 10 },
    { scale: 4, ticks: 5 },
    { scale: 20, ticks: 1 }
  ];

  var PLAYER_COLOR = '#f44';
  var WALL_COLOR = '#fff';
  var DOOR_COLOR = '#00f';
  var GRID_COLOR = '#333';

  function Topdown(viewport) {
    this.viewport = viewport;
    this.zoom = 0;
  }

  Topdown.prototype = {

    render: function(player, map, intersections) {
      this.renderGrid(player.x, player.y);
      this.renderMap(map, player.x, player.y);
      this.renderPlayer(player, intersections);
    },

    getScale: function() {
      return ZOOMS[this.zoom].scale;
    },

    getTicks: function() {
      return ZOOMS[this.zoom].ticks;
    },

    renderPlayer: function(player, rays) {
      var px = player.x;
      var py = player.y;
      var scale = this.getScale();

      var x, y;

      this.viewport.circle(0, 0, 7, PLAYER_COLOR);

      x = (rays[0].rayX - px) * scale;
      y = (rays[0].rayY - py) * scale;

      this.viewport.line(0, 0, x, y, PLAYER_COLOR);

      x = (rays[rays.length - 1].rayX - px) * scale;
      y = (rays[rays.length - 1].rayY - py) * scale;

      this.viewport.line(0, 0, x, y, PLAYER_COLOR);
    },

    renderMap: function(map, xOff, yOff) {
      var x1, y1, x2, y2;
      var texture;

      var scale = this.getScale();

      var i = map.walls.length;
      var wall;
      while (i--) {
        wall = map.walls[i];
        texture = map.texture(wall.texture);
        x1 = (wall[0] - xOff) * scale;
        y1 = (wall[1] - yOff) * scale;
        x2 = (wall[2] - xOff) * scale;
        y2 = (wall[3] - yOff) * scale;
        this.viewport.line(x1, y1, x2, y2, texture.isBlocking ? WALL_COLOR : DOOR_COLOR);
      }
    },

    renderGrid: function(px, py) {
      var size = this.viewport.getSize();
      var scale = this.getScale();
      var ticks = this.getTicks();

      var spacing = ticks * scale;
      var xOff = Math.abs(px) % spacing;
      var yOff = Math.abs(py) % spacing;

      // draw the center gridlines

      this.viewport.line(-size.width * 0.5, yOff, size.width * 0.5,  yOff, GRID_COLOR);
      this.viewport.line(xOff, -size.height * 0.5, xOff, size.height * 0.5, GRID_COLOR);

      // draw gridlines eminating from the center in both directions

      var x = 1, y = 1;

      while (2 * y * spacing + yOff < size.height) {
        this.viewport.line(-size.width * 0.5, y * -spacing + yOff, size.width * 0.5,  y * -spacing + yOff, GRID_COLOR);
        this.viewport.line(-size.width * 0.5, y * spacing + yOff, size.width * 0.5, y * spacing + yOff, GRID_COLOR);
        y++;
      }

      while (2 * x * spacing + xOff < size.width) {
        this.viewport.line(x * -spacing + xOff, -size.height * 0.5, x * -spacing + xOff, size.height * 0.5, GRID_COLOR);
        this.viewport.line(x * spacing + xOff, -size.height * 0.5, x * spacing + xOff, size.height * 0.5, GRID_COLOR);
        x++;
      }

    },

    renderIntersections: function(player, rays) {
      var i = rays.length;
      var hits, hit;

      var px = player.x;
      var py = player.y;

      var scale = this.getScale();

      var x1 = 0;
      var y1 = 0;
      var x2, y2;

      // loop through all rays
      while (i--) {

        x2 = (rays[i].rayX - px) * scale;
        y2 = (rays[i].rayY - py) * scale;

        // draw each ray as a line
        this.viewport.line(x1, y1, x2, y2, PLAYER_COLOR);

        // draw line to and circle on nearest intersection
        if (ns.Config.intersections && rays[i].hits.length) {
          hit = rays[i].hits[0];
          x2 = (hit.x - px) * scale;
          y2 = (hit.y - py) * scale;
          this.viewport.line(x1, y1, x2, y2, WALL_COLOR);
          this.viewport.circle(x2, y2, 5, WALL_COLOR);
        }
      }
    }

  };

  ns.Topdown = Topdown;

})('skookum');