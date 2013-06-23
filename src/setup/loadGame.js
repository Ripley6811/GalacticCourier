function loadGame() {
// LOAD ASSETS
    stage = new createjs.Stage("canvas");
    if (debugBox2d) debug = document.getElementById("debug");

    var backdrop = new createjs.Shape();
    backdrop.graphics.s("#008").f("#008").dr(0,0,size.width,size.height);
    stage.addChild(backdrop);
    var loadingText = new createjs.Text("Loading", "bold 40px Arial", "#4AD");
    loadingText.shadow = new createjs.Shadow("#000", 5,5,10);
    loadingText.textAlign = "center";
    loadingText.x = size.width/2;
    loadingText.y = size.height/2;
    stage.addChild(loadingText);
    stage.update();
    var angle = 0;
    
    var star = new createjs.Shape()
    star.graphics.s("#FB6").f("#FFF").drawPolyStar(0,0,100,5,0.9,0);
    
    //mt(-100,0).s("#FB6").f("#FFF").lt(-5,5).lt(0,100).lt(5,5).lt(100,0).lt(5,-5).lt(0,-100).lt(-5,-5).lt(-100,0);
    star.set({
        x : size.width / 4,
        y : size.height / 4,
        scaleX : 0.5,
        scaleY : 0.5,
        shadow : new createjs.Shadow("#000", 1,1,10),
        onTick : function() {
                        this.rotation += 1;
                        this.scaleX *= 1.003;
                        this.scaleY *= 1.003;
                    }
     });
     var star2 = star.clone();
    star2.set({
        x : size.width*3 / 4,
        y : size.height*3 / 4,
        onTick : function() {
                        this.rotation += 1;
                        this.scaleX *= 1.003;
                        this.scaleY *= 1.003;
                    }
     });
    stage.addChild(star, star2);
    
    function updateLoading(event){
        loadingText.text = "Loading " + (event.progress*100|0) + "%";
        stage.update();
    }
    
    this.queue = new createjs.LoadQueue(true);
    queue.installPlugin(createjs.Sound);
    queue.addEventListener("complete", this.init );
    queue.addEventListener("progress", updateLoading);
    queue.loadManifest(manifest);
}