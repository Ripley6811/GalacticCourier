/*
Class

REQUIRED: 
    Libraries:
        box2d
        createjs
    Constants:
        SCALE
*/
(function () {
    /*
    Assign a constructor function to a variable in the window scope
    */
	this.ClassName = function() {
        // Add a CreateJS Shape/Image
        var view = new createjs.Shape();
        view.set({
            // Set the center of this object
            regX : 70 / 2,
            regY : 136 / 2,
            // Set the CreateJS update function
            onTick : tick,
            // Add the Box2D physics body
            body : createBox2DBody(),
            bodyX : function(){ return this.body.GetPosition().x * SCALE },
            bodyY : function(){ return this.body.GetPosition().y * SCALE },
            bodyRotation : function(){ return this.body.GetAngle() * (180/Math.PI) }
        });
        
        return view;
	}

    /*
    This function creates the Box2D physics body
    */
    function createBox2DBody() {
        // BODY
        var bodyDef = new box2d.b2BodyDef();
        bodyDef.type = box2d.b2Body.b2_dynamicBody;
        bodyDef.angle = 0;
        bodyDef.angularDamping = 0.2;
        bodyDef.position.Set( 1000/SCALE, 1470/SCALE); //canvas.height / 2 / SCALE;
        bodyDef.userData = "body name";
        var body = world.CreateBody(bodyDef);
        
        // FIXTURES
        var fixDef = new box2d.b2FixtureDef();
        fixDef.density = 100.;
        fixDef.friction = 0.6;
        fixDef.restitution = 0.0;
        fixDef.shape = new box2d.b2PolygonShape;
        fixDef.shape.SetAsBox((70 / 2 / SCALE), (136 / 2 / SCALE));
        fixDef.filter.categoryBits = CAT.SHIP;
        fixDef.filter.maskBits = CAT.GROUND | CAT.SOLDIER_FOOT_SENSOR;
        fixDef.userData = "fixture name";
        body.CreateFixture(fixDef);
    
        return body;
    }
    
    /*
    This is the CreateJS update function for this object
    */
    function tick(obj) {
    
        // CONTROLS
        if (obj == this) {
        
        } // CONTROLS
        
        
        // UPDATE IMAGE POSITION AND ROTATION TO MATCH BOX2D BODY
        this.x = this.bodyX();
        this.y = this.bodyY();
        this.rotation = this.bodyRotation();
	}
    
}());