(function(namespace) {
  // jshint expr: true

  var ns = window[namespace] = window[namespace] || {};

  var player, viewport, map, topdown, raycaster, gameloop, config;

  setup();
  start();

  function setup() {
    player = new ns.Player(500, 450, -90);
    viewport = new ns.Viewport(document.getElementById('viewport'));
    map = new ns.Map();
    topdown = new ns.Topdown(viewport);
    raycaster = new ns.Raycaster(viewport);
    gameloop = new ns.Gameloop();

    map.npcs.push(new ns.Npc('melissa', 395, 250));
    map.npcs.push(new ns.Npc('light', 390, 160));

    map.doors.push(new ns.Door('door', 'left', 266, 221, 250, 205)); // door to design room
    map.doors.push(new ns.Door('door', 'left', 250, 185, 265, 170)); // door to conference room
  }

  function start() {
    gameloop.start(draw);
  }

  function draw(time) {
    player.step(time, map);
    map.faceNpcsTowards(player.x, player.y);
    map.openDoorsNear(player.x, player.y);
    player.trace(map, ns.Config.segments);

    viewport.clear();
    raycaster.render(map, player.intersections);
    topdown.render(player, map, player.intersections);
    viewport.drawFps(gameloop.fps);
  }

})('skookum');