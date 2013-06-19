(function (window) {

	function Exhaust(posx,posy,speed,vangle,width, ageMax) {
        var radius = 8;
        this.view = new createjs.Shape();
        //this.view.shadow = new createjs.Shadow("#ccc", 3, 3, 50);
        
        
        var angle = ship.body.GetAngle();
        
        var fixDef = new box2d.b2FixtureDef();
        fixDef.density = 0.01;
        fixDef.friction = 0.7;
        fixDef.restitution = 0.1;
        fixDef.filter.categoryBits = 0x0004;
        fixDef.filter.maskBits = 0x0005; // Collides with ground and other exhause
        
        var bodyDef = new box2d.b2BodyDef();
        bodyDef.type = box2d.b2Body.b2_dynamicBody;
        bodyDef.gravityScale = 0.1;
        r = (posx + (Math.random()*width - width/2)) / SCALE;
        bodyDef.position.x = ship.body.GetPosition().x + Math.sin(-angle)*posy/SCALE + Math.cos(angle)*r;
        bodyDef.position.y = ship.body.GetPosition().y + Math.cos(-angle)*posy/SCALE + Math.sin(angle)*r;
        fixDef.shape = new box2d.b2CircleShape(3 / SCALE);
        this.view.body = world.CreateBody(bodyDef);
        this.view.body.CreateFixture(fixDef);
        v = Math.random() / 2 + .5;
        this.view.body.SetLinearVelocity( new box2d.b2Vec2(
                                Math.cos(vangle+Math.PI/2) * speed * v,
                                Math.sin(vangle+Math.PI/2) * speed * v
                                        ));
        this.view.alpha = 0.8;
        
        this.view.age = 0;
        if (ageMax) {
            this.view.ageMax = ageMax;
        } else { this.view.ageMax = 30; }
        this.view.decrement = function() { this.age--; };
        //this.view.getAge = function() { return this.view.age; };
        
        
        stage.addChild( this.view );
        this.view.onTick = tick;
        
	}
    
    var image = [];
    for (var i = 0; i < 50; i++){
            console.log('adding');
            var im = new createjs.Shape().graphics.beginBitmapStroke(new Image()).beginFill("#800").drawCircle(0,0,4+i);
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

    window.Exhaust = Exhaust;
}(window));