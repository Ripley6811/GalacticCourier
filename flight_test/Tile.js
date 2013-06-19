(function (window) {

	function Tile(image, tx, ty, x, y, width, height, category) {
        // IMAGE
        this.view = new createjs.Bitmap(image);
        //var graphics = new createjs.Graphics();.drawRect(x,y,width,height);
        //this.view.mask = new createjs.Shape(graphics);
        this.view.sourceRect = new createjs.Rectangle(tx,ty,width,height);
        this.view.regX = width / 2;
        this.view.regY = height / 2;
        //this.view.image.mask(mask);
        
        // PHYSICAL BODY (BOX2D)
        var fixDef = new box2d.b2FixtureDef();
        fixDef.density = 1.0;
        fixDef.friction = 0.5;
        fixDef.restitution = 0.2;
        var bodyDef = new box2d.b2BodyDef();
        bodyDef.type = box2d.b2Body.b2_staticBody;
        bodyDef.position.x = x / SCALE + width / 2 / SCALE;
        bodyDef.position.y = y / SCALE + height / 2 / SCALE;
        bodyDef.userData = {
            id : "Ground"
        }
        fixDef.shape = new box2d.b2PolygonShape;
        fixDef.shape.SetAsBox((width / 2 / SCALE), (height / 2 / SCALE));
        fixDef.filter.categoryBits = category;
        fixDef.userData = "Tile";
        this.view.body = world.CreateBody(bodyDef);
        this.view.body.CreateFixture(fixDef);
        
        // UPDATE METHOD
        this.view.onTick = tick;
        
	}



	function tick(event) {
    
    
    
        
        // Update the image position by the box2d physics body position
        this.x = this.body.GetPosition().x * SCALE;
        this.y = this.body.GetPosition().y * SCALE;
        this.rotation = this.body.GetAngle() * (180/Math.PI);
	}
    
    

     // Instantiate object from root scope
	window.Tile = Tile;

}(window));