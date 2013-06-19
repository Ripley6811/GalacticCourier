(function (window) {

    function Earth(){
        buildWorld();
    };

    function buildWorld(){
        // CREATE GROUND
        var fixDef = new box2d.b2FixtureDef();
        fixDef.density = 1.0;
        fixDef.friction = 0.5;
        fixDef.restitution = 0.2;
        fixDef.shape = new box2d.b2PolygonShape;
        fixDef.shape.SetAsBox((canvas.width / SCALE) / 2, (10/SCALE) / 2);
        fixDef.filter.categoryBits = 0x0001;
        
        var bodyDef = new box2d.b2BodyDef();
        bodyDef.type = box2d.b2Body.b2_staticBody;
        bodyDef.angle = 0;
        bodyDef.position.x = canvas.width / 2 / SCALE;
        bodyDef.position.y = canvas.height / SCALE;
        
        world.CreateBody( bodyDef ).CreateFixture(fixDef);
        //---
        var fixDef = new box2d.b2FixtureDef();
        fixDef.density = 1.0;
        fixDef.friction = 0.5;
        fixDef.restitution = 0.2;
        fixDef.shape = new box2d.b2PolygonShape;
        fixDef.shape.SetAsBox((10 / SCALE) / 2, (1000/SCALE) / 2);
        fixDef.filter.categoryBits = 0x0001;
        
        var bodyDef = new box2d.b2BodyDef();
        bodyDef.type = box2d.b2Body.b2_staticBody;
        bodyDef.angle = 0;
        bodyDef.position.x = 0 / 2 / SCALE;
        bodyDef.position.y = canvas.height / 2 / SCALE;
        
        world.CreateBody( bodyDef ).CreateFixture(fixDef);
        //---
        var fixDef = new box2d.b2FixtureDef();
        fixDef.density = 1.0;
        fixDef.friction = 0.5;
        fixDef.restitution = 0.2;
        fixDef.shape = new box2d.b2PolygonShape;
        fixDef.shape.SetAsBox((10 / SCALE) / 2, (1000/SCALE) / 2);
        fixDef.filter.categoryBits = 0x0001;
        
        var bodyDef = new box2d.b2BodyDef();
        bodyDef.type = box2d.b2Body.b2_staticBody;
        bodyDef.angle = 0;
        bodyDef.position.x = canvas.width / SCALE;
        bodyDef.position.y = canvas.height / 2 / SCALE;
        
        world.CreateBody( bodyDef ).CreateFixture(fixDef);
    };
  
  
     // Instantiate object from root scope
	window.Earth = Earth;

}(window));