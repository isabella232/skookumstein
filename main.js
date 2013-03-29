(function(namespace) {
  // jshint expr: true

  var ns = window[namespace] = window[namespace] || {};

  var player, viewport, map, topdown, raycaster, gameloop, config;
  var jim;

  setup();
  start();

  function setup() {
    player = new ns.Player();
    viewport = new ns.Viewport(document.getElementById('viewport'));
    map = new ns.Map();
    topdown = new ns.Topdown(viewport);
    raycaster = new ns.Raycaster(viewport);
    gameloop = new ns.Gameloop();
    jim = new ns.Npc('jim');
  }

  function start() {
    gameloop.start(draw);
  }

  function draw(time) {
    player.step(time);
    player.trace(map, ns.Config.segments);

    viewport.clear();
    raycaster.render(map, player.intersections);
    topdown.render(player, map, player.intersections);
    viewport.drawFps(gameloop.fps);
  }

})('skookum');