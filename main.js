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
    topdown = new ns.Topdown();
    raycaster = new ns.Raycaster();
    gameloop = new ns.Gameloop();
    jim = new ns.Npc('jim');

    topdown.viewport = viewport;
    topdown.map = map;
    topdown.npcs = [jim];
    topdown.player = player;

    raycaster.viewport = viewport;
    raycaster.map = map;
    raycaster.npcs = [jim];
    raycaster.player = player;
  }

  function start() {
    gameloop.start(draw);
  }

  function draw(time) {
    player.step(time);
    player.trace(map.walls, ns.Config.segments);

    viewport.clear();
    raycaster.render();
    topdown.render();
  }

})('skookum');