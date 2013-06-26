(function () {
    /*
    Assign a constructor function to a variable in the window scope
    */
	this.Rover = function() {
        // Createjs Shape
        view = new createjs.Bitmap(queue.getResult("rover"));
        view.set({
            // Set the "center" of this object
            regX : 61 / 2,
            regY : 31 / 2,
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
        bodyDef.angularDamping = 99;
        bodyDef.position.Set(3282/SCALE, 2288/SCALE); // World coordinates
        bodyDef.userData = "Rover";
        var body = world.CreateBody(bodyDef);
        
        //Main ship body
        var Vec2 = box2d.b2Vec2;
        var fixDef = new box2d.b2FixtureDef();
        fixDef.density = 10.;
        fixDef.friction = 0.4;
        fixDef.restitution = 0.4;
        fixDef.shape = new box2d.b2PolygonShape;
        var vertices = [
            new Vec2(6/SCALE,-16/SCALE),
            new Vec2(31/SCALE, -2/SCALE),
            new Vec2(31/SCALE, 5/SCALE),
            new Vec2(-31/SCALE,5/SCALE),
            new Vec2(-31/SCALE, -7/SCALE),
            new Vec2(-15/SCALE,-16/SCALE)
        ];
        fixDef.shape.SetAsArray(vertices, 6);
        fixDef.filter.categoryBits = CAT.SHIP;
        fixDef.filter.maskBits = CAT.GROUND | CAT.SOLDIER_FOOT_SENSOR;
        fixDef.userData = "Rover";
        body.CreateFixture(fixDef);
        
        //Right tire
        fixDef.shape = new box2d.b2CircleShape(7/SCALE);
        fixDef.shape.SetLocalPosition(new box2d.b2Vec2(12/SCALE, 8/SCALE));
        body.CreateFixture(fixDef);
        
        //Left tire
        fixDef.shape = new box2d.b2CircleShape(7/SCALE);
        fixDef.shape.SetLocalPosition(new box2d.b2Vec2(-15/SCALE, 8/SCALE));
        body.CreateFixture(fixDef);
        
        return body;
    }

    
    var thrust_increment = 5;
    /*
    This is the CreateJS update function for this object
    */
	function tick(event) {
    
        // CONTROLS
        if (controlFocus == this) {
            var angle = this.body.GetAngle();
            // FORWARD PULSE
            if (keys[K.UP] | keys[K.EIGHT]){
                this.body.ApplyImpulse(new box2d.b2Vec2(
                                        Math.cos(angle+Math.PI/2) * -thrust_increment,
                                        Math.sin(angle+Math.PI/2) * -thrust_increment),
                                     this.body.GetWorldCenter()
                                     );
            }
            // LEFT PULSE
            if (keys[K.LEFT] | keys[K.FOUR]){
                this.body.ApplyImpulse(new box2d.b2Vec2(
                                        Math.cos(angle) * -thrust_increment,
                                        Math.sin(angle) * -thrust_increment), this.body.GetWorldCenter());
            }
            // COUNTER-CLOCKWISE ROTATION
            if (keys[K.SEVEN]){ // CCW Rotation
                this.body.ApplyTorque( -20*thrust_increment );
            }
            // RIGHT PULSE
            if (keys[K.RIGHT] | keys[K.SIX]){ // Move right
                this.body.ApplyImpulse(new box2d.b2Vec2(
                                        Math.cos(angle) * thrust_increment,
                                        Math.sin(angle) * thrust_increment), this.body.GetWorldCenter());
            }
            // CLOCKWISE ROTATION
            if (keys[K.NINE]){ // CW Rotation
                this.body.ApplyTorque( 20*thrust_increment );
            }
        } // CONTROLS
        
        
        
        
        // Update the image position by the box2d physics body position
        this.x = this.bodyX();
        this.y = this.bodyY();
        this.rotation = this.bodyRotation();
	}

}());