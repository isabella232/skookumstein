(function(namespace) {

  var ns = window[namespace] = window[namespace] || {};

  function Raycaster(viewport) {
    this.viewport = viewport;
  }

  Raycaster.prototype = {

    render: function(map, rays) {
      if (!ns.Config.raycaster) return;
      var size = this.viewport.getSize();
      var segments = rays.length;
      var rayWidth = size.width / segments;
      var hit, texture;
      var i, j;

      if (ns.Config.columns === 'textured') {
        for (i = 0; i < segments; i++) {
          var hits = rays[i].hits;
          var x = Math.floor(i * rayWidth);
          var nextX = Math.floor((i + 1) * rayWidth);
          var screenWidth = nextX - x;
          for (j = hits.length - 1; j >= 0; j--) {
            hit = hits[j];
            this.viewport.textureCol(x, screenWidth, map, hit);
          }
        }
        return;
      }

      if (ns.Config.columns === 'deep') {
        for (i = 0; i < segments; i++) {
          hit = rays[i].hits[0];
          if (hit) this.viewport.litCol(i, segments, hit.dist);
        }
        return;
      }

      for (i = 0; i < segments; i++) {
        hit = rays[i].hits[0];
        if (hit) this.viewport.simpleCol(i, segments, hit.dist);
      }
    }

  };

  ns.Raycaster = Raycaster;

})('skookum');