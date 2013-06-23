(function () {
    /*
    TODO: 
    */
    
    
	window.Soldier = function() {
        this.view = new createjs.Bitmap(queue.getResult("soldier"));
        this.view.set({
            regX : 25 / 2,
            regY : 46 / 2,
        
            isGrounded : 0,
            canEmbark : 0, // Set to one when character touches vehicle
            onTick : tick,
            body : createBody(),
            bodyX : function(){ return this.body.GetPosition().x * SCALE },
            bodyY : function(){ return this.body.GetPosition().y * SCALE },
            jumpPhase : 0,  // Tracking the phases of a jump,
            gravityAdjust : 0,
            animate : false,  // Set to true when moving image instead of physics body
            enterVehicle : enterVehicle,
            exitVehicle : exitVehicle
        });
        
        return this.view;
     }
     
     
     function createBody() {
        
        // BODY DEF
        var bodyDef = new box2d.b2BodyDef();
        bodyDef.type = box2d.b2Body.b2_dynamicBody;
        bodyDef.fixedRotation = true; // Prevent any rotation
        bodyDef.userData = "Soldier";
        bodyDef.position.Set( 900/SCALE, 1518/SCALE); //canvas.height / 2 / SCALE;
        var body = world.CreateBody(bodyDef);
        
        // BODY FIXTURE 
        var fixDef = new box2d.b2FixtureDef();
        fixDef.shape = new box2d.b2PolygonShape;
        fixDef.shape.SetAsOrientedBox((25 / 2 / SCALE), (25 / 2 / SCALE), new box2d.b2Vec2(0,-18/2/SCALE));
        fixDef.density = 1.0;
        fixDef.friction = 0.0;
        fixDef.restitution = 0.0;
        fixDef.userData = "SBody";
        fixDef.filter.categoryBits = CAT.SOLDIER;
        fixDef.filter.maskBits = CAT.GROUND;
        body.CreateFixture(fixDef);
        
        // FOOT FIXTURE 
        fixDef.shape = new box2d.b2CircleShape(25/2/SCALE);
        fixDef.shape.SetLocalPosition(new box2d.b2Vec2(0, 20/2/SCALE));
        fixDef.density = 1.0;
        fixDef.friction = 0.0;
        fixDef.restitution = 0.0;
        fixDef.userData = "SFoot";
        fixDef.filter.categoryBits = CAT.SOLDIER;
        fixDef.filter.maskBits = CAT.GROUND;
        body.CreateFixture(fixDef);
        
        
        // FOOT SENSOR
        fixDef.density = 0.1;
        fixDef.friction = 1.;
        fixDef.restitution = 0.1;
        fixDef.userData = "Foot";
        fixDef.shape = new box2d.b2PolygonShape;
        fixDef.shape.SetAsOrientedBox((10 / 2 / SCALE), (10 / 2 / SCALE), new box2d.b2Vec2(0,(46 / 2 / SCALE)));
        fixDef.isSensor = true;
        fixDef.filter.categoryBits = CAT.SOLDIER_FOOT_SENSOR;
        fixDef.filter.maskBits = CAT.SHIP | CAT.GROUND;
        body.CreateFixture(fixDef);
        
        return body;
	}
    
    
    function enterVehicle(vehicle){
        this.animate = true;
        new createjs.Tween.get(this).to({x:vehicle.x}, 600, createjs.Ease.linear);
        new createjs.Tween.get(this).to({y:vehicle.y}, 600, createjs.Ease.backOut)
                          .call(function(){
                                    this.visible = false;
                                    this.animate = false;
                                    controlFocus = vehicle;
                                });
    }
    
    function exitVehicle() {
        this.body.SetPosition(controlFocus.body.GetPosition());
        this.body.SetLinearVelocity(controlFocus.body.GetLinearVelocity());
        controlFocus = soldier;
        controlFocus.visible = true;
    }

    
    var movementSpeed = 15;
    var maxMoveSpeed = 8;
    var jumpingSpeed = 3;
	function tick(event) {
        if (this.animate === false){
            var oldvec = this.body.GetLinearVelocity();
            var newy = oldvec.y;
            var newx = oldvec.x;
            if (newx > maxMoveSpeed) {newx = maxMoveSpeed} 
                else if (newx < -maxMoveSpeed) {newx = -maxMoveSpeed};
            if (this.isGrounded && !keys[38] && !keys[104]) newy = newy * .9;
            this.body.SetLinearVelocity(new box2d.b2Vec2(newx,newy));
            
            // CONTROLS
            if (controlFocus === this) {
                
                if (keys[38] | keys[104]){
                    if (this.isGrounded > 0){
                        this.body.ApplyImpulse(new box2d.b2Vec2(0,-jumpingSpeed), this.body.GetWorldCenter());
                         //this.isGrounded = 0;
                     };
                }
                if (keys[37] | keys[100]){
                    //if (this.isGrounded > 0) {
                        this.body.ApplyForce(new box2d.b2Vec2(-movementSpeed,0), this.body.GetWorldCenter());
                    //}
                }

                
                if (keys[39] | keys[102]){
                    //if(this.isGrounded > 0){
                        this.body.ApplyForce(new box2d.b2Vec2(movementSpeed,0), this.body.GetWorldCenter());
                    //}
                } 
                if (this.isGrounded & !keys[100] & !keys[37] & !keys[102] & !keys[39]){
                    var oldvec = this.body.GetLinearVelocity();
                    this.body.SetLinearVelocity(new box2d.b2Vec2(newx*.9,oldvec.y));
                }

                if (this.isGrounded > 0 & (keys[38] | keys[104]) & this.jumpPhase === 0){
                    this.gravityAdjust = 0;
                    new createjs.Tween.get(this).to({gravityAdjust:10}, 1000, createjs.Ease.linear);
                    this.jumpPhase = 1;
                }
                if (this.jumpPhase === 1){
                    this.body.ApplyForce(new box2d.b2Vec2(0,this.gravityAdjust), this.body.GetWorldCenter());
                }
                if (this.isGrounded > 0 & this.gravityAdjust >= 10){
                    //this.gravityAdjust = 0;
                    this.jumpPhase = 0;
                }
            }
            //console.log(this.gravityAdjust, this.isGrounded, this.jumpPhase);
            
            
            // Update the image position by the box2d physics body position
            this.x = this.bodyX();
            this.y = this.bodyY();
        }
        //this.body.SetAngle( 0. );
	}
    
    

}());