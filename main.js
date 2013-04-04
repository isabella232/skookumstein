(function(namespace) {
  // jshint expr: true

  var ns = window[namespace] = window[namespace] || {};

  var mapView, topdown;
  var playerView, raycaster;
  var player, map;
  var gameloop, config;

  setup();
  start();

  function setup() {
    mapView = new ns.Viewport(document.getElementById('map'));
    playerView = new ns.Viewport(document.getElementById('viewport'));

    player = new ns.Player(500, 450, -90);
    map = new ns.Map();

    topdown = new ns.Topdown(mapView);
    raycaster = new ns.Raycaster(playerView);
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

    mapView.clear();
    playerView.drawDistance();

    raycaster.render(map, player.intersections);
    topdown.render(player, map, player.intersections);

    playerView.drawFps(gameloop.fps);
  }

})('skookum');