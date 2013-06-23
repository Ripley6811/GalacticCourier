function addBox2DListeners() {

    var listener = new box2d.b2ContactListener();
    
    
    listener.PreSolve = function(contact, manifold){
        var fixtures = [];
        fixtures.push( contact.GetFixtureA().GetUserData() );
        fixtures.push( contact.GetFixtureB().GetUserData() );
        
        if (fixtures[0] == "SBody" || fixtures[1] == "SBody"){
            //console.log( "SBody:", manifold.m_points[0].m_normalImpulse );
        }
    }
    listener.BeginContact = function(contact){
        var fixtures = [];
        fixtures.push( contact.GetFixtureA().GetUserData() );
        fixtures.push( contact.GetFixtureB().GetUserData() );
        
        //console.log("BEGIN: " + fixtures);
        if (fixtures[0] == "Foot" || fixtures[1] == "Foot") {
            if (fixtures[0] == "Tile" || fixtures[1] == "Tile"){
                soldier.isGrounded++;
                //console.log("<grounded> " + soldier.isGrounded);
            }
        }
        if (fixtures[0] == "Foot" || fixtures[1] == "Foot") {
            if (fixtures[0] == "Ship" || fixtures[1] == "Ship"){
                soldier.canEmbark++;
            }
        }
        
    }
    listener.EndContact = function(contact){
        var fixtures = [];
        fixtures.push( contact.GetFixtureA().GetUserData() );
        fixtures.push( contact.GetFixtureB().GetUserData() );
        
        //console.log("END: " + fixtures);
        if (fixtures[0] == "Foot" || fixtures[1] == "Foot") {
            if (fixtures[0] == "Tile" || fixtures[1] == "Tile"){
                soldier.isGrounded--;
            }
        }
        if (fixtures[0] == "Foot" || fixtures[1] == "Foot") {
            if (fixtures[0] == "Ship" || fixtures[1] == "Ship"){
                soldier.canEmbark--;
            }
        }
        
    }

   /* listener.EndContact = function(contact) {
        console.log(contact.GetFixtureA().GetBody().GetUserData());
    }*/

    world.SetContactListener(listener);



};