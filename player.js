(function(namespace, $) {
  // jshint expr: true

  var ns = window[namespace] = window[namespace] || {};

  var RAY_DISTANCE = 1500;
  var RIGHT_ANGLE = Math.PI * 0.5;

  var KEY_LEFT = 37;
  var KEY_UP = 38;
  var KEY_RIGHT = 39;
  var KEY_DOWN = 40;
  var KEY_STRAFE_LEFT = 65;
  var KEY_STRAFE_RIGHT = 68;

  var DEG_TO_RAD = Math.PI / 180;
  var NO_DIVIDE_BY_ZERO = 0.00001;

  var TURN_SPEED = 0.1 * DEG_TO_RAD;
  var WALK_SPEED = 0.3;
  var REVERSE_SPEED = 0.1;

  function Player(x, y, angle) {
    this.setDefaults();
    this.x = x;
    this.y = y;
    this.angle = angle * DEG_TO_RAD;
    this.listen();
  }

  Player.prototype = {

    setDefaults: function() {
      this.fov = 70 * DEG_TO_RAD;
      this.turningLeft = false;
      this.turningRight = false;
      this.walking = false;
      this.reversing = false;
      this.strafeLeft = false;
      this.strafeRight = false;
      this.intersections = [];
    },

    // TODO: could use a hash to make this simpler/shorter

    listen: function() {
      var self = this;
      $(window)
        .on('keydown', function(e) {
          switch(e.which) {
            case KEY_LEFT: self.turningLeft = true; break;
            case KEY_RIGHT: self.turningRight = true; break;
            case KEY_UP: self.walking = true; break;
            case KEY_DOWN: self.reversing = true; break;
            case KEY_STRAFE_LEFT: self.strafeLeft = true; break;
            case KEY_STRAFE_RIGHT: self.strafeRight = true; break;
            default: return true;
          }
          return false;
        })
        .on('keyup', function(e) {
          switch(e.which) {
            case KEY_LEFT: self.turningLeft = false; break;
            case KEY_RIGHT: self.turningRight = false; break;
            case KEY_UP: self.walking = false; break;
            case KEY_DOWN: self.reversing = false; break;
            case KEY_STRAFE_LEFT: self.strafeLeft = false; break;
            case KEY_STRAFE_RIGHT: self.strafeRight = false; break;
            default: return true;
          }
          return false;
        })
        .on('touchstart', function(e) {

        })
        .on('touchmove', function(e) {
          return false;
        })
        .on('touchend', function(e) {

        });
    },

    step: function(time) {
      var dx, dy;
      if (this.turningLeft) this.angle -= TURN_SPEED * time;
      if (this.turningRight) this.angle += TURN_SPEED * time;
      if (this.walking) {
        dx = Math.cos(this.angle) * WALK_SPEED * time;
        dy = Math.sin(this.angle) * WALK_SPEED * time;
        this.x += dx;
        this.y += dy;
      }
      if (this.reversing) {
        dx = Math.cos(this.angle) * -REVERSE_SPEED * time;
        dy = Math.sin(this.angle) * -REVERSE_SPEED * time;
        this.x += dx;
        this.y += dy;
      }
      if (this.strafeLeft) {
        dx = Math.cos(this.angle - RIGHT_ANGLE) * REVERSE_SPEED * time;
        dy = Math.sin(this.angle - RIGHT_ANGLE) * REVERSE_SPEED * time;
        this.x += dx;
        this.y += dy;
      }
      if (this.strafeRight) {
        dx = Math.cos(this.angle + RIGHT_ANGLE) * REVERSE_SPEED * time;
        dy = Math.sin(this.angle + RIGHT_ANGLE) * REVERSE_SPEED * time;
        this.x += dx;
        this.y += dy;
      }
    },

    ray: function(progress) {
      var angle = this.angle - this.fov * 0.5 + (this.fov * progress);
      return {
        x: this.x + Math.cos(angle) * RAY_DISTANCE,
        y: this.y + Math.sin(angle) * RAY_DISTANCE
      };
    },

    // TODO: wow. refactor.

    trace: function(map, segments) {
      var self = this;
      var walls = map.walls;
      var npcs = map.npcs;
      var intersections = [];
      var a0 = this.angle - this.fov * 0.5;
      var da = this.fov / segments;
      var a1 = this.angle + this.fov * 0.5 + 0.01;

      for (var angle = a0; angle <= a1; angle += da) {
        var hits = [];
        var hit;
        var px = this.x;
        var py = this.y;
        var rx = this.x + Math.cos(angle) * RAY_DISTANCE;
        var ry = this.y + Math.sin(angle) * RAY_DISTANCE;
        var i;

        i = walls.length;
        while (i--) {
          var wall = walls[i];
          intersection = intersect(px, py, rx, ry, wall[0], wall[1], wall[2], wall[3]);
          if (intersection) hits.push(this.hitDetails(wall, intersection, angle));
        }

        i = npcs.length;
        while (i--) {
          var npc = npcs[i];
          intersection = intersect(px, py, rx, ry, npc[0], npc[1], npc[2], npc[3]);
          if (intersection) hits.push(this.hitDetails(npc, intersection, angle));
        }

        hits.sort(sortDistance);

        var depth = 0, j = 0;
        while (j < hits.length && map.transparent(hits[j].texture)) j++;

        intersections.push({
          hits: hits.slice(0, j + 1),
          rayX: rx,
          rayY: ry
        });
      }

      this.intersections = intersections;

      function sortDistance(a, b) {
        return a.dist - b.dist;
      }
    },

    hitDetails: function(surface, intersection, angle) {

      // compute distance from player

      var dx = intersection.x - this.x;
      var dy = intersection.y - this.y;
      var hyp = Math.sqrt(dx * dx + dy * dy);
      var relativeAngle = angle - this.angle;
      var dist = hyp * Math.sin(RIGHT_ANGLE - relativeAngle);

      // compute distance from left edge of wall

      var surfaceDx = Math.abs(intersection.x - surface[0]) + NO_DIVIDE_BY_ZERO;
      var surfaceDy = Math.abs(intersection.y - surface[1]) + NO_DIVIDE_BY_ZERO;
      var surfaceTotalX = Math.abs(surface[2] - surface[0]) + NO_DIVIDE_BY_ZERO;
      var surfaceTotalY = Math.abs(surface[3] - surface[1]) + NO_DIVIDE_BY_ZERO;
      var surfaceLength = Math.sqrt(surfaceTotalX * surfaceTotalX + surfaceTotalY * surfaceTotalY);
      var textureDistance = Math.sqrt(surfaceDx * surfaceDx + surfaceDy * surfaceDy);
      var surfaceRatio = textureDistance / surfaceLength;

      // compute incident angle between ray and surface

      return {
        x: intersection.x,
        y: intersection.y,
        dist: dist,
        surface: surface,
        fromLeft: surfaceRatio,
        texture: surface.texture,
        angle: 0
      };
    }

  };


  // TODO: break this up or make it simpler. Too many arguments. Too much data.

  function wallHit(wall, intersection, angle, pAngle, px, py) {
    var dx = intersection.x - px;
    var dy = intersection.y - py;
    var hyp = Math.sqrt(dx * dx + dy * dy);
    var relativeAngle = angle - pAngle;
    var dist = hyp * Math.sin(RIGHT_ANGLE - relativeAngle);
    var wallDx = Math.abs(intersection.x - wall[0]) + NO_DIVIDE_BY_ZERO;
    var wallDy = Math.abs(intersection.y - wall[1]) + NO_DIVIDE_BY_ZERO;

    // TODO: precompute
    var wallTotalX = Math.abs(wall[2] - wall[0]) + NO_DIVIDE_BY_ZERO;
    var wallTotalY = Math.abs(wall[3] - wall[1]) + NO_DIVIDE_BY_ZERO;
    var wallLength = Math.sqrt(wallTotalX * wallTotalX + wallTotalY * wallTotalY);
    var textureDistance = Math.sqrt(wallDx * wallDx + wallDy * wallDy);
    var wallRatio = textureDistance / wallLength;

    return {
      x: intersection.x,
      y: intersection.y,
      dist: dist,
      wall: wall,
      wallRatio: wallRatio,
      texture: wall.texture
    };
  }

  function npcHit(npc, intersection, angle, pAngle, px, py, wx, wy) {
    var dx = intersection.x - px;
    var dy = intersection.y - py;
    var hyp = Math.sqrt(dx * dx + dy * dy);
    var relativeAngle = angle - pAngle;
    var dist = hyp * Math.sin(RIGHT_ANGLE - relativeAngle);
    var npcDx = intersection.x - wx;
    var npcDy = intersection.y - wy;

    var textureDistance = Math.sqrt(npcDx * npcDx + npcDy * npcDy);
    var textureRatio = textureDistance / npc.getWidth();

    return {
      x: intersection.x,
      y: intersection.y,
      dist: dist,
      npc: npc,
      textureRatio: textureRatio,
      texture: npc.getTexture()
    };
  }

  // TODO: this is more complicated than it needs to be; direct translation from Processing.org

  function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {
    var a1 = y2 - y1;
    var b1 = x1 - x2;
    var c1 = (x2 * y1) - (x1 * y2);

    var r3 = (a1 * x3 + b1 * y3 + c1);
    var r4 = (a1 * x4 + b1 * y4 + c1);

    if ((r3 !== 0) && (r4 !== 0) && (sign(r3) === sign(r4))) {
      return undefined;
    }

    var a2 = y4 - y3;
    var b2 = x3 - x4;
    var c2 = x4 * y3 - x3 * y4;

    var r1 = a2 * x1 + b2 * y1 + c2;
    var r2 = a2 * x2 + b2 * y2 + c2;

    if ((r1 !== 0) && (r2 !== 0) && (sign(r1) === sign(r2))) {
      return undefined;
    }

    var denom = (a1 * b2) - (a2 * b1);

    if (denom === 0) return undefined;

    var offset = (denom < 0) ? -denom / 2 : denom / 2;
    var num = (b1 * c2) - (b2 * c1);
    var x = (num < 0) ? (num - offset) / denom : (num + offset) / denom;
    num = (a2 * c1) - (a1 * c2);
    var y = (num < 0) ? (num - offset) / denom : (num + offset) / denom;

    return {
      x: x,
      y: y
    };
  }

  function sign(n) {
    if (n > 0) return 1;
    if (n < 0) return -1;
    return 0;
  }

  ns.Player = Player;

})('skookum', jQuery);