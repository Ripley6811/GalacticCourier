// HTML Setup
var size = {
  width: window.innerWidth || document.body.clientWidth,
  height: window.innerHeight || document.body.clientHeight
}

var canvas = document.getElementById("canvas");
canvas.width = size.width;
canvas.height = size.height;
canvas.backgroundColor = "#fff";
canvas.position = "absolute";
var ctx = canvas.getContext("2d");


var debug = document.getElementById("debug");
debug.width = size.width;
debug.height = size.height;
debug.position = "absolute";
var dctx = debug.getContext("2d");

//document.documentElement.style.overflow = 'hidden';


// LOAD ASSETS

var queue = new createjs.LoadQueue(true);
queue.installPlugin(createjs.Sound);
queue.addEventListener("complete", init );
queue.addEventListener("progress", updateLoading);
queue.loadManifest([
    {src:"../flight_test/images/ship.png", id:"ship"},
    {src:"../flight_test/images/soldier.png", id:"soldier"},
    {src:"../maps/tmw_desert_spacing.png", id:"map1"}
]);
ctx.fillStyle="#000";
ctx.fillRect(100,100,300,30)
ctx.textBaseline = "bottom";
ctx.font = "bold 40px sans-serif";
ctx.fillStyle="#5BF";
ctx.fillText("Loading", 120, 100);
function updateLoading(event){
    ctx.fillRect(100,100,300*event.progress,30);
}





// GLOBAL Variables
var keys = [];
var world, stage, debug;
var SCALE = 30;

var controlFocus;
var ship, soldier;
var thrust = 0;

var particles = [];
var particlesToRemove = [];

var listener = new box2d.b2ContactListener();

    
function init(){
    stage = new createjs.Stage("canvas");
    debug = document.getElementById("debug");

    setupPhysics();

    

    function handleKeyDown(evt){
        keys[evt.keyCode] = true;
        //console.log("+", evt.keyCode);
    }
    function handleKeyUp(evt){
        if (keys[32] && evt.keyCode == 32){
            if (controlFocus.body.GetUserData() === "Soldier"){
                if (controlFocus.canEmbark > 0) {
                    // ADD ANIMATION FOR BOARDING SPACESHIP
                    controlFocus.visible = false;
                    controlFocus = ship;
                }
            }
            else {
                if (controlFocus.body.GetUserData() === "Ship"){
                    var position = controlFocus.body.GetPosition();
                    // ADD ANIMATION FOR DISEMBARKING SPACESHIP
                    soldier.body.SetPosition(position);
                    controlFocus = soldier;
                    controlFocus.visible = true;
                }
            }
        }
        keys[evt.keyCode] = false;
        //console.log("-", keys);
    }
    function handleWheel(evt){
        // Accelerate or decelerate main engines
        //console.log(evt.wheelDelta, thrust);
        if (controlFocus === ship) {
            if (evt.wheelDelta != 0) thrust += 500*evt.wheelDelta/120;
            if (thrust < 0) thrust = 0;
        }
        
        
    }
    document.addEventListener(
        "keydown", 
        handleKeyDown,
        true
    );
    document.addEventListener(
        "keyup", 
        handleKeyUp,
        true
    );
    document.addEventListener(
        "mousewheel", 
        handleWheel, 
        false
    );
    
    listener.PreSolve = function(contact, manifold){
        var fixtures = [];
        fixtures.push( contact.GetFixtureA().GetUserData() );
        fixtures.push( contact.GetFixtureB().GetUserData() );
        
        if (fixtures[0] == "SBody" || fixtures[1] == "SBody"){
            console.log( "SBody:", manifold.m_points[0].m_normalImpulse );
        }
    }
    listener.BeginContact = function(contact){
        var fixtures = [];
        fixtures.push( contact.GetFixtureA().GetUserData() );
        fixtures.push( contact.GetFixtureB().GetUserData() );
        
        //console.log("BEGIN: " + fixtures);
        if (fixtures[0] == "Foot" || fixtures[1] == "Foot") {
            if (fixtures[0] == "Tile" || fixtures[1] == "Tile"){
                soldier.isGrounded++;
                //console.log("<grounded> " + soldier.isGrounded);
            }
        }
        if (fixtures[0] == "Foot" || fixtures[1] == "Foot") {
            if (fixtures[0] == "Ship" || fixtures[1] == "Ship"){
                soldier.canEmbark++;
            }
        }
        
    }
    listener.EndContact = function(contact){
        var fixtures = [];
        fixtures.push( contact.GetFixtureA().GetUserData() );
        fixtures.push( contact.GetFixtureB().GetUserData() );
        
        //console.log("END: " + fixtures);
        if (fixtures[0] == "Foot" || fixtures[1] == "Foot") {
            if (fixtures[0] == "Tile" || fixtures[1] == "Tile"){
                soldier.isGrounded--;
            }
        }
        if (fixtures[0] == "Foot" || fixtures[1] == "Foot") {
            if (fixtures[0] == "Ship" || fixtures[1] == "Ship"){
                soldier.canEmbark--;
            }
        }
        
    }

   /* listener.EndContact = function(contact) {
        console.log(contact.GetFixtureA().GetBody().GetUserData());
    }*/

    world.SetContactListener(listener);
    
    createjs.Ticker.addListener(this);
    createjs.Ticker.setFPS(60);
    createjs.Ticker.useRAD = true;
}; // init()


