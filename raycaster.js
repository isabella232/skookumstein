(function(namespace) {

  var ns = window[namespace] = window[namespace] || {};

  function Raycaster() {
    this.setDefaults();
  }

  Raycaster.prototype = {

    setDefaults: function() {
      this.viewport =
      this.map =
      this.npcs =
      this.player =
      undefined;
    },

    render: function() {
      if (!ns.Config.raycaster) return;
      var size = this.viewport.getSize();
      var intersections = this.player.intersections;
      var segments = intersections.length;
      var rayWidth = size.width / segments;
      var i;

      if (ns.Config.textures) {
        for (i = 0; i < segments; i++) {
          var inter = intersections[i];
          this.viewport.textureCol(i, segments, inter.dist, this.map.texture(inter.texture), inter.textureRatio, this.map.shadow(inter.texture));
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