(function () {
    
	this.Ship = function() {
        // Createjs Shape
        this.view = new createjs.Bitmap(queue.getResult("ship"));
        
        this.view.set({
            regX : 70 / 2,
            regY : 136 / 2,
            onTick : tick,
            body : createBox2DBody()
        });
	}
    

    function createBox2DBody() {
        var bodyDef = new box2d.b2BodyDef();
        bodyDef.type = box2d.b2Body.b2_dynamicBody;
        bodyDef.angle = 0;
        bodyDef.angularDamping = 0.2;
        bodyDef.position.Set( 1000/SCALE, 1470/SCALE); // World coordinates
        bodyDef.userData = "Ship";
        var body = world.CreateBody(bodyDef);
        
        var fixDef = new box2d.b2FixtureDef();
        fixDef.density = 100.;
        fixDef.friction = 0.6;
        fixDef.restitution = 0.0;
        fixDef.shape = new box2d.b2PolygonShape;
        fixDef.shape.SetAsBox((70 / 2 / SCALE), (136 / 2 / SCALE));
        fixDef.filter.categoryBits = CAT.SHIP;
        fixDef.filter.maskBits = CAT.GROUND | CAT.SOLDIER_FOOT_SENSOR;
        fixDef.userData = "Ship";
        body.CreateFixture(fixDef);
    
        return body;
    }

    
    var thrust_increment = 80;
    
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
                new Exhaust(0,50,3,this.body.GetAngle(),10,10);
            }
            // LEFT PULSE
            if (keys[K.LEFT] | keys[K.FOUR]){
                this.body.ApplyImpulse(new box2d.b2Vec2(
                                        Math.cos(angle) * -thrust_increment,
                                        Math.sin(angle) * -thrust_increment), this.body.GetWorldCenter());
                new Exhaust(39,17,3,this.body.GetAngle()-Math.PI/2,10,10);
                new Exhaust(20,-38,3,this.body.GetAngle()-Math.PI/2,10,10);
            }
            // COUNTER-CLOCKWISE ROTATION
            if (keys[K.SEVEN]){ // CCW Rotation
                this.body.ApplyTorque( -20*thrust_increment );
                new Exhaust(20,-38,3,this.body.GetAngle()-Math.PI/2,10,10);
            }
            if (keys[K.THREE]){ // CCW Rotation
                this.body.ApplyTorque( -20*thrust_increment );
                new Exhaust(-39,17,3,this.body.GetAngle()+Math.PI/2,10,10);
            }
            // RIGHT PULSE
            if (keys[K.RIGHT] | keys[K.SIX]){ // Move right
                this.body.ApplyImpulse(new box2d.b2Vec2(
                                        Math.cos(angle) * thrust_increment,
                                        Math.sin(angle) * thrust_increment), this.body.GetWorldCenter());
                new Exhaust(-39,17,3,this.body.GetAngle()+Math.PI/2,10,10);
                new Exhaust(-20,-38,3,this.body.GetAngle()+Math.PI/2,10,10);
            }
            // CLOCKWISE ROTATION
            if (keys[K.NINE]){ // CW Rotation
                this.body.ApplyTorque( 20*thrust_increment );
                new Exhaust(-20,-38,3,this.body.GetAngle()+Math.PI/2,10,10);
            }
            if (keys[K.ONE]){ // CW Rotation
                this.body.ApplyTorque( 20*thrust_increment );
                new Exhaust(39,17,3,this.body.GetAngle()-Math.PI/2,10,10);
            }
            // REVERSE PULSE
            if (keys[K.DOWN] | keys[K.FIVE]){ 
                this.body.ApplyImpulse(new box2d.b2Vec2(
                                        Math.cos(angle+Math.PI/2) * thrust_increment,
                                        Math.sin(angle+Math.PI/2) * thrust_increment), this.body.GetWorldCenter());
                new Exhaust(0,-57,3,this.body.GetAngle()+Math.PI,10,10);
            }
            // MAIN ENGINE CONTROLS
            if (keys[K.TWO])   thrust = 0.0;
            if (keys[K.PLUS])  thrust += thrust_increment;
            if (keys[K.MINUS]) thrust -= thrust_increment;
            if (thrust < 0) thrust = 0;
        } // CONTROLS
        
        
        if (thrust > 0){
            var angle = this.body.GetAngle();
            this.body.ApplyForce(new box2d.b2Vec2(
                                Math.cos(angle-Math.PI/2) * thrust,
                                Math.sin(angle-Math.PI/2) * thrust),
                             this.body.GetPosition()
                             );
                             
            new Exhaust(22,68,thrust*.001,angle,15,33);
            new Exhaust(-22,68,thrust*.001,angle,15,33);
            //new Exhaust(22,68,thrust*.2,angle,15,40);
            //new Exhaust(-22,68,thrust*.2,angle,15,40);
        } 
        
        
        deleteExhaust();
        
        // Update the image position by the box2d physics body position
        this.x = this.body.GetPosition().x * SCALE;
        this.y = this.body.GetPosition().y * SCALE;
        this.rotation = this.body.GetAngle() * (180/Math.PI);
	}
    
    
    function deleteExhaust(){
        for (var i=0; i<particlesToRemove.length; i++){
            //p = particlesToRemove.shift();
            world.DestroyBody(particlesToRemove[i].body);
            stage.removeChild(particlesToRemove[i]);
        };
        particlesToRemove = [];
    }
    


}());