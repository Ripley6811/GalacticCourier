(function () {

	window.Tile = function Tile(image, tx, ty, x, y, width, height, category) {
        // IMAGE
        this.view = new createjs.Bitmap(image).set({
            sourceRect : new createjs.Rectangle(tx,ty,width,height)
            , regX : width / 2
            , regY : height / 2
            , onTick : tick
        });
        
        // PHYSICAL BODY (BOX2D)
        var bodyDef = new box2d.b2BodyDef();
        bodyDef.type = box2d.b2Body.b2_staticBody;
        bodyDef.position.x = x / SCALE + width / 2 / SCALE;
        bodyDef.position.y = y / SCALE + height / 2 / SCALE;
        bodyDef.userData = {
            id : "Ground"
        }
        this.view.body = world.CreateBody(bodyDef);
        
        var fixDef = new box2d.b2FixtureDef();
        fixDef.density = 1.0;
        fixDef.friction = 0.5;
        fixDef.restitution = 0.2;
        fixDef.shape = new box2d.b2PolygonShape;
        fixDef.shape.SetAsBox((width / 2 / SCALE), (height / 2 / SCALE));
        fixDef.filter.categoryBits = category;
        fixDef.userData = "Tile";
        this.view.body.CreateFixture(fixDef);
        
	}



	function tick(event) {
        // Update the image position by the box2d physics body position
        this.x = this.body.GetPosition().x * SCALE;
        this.y = this.body.GetPosition().y * SCALE;
        this.rotation = this.body.GetAngle() * (180/Math.PI);
	}
    

}());