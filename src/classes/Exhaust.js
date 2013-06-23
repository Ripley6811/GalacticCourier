(function () {

	window.Exhaust = function(posx,posy,speed,vangle,width, ageMax) {
        this.view = new createjs.Shape();
        this.view.set({
            alpha : 0.8,
            age : 0,
            ageMax : 30,
            onTick : tick
        });
        if (ageMax) this.view.ageMax = ageMax;
        
        var angle = ship.body.GetAngle();
        
        var bodyDef = new box2d.b2BodyDef();
        bodyDef.type = box2d.b2Body.b2_dynamicBody;
        bodyDef.gravityScale = 0.1;
        r = (posx + (Math.random()*width - width/2)) / SCALE;
        bodyDef.position.x = ship.body.GetPosition().x 
                                + Math.sin(-angle)*posy/SCALE + Math.cos(angle)*r;
        bodyDef.position.y = ship.body.GetPosition().y 
                                + Math.cos(-angle)*posy/SCALE + Math.sin(angle)*r;
        this.view.body = world.CreateBody(bodyDef);
        
        
        var fixDef = new box2d.b2FixtureDef();
        fixDef.density = 0.01;
        fixDef.friction = 0.7;
        fixDef.restitution = 0.1;
        fixDef.filter.categoryBits = 0x0004;
        fixDef.filter.maskBits = 0x0005; // Collides with ground and other exhause
        fixDef.shape = new box2d.b2CircleShape(3 / SCALE);
        this.view.body.CreateFixture(fixDef);
        v = Math.random() / 2 + .5;
        this.view.body.SetLinearVelocity( new box2d.b2Vec2(
                   Math.cos(vangle+Math.PI/2) * speed * v,
                   Math.sin(vangle+Math.PI/2) * speed * v
        ));
        
        
        stage.addChild( this.view );
	}
    
    var image = [];
    for (var i = 0; i < 50; i++){
            console.log('adding');
            // Firefox had a problem with ".beginBitmapStroke(new Image())" between graphics and beginFill
            var im = new createjs.Shape().graphics.beginFill("#800").drawCircle(0,0,4+i);
            image.push(im);
    };

    
    function tick(event) {
        this.age++;        
        
        this.graphics = image[ this.age ];
        this.alpha = this.alpha * .9;
        
        if (this.age >= this.ageMax) {
            particlesToRemove.push( this );
        };
        
        // Update the image position by the box2d physics body position
        this.x = this.body.GetPosition().x * SCALE;
        this.y = this.body.GetPosition().y * SCALE;
        //this.rotation = this.body.GetAngle() * (180/Math.PI);
    } // tick()

}());