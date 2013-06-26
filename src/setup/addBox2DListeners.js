function addBox2DListeners() {

    var listener = new box2d.b2ContactListener();
    
    
    listener.PreSolve = function(contact, manifold){
    }
    listener.PostSolve = function(contact, manifold){
    }
    listener.BeginContact = function(contact){
        var fixtures = [
            contact.GetFixtureA().GetUserData(),
            contact.GetFixtureB().GetUserData()
        ];
        if (fixtures[1] == "Foot"){
            fixtures.reverse();
        }
        
        //console.log("BEGIN: " + fixtures);
        if (fixtures[0] == "Foot" && fixtures[1] == "Tile"){
                soldier.isGrounded++;
        }
        if (fixtures[0] == "Foot" && fixtures[1] == "Ship") soldier.canEmbark = "Ship";
        if (fixtures[0] == "Foot" && fixtures[1] == "Rover") soldier.canEmbark = "Rover";
        
        
    }
    listener.EndContact = function(contact){
        var fixtures = [
            contact.GetFixtureA().GetUserData(),
            contact.GetFixtureB().GetUserData()
        ];
        if (fixtures[1] == "Foot"){
            fixtures.reverse();
        }
        
        //console.log("END: " + fixtures);
        if (fixtures[0] == "Foot" && fixtures[1] == "Tile"){
                soldier.isGrounded--;
        }
        if (fixtures[0] == "Foot" && fixtures[1] == "Ship") soldier.canEmbark = null;
        if (fixtures[0] == "Foot" && fixtures[1] == "Rover") soldier.canEmbark = null;
        
    }

    world.SetContactListener(listener);



};