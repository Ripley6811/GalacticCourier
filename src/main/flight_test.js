// GLOBAL Variables
var keys = [];
var world, stage, debug;
var SCALE = 30;

var controlFocus; // Object to control and center screen upon
var ship, soldier, rover, pointer;
var thrust = 0;

var particles = [];
var particlesToRemove = [];


// HTML Setup
var size = {
  width: window.innerWidth || document.body.clientWidth,
  height: window.innerHeight || document.body.clientHeight
}

var characterLocation = "planet";
function Color(r,g,b){
    this.r = r;
    this.g = g;
    this.b = b;
    this.toString = function(){
        return "rgb("+this.r.toFixed(0)+","+this.g.toFixed(0)+","+this.b.toFixed(0)+")";
    }
    this.transitioning = false;
}
var backColor = new Color(200,200,255);


var canvas = document.getElementById("canvas");
canvas.width = size.width;
canvas.height = size.height;
//canvas.style.background = "#CCF";
canvas.style.background = backColor.toString();
canvas.position = "absolute";
var ctx = canvas.getContext("2d");
document.documentElement.style.overflow = 'hidden';

debugBox2d = false;
if(debugBox2d){
    var debug = document.getElementById("debug");
    debug.width = size.width;
    debug.height = size.height;
    debug.position = "absolute";
    var dctx = debug.getContext("2d");
}




// LOAD GAME IMAGES AND OTHER ASSETS USING PreloadJS
var manifest = [
    {src:"../classes/images/ship.png", id:"ship"},
    {src:"../classes/images/rover.png", id:"rover"},
    {src:"../classes/images/station.png", id:"station"},
    {src:"../classes/images/soldier.png", id:"soldier"},
    {src:"../maps/tmw_desert_spacing.png", id:"map1"}
];
loadGame(); // loadGame.js runs init() when completed



    

function init(){
    stage.removeAllChildren();

    setupPhysics();
    
    addBox2DListeners(); // addBox2DListeners.js
    
    addDocumentListeners(); // addDocumentListeners.js
    
    
    createjs.Ticker.addEventListener("tick", tick);
    createjs.Ticker.setFPS(60);
    createjs.Ticker.useRAD = true;
}; // init()



function handleKeyDown(evt){
    keys[evt.keyCode] = true;
    //console.log("+", evt.keyCode);
    
}
function handleKeyUp(evt){
    if (keys[32] && evt.keyCode == 32){
        if (controlFocus.body.GetUserData() === "Soldier"){
            if (controlFocus.canEmbark != null) {
                if (controlFocus.canEmbark === "Ship") soldier.enterVehicle(ship);
                if (controlFocus.canEmbark === "Rover") soldier.enterVehicle(rover);
            }
        }
        else {
            soldier.exitVehicle();
        }
    }
    keys[evt.keyCode] = false;
    //console.log("-", keys);
}
function handleWheel(evt){
    // Accelerate or decelerate main engines
    var delta=evt.detail? evt.detail*(-120) : evt.wheelDelta;
    console.log(delta, thrust);
    if (controlFocus === ship) {
        if (Math.abs(delta) > 10) {
            // Chrome
            if (delta != 0) thrust += 500*delta/120;
        } else {
            // Firefox
            if (delta != 0) thrust += 500*delta;
        }
        if (thrust < 0) thrust = 0;
    }
    
    
}


function setupPhysics() {

    world = new box2d.b2World(
                       new box2d.b2Vec2(0, 10), // Gravity in physics world
                       true                  // Sleeping enabled
                  );
                  
                  
    //planet = new Earth();
    //stage.addChild(planet);
    
    
    setupWorld();
    
    
    
    // CREATE PLAYER
    ship = new Ship();
    stage.addChild(ship);
    
    rover = new Rover();
    stage.addChild(rover);
    
    station = new Station();
    stage.addChild(station);
    
    soldier = new Soldier();
    stage.addChild(soldier);
    
    pointer = new Pointer();
    stage.addChild(pointer);
    
    controlFocus = soldier;
    
    
    
    if(debugBox2d){
        //setup debug draw
        var debugDraw = new box2d.b2DebugDraw();
        debugDraw.SetSprite(dctx);
        debugDraw.SetDrawScale(SCALE);
        debugDraw.SetFillAlpha(0.3);
        debugDraw.SetLineThickness(1.0);
        debugDraw.SetFlags(box2d.b2DebugDraw.e_shapeBit | box2d.b2DebugDraw.e_jointBit);
        world.SetDebugDraw(debugDraw);
    }

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
} // getTilePacket()




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



var gameOver = false;

