// NAMESPACE and CONSTANTS
var box2d = {
    b2Vec2 : Box2D.Common.Math.b2Vec2,
    b2AABB : Box2D.Collision.b2AABB,
    b2BodyDef : Box2D.Dynamics.b2BodyDef,
    b2Body : Box2D.Dynamics.b2Body,
    b2FixtureDef : Box2D.Dynamics.b2FixtureDef,
    b2Fixture : Box2D.Dynamics.b2Fixture,
    b2World : Box2D.Dynamics.b2World,
    b2PolygonShape : Box2D.Collision.Shapes.b2PolygonShape,
    b2CircleShape : Box2D.Collision.Shapes.b2CircleShape,
    b2DebugDraw : Box2D.Dynamics.b2DebugDraw,
    b2ContactListener : Box2D.Dynamics.b2ContactListener
};

// KEY NAMES AND VALUES
var K = {
    ONE : 97,
    TWO : 98,
    THREE : 99,
    FOUR : 100,
    FIVE : 101,
    SIX : 102,
    SEVEN : 103,
    EIGHT : 104,
    NINE : 105,
    PLUS : 107,
    MINUS : 109,
    LEFT : 37,
    UP : 38,
    RIGHT : 39,
    DOWN : 40
    
}

// BOX2D FIXTURE CATEGORY NAMES
var CAT = {
    GROUND :    0x0001,
    SOLDIER :   0x0010,
    SHIP :      0x0100,
    SOLDIER_FOOT_SENSOR :   0x1000,
    EXHAUST :   0x0004,
    BACKGROUND : 0x0040,
    STATION :   0x0400,
    ROVER :     0x4000
}