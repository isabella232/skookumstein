(function(namespace) {

  var ns = window[namespace] = window[namespace] || {};

  function Raycaster() {
    this.viewport = undefined;
  }

  Raycaster.prototype = {

    render: function(map, intersections) {
      if (!ns.Config.raycaster) return;
      var size = this.viewport.getSize();
      var segments = intersections.length;
      var rayWidth = size.width / segments;
      var i, j;

      if (ns.Config.textures) {
        for (i = 0; i < segments; i++) {
          for (j = intersections[i].length - 1; j >= 0; j--) {
            var inter = intersections[i][j];
            var texture = map.texture(inter.texture);
            this.viewport.textureCol(i, segments, inter.dist, texture, inter.textureRatio);
          }
        }
        return;
      }

      if (ns.Config.lighting) {
        for (i = 0; i < segments; i++) {
          this.viewport.litCol(i, segments, intersections[i].dist);
        }
        return;
      }

      for (i = 0; i < segments; i++) {
        this.viewport.simpleCol(i, segments, intersections[i].dist);
      }
    }

  };

  ns.Raycaster = Raycaster;

})('skookum');