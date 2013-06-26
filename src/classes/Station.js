(function () {
    /*
    Assign a constructor function to a variable in the window scope
    */
	this.Station = function() {
        // Createjs Shape
        var view = new createjs.Bitmap(queue.getResult("station"));
        view.set({
            // Set the "center" of this object
            regX : 300,
            regY : 300,
            // Set the CreateJS update method
            onTick : tick,
            // Add Box2D physics body
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
        // Box2D physics body
        var bodyDef = new box2d.b2BodyDef();
        bodyDef.type = box2d.b2Body.b2_dynamicBody;
        bodyDef.angle = 0;
        bodyDef.angularDamping = 0.2;
        bodyDef.position.Set( -50000/SCALE, -50000/SCALE); // World coordinates
        bodyDef.userData = "Station";
        var body = world.CreateBody(bodyDef);
        /*
        var fixDef = new box2d.b2FixtureDef();
        fixDef.density = 100.;
        fixDef.friction = 0.6;
        fixDef.restitution = 0.0;
        fixDef.shape = new box2d.b2PolygonShape;
        fixDef.shape.SetAsBox((70 / 2 / SCALE), (54 / 2 / SCALE));
        fixDef.filter.categoryBits = CAT.SHIP;
        fixDef.filter.maskBits = CAT.GROUND | CAT.SOLDIER_FOOT_SENSOR;
        fixDef.userData = "Ship";
        body.CreateFixture(fixDef);
        */
        //Left main body
        var Vec2 = box2d.b2Vec2;
        var fixDef = new box2d.b2FixtureDef();
        fixDef.density = 1000.;
        fixDef.friction = 0.6;
        fixDef.restitution = 0.0;
        fixDef.shape = new box2d.b2PolygonShape;
        var vertices = [
            new Vec2(-4/SCALE,240/SCALE),
            new Vec2(-34/SCALE,280/SCALE),
            new Vec2(-118/SCALE,55/SCALE),
            new Vec2(-110/SCALE,-228/SCALE),
            new Vec2(-10/SCALE,-261/SCALE)
        ];
        fixDef.shape.SetAsArray(vertices, 5);
        fixDef.filter.categoryBits = CAT.STATION;
        fixDef.filter.maskBits = CAT.GROUND | CAT.SHIP;
        fixDef.userData = "Station";
        body.CreateFixture(fixDef);
        
        //Right main body
        fixDef.shape = new box2d.b2PolygonShape;
        var vertices = [
            new Vec2(-4/SCALE,240/SCALE),
            new Vec2(-10/SCALE,-261/SCALE),
            new Vec2(98/SCALE,-220/SCALE),
            new Vec2(105/SCALE,58/SCALE),
            new Vec2(30/SCALE,284/SCALE),
        ];
        fixDef.shape.SetAsArray(vertices, 5);
        body.CreateFixture(fixDef);
        
        //Left wing
        fixDef.shape = new box2d.b2PolygonShape;
        var vertices = [
            new Vec2(-169/SCALE, 287/SCALE),
            new Vec2(-293/SCALE, 277/SCALE),
            new Vec2(-299/SCALE, -287/SCALE),
            new Vec2(-183/SCALE, -286/SCALE)
        ];
        fixDef.shape.SetAsArray(vertices, 4);
        body.CreateFixture(fixDef);
        
        //Right wing
        fixDef.shape = new box2d.b2PolygonShape;
        var vertices = [
            new Vec2(184/SCALE, -299/SCALE),
            new Vec2(290/SCALE, -299/SCALE),
            new Vec2(291/SCALE, 283/SCALE),
            new Vec2(178/SCALE, 281/SCALE)
        ];
        fixDef.shape.SetAsArray(vertices, 4);
        body.CreateFixture(fixDef);
        
        return body;
    }

    /*
    This is the CreateJS update function for this object
    */
	function tick(event) {
    
        // CONTROLS
        if (controlFocus == this) {
        
        }
        
        this.body.SetLinearVelocity(new box2d.b2Vec2(100,0));
        this.body.ApplyForce(new box2d.b2Vec2(0,-10*this.body.GetMass()),
                         this.body.GetWorldCenter()
                         );
        
        // Update the image position by the box2d physics body position
        this.x = this.bodyX();
        this.y = this.bodyY();
        this.rotation = this.bodyRotation();
	}


}());