function setupPhysics() {


    world = new box2d.b2World(
                       new box2d.b2Vec2(0, 10), // Gravity in physics world
                       true                  // Sleeping enabled
                  );
                  
                  
    //planet = new Earth();
    //stage.addChild(planet);
    
    
    setupWorld();
    
    
    
    // CREATE PLAYER
    ship = new Ship().view;
    stage.addChild(ship);
    
    soldier = new Soldier().view;
    stage.addChild(soldier);
    
    controlFocus = soldier;
    
    
    
    
    //setup debug draw
    var debugDraw = new box2d.b2DebugDraw();
    debugDraw.SetSprite(dctx);
    debugDraw.SetDrawScale(SCALE);
    debugDraw.SetFillAlpha(0.3);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(box2d.b2DebugDraw.e_shapeBit | box2d.b2DebugDraw.e_jointBit);
    world.SetDebugDraw(debugDraw);

} // setupPhysics()

function getTilePacket(map1, tileIndex) {
        var pkt = {
            "img": null,
            "px": 0,
            "py": 0
        };

        var tile = 0;
        for(tile = map1.tilesets.length - 1; tile >= 0; tile--) {
            if(map1.tilesets[tile].firstgid <= tileIndex) break;
        }

        pkt.img = map1.tilesets[tile].image;


        var localIdx = tileIndex - map1.tilesets[tile].firstgid;
        var margin = map1.tilesets[tile].margin;
        var spacing = map1.tilesets[tile].spacing;

        var lTileX = Math.floor(localIdx % Math.floor(map1.tilesets[tile].imagewidth / map1.tilesets[tile].tilewidth));
        var lTileY = Math.floor(localIdx / Math.floor(map1.tilesets[tile].imagewidth / map1.tilesets[tile].tileheight));

        pkt.px = margin + lTileX * (map1.tilewidth + spacing);
        pkt.py = margin + lTileY * (map1.tileheight + spacing);


        return pkt;
}




var worldImg = new createjs.Shape();

function setupWorld() {

    
    

    for(var layerIdx = 0; layerIdx < map1.layers.length; layerIdx++) {
        if(map1.layers[layerIdx].type != "tilelayer") continue;
        var dat = map1.layers[layerIdx].data;
        for(var tileIDX = 0; tileIDX < dat.length; tileIDX++) {
            var tID = dat[tileIDX];
            if(tID === 0) continue;
            var cat = CAT.GROUND;
            if(tID === 30) cat = CAT.BACKGROUND;
            var tPKT = getTilePacket(map1,tID);
            var wX = Math.floor(tileIDX % map1.width) * map1.tilewidth;
            var wY = Math.floor(tileIDX / map1.width) * map1.tileheight;
            var t = new Tile(queue.getResult("map1"),  tPKT.px, tPKT.py, wX, wY, map1.tilewidth, map1.tileheight, cat)
            
            stage.addChild(t.view);
        }
    }
} // setupWorld()





function tick(){
    // BOX2D WORLD: PHYSICS STEP FORWARD THEN CLEAR FORCES
    world.Step(
         1 / 60   //frame-rate
      ,  10       //velocity iterations
      ,  10       //position iterations
    );
    world.ClearForces();
    
    // SHOW/HIDE BOX2D FIXTURES
    if (false) {
        dctx.save();
        dctx.translate(canvas.width/2-controlFocus.x,canvas.height/2-controlFocus.y);
        world.DrawDebugData();
        dctx.restore();
    }
    // CREATEJS STAGE: UPDATE DISPLAY POSITIONS FROM PHYSICS BODIES
    stage.update(controlFocus);
    stage.setTransform(canvas.width/2-controlFocus.x,canvas.height/2-controlFocus.y);
    
    
    
    // DISPLAY SOME TEXT INFORMATION
    ctx.font = "bold 15px sans-serif";
    ctx.fillStyle = "#000";
    ctx.textBaseline = "center";
    var pbody = ship.body;
    ctx.fillText("Space bar to embark/disembark spaceship", 20, 20);
    ctx.fillText("SPACESHIP CONTROLS", 20, 40);
    ctx.fillText("Arrow keys or [4,5,6,8] for directional impulse.", 20, 60);
    ctx.fillText("[1,3,7,9] for rotational impulse.", 20, 80);
    ctx.fillText("Mousewheel and +/- keys for main engine thrust.", 20, 100);
    //ctx.fillText(pbody.GetLinearVelocity().x.toFixed(2), 20, 20);
    //ctx.fillText(pbody.GetLinearVelocity().y.toFixed(2), 20, 40);
    ctx.fillText("acceleration greater than 10600 to lift off: " + thrust.toFixed(2), 20, 120);
    
    ctx.fillText(soldier.body.GetMass().toFixed(2) + "  " + ship.body.GetMass().toFixed(2), 20, 160);
    
} // tick()