function tick(){
    // BOX2D WORLD: PHYSICS STEP FORWARD THEN CLEAR FORCES
    world.Step(
         1 / 60   //frame-rate
      ,  10       //velocity iterations
      ,  10       //position iterations
    );
    world.ClearForces();
    
    // SHOW/HIDE BOX2D FIXTURES
    if (debugBox2d) {
        dctx.save();
        dctx.translate(canvas.width/2-controlFocus.x,canvas.height/2-controlFocus.y);
        world.DrawDebugData();
        dctx.restore();
    }
    // CREATEJS STAGE: UPDATE DISPLAY POSITIONS FROM PHYSICS BODIES
    if (!gameOver) {
        if (controlFocus.bodyY() < 0 && characterLocation === "planet") {
            backColor.transitioning = true;
            new createjs.Tween.get(backColor)
                              .to({r:10,g:10,b:35}, 4000, createjs.Ease.linear)
                              .call(function(){ backColor.transitioning = false; });
            characterLocation = "space";
        }
        if (backColor.transitioning === true) {
            canvas.style.background = backColor.toString();
            console.log(backColor.toString());
        }
        
        if (characterLocation === "space") {
            // ADD STARS RANDOMLY AROUND AREA JUST OUTSIDE VIEW
            for (var i = 0; i < 5; i++) {
                var star = new createjs.Shape();
                star.graphics.s("#DDD").f("#FFF")
                             .drawPolyStar((Math.random()-0.5)*(size.width+100)+controlFocus.bodyX(),
                                           (Math.random()-0.5)*(size.height+100)+controlFocus.bodyY(),
                                           4,5,0.7,Math.random()*360);
                star.alpha = 0;
                stage.addChild(star);
                new createjs.Tween.get(star)
                                  .to({alpha : .6}, 200, createjs.Ease.linear)
                                  .to({alpha : 0}, 200, createjs.Ease.linear)
                                  .call(function(){ stage.removeChild(star); });
            }
        }
    
            
        var xDiff = station.bodyX()-ship.bodyX();
        var yDiff = station.bodyY()-ship.bodyY();
        if (!gameOver && xDiff > -1 && xDiff < 8 && yDiff > -309.0 && yDiff < -307.0){
            console.log("WIN!!");
            var winningText = new createjs.Text("Congratulations!", "bold 50px Arial", "#4AD");
            winningText.shadow = new createjs.Shadow("#000", 5,5,10);
            winningText.textAlign = "center";
            winningText.x = ship.bodyX();
            winningText.y = ship.bodyY();
            stage.addChild(winningText);
            gameOver = true;
        }
        stage.update(controlFocus);
        stage.setTransform(canvas.width/2-controlFocus.x,canvas.height/2-controlFocus.y);
        
        
        // DISPLAY SOME TEXT INFORMATION
        ctx.font = "bold 15px sans-serif";
        ctx.fillStyle = "#555";
        ctx.textBaseline = "center";
        var pbody = ship.body;
        ctx.fillText("Space bar to embark/disembark spaceship", 20, 20);
        ctx.fillText("SPACESHIP CONTROLS", 20, 40);
        ctx.fillText("Arrow keys or [4,5,6,8] for directional impulse.", 20, 60);
        ctx.fillText("[1,3,7,9] for rotational impulse.", 20, 80);
        ctx.fillText("Mousewheel and +/- keys for main engine thrust.", 20, 100);
        //ctx.fillText(pbody.GetLinearVelocity().x.toFixed(2), 20, 20);
        //ctx.fillText(pbody.GetLinearVelocity().y.toFixed(2), 20, 40);
        ctx.fillText("acceleration greater than " + (10*ship.body.GetMass()).toFixed(2)
            + " to lift off: " + thrust.toFixed(2), 20, 120);
        
        ctx.fillText(soldier.body.GetMass().toFixed(2) 
            + "  " + ship.body.GetMass().toFixed(2)
            + "  " + station.body.GetMass().toFixed(2)
            + "  " + rover.body.GetMass().toFixed(2), 20, 160);
        ctx.fillText("SHIP position: " + ship.bodyX().toFixed(2)
            + "  " + ship.bodyY().toFixed(2), 20, 200);
        ctx.fillText("STATION pos.:  " + station.bodyX().toFixed(2)
            + "  " + station.bodyY().toFixed(2), 20, 220);
        ctx.fillText("DIFF in pos:   " + (station.bodyX()-ship.bodyX()).toFixed(2)
            + "  " + (station.bodyY()-ship.bodyY()).toFixed(2), 20, 240);
    }
} // tick()


