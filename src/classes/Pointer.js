(function () {
    /*
    Assign a constructor function to a variable in the window scope
    */
	this.Pointer = function() {
        // Createjs Shape
        var view = new createjs.Shape();
        view.graphics.mt(0,-100).s("#D00").f("#D00").lt(-10,-95).lt(10,-95).lt(0,-100);
        view.set({
            // Set the "center" of this object
            regX : 0,
            regY : 0,
            // Set the CreateJS update method
            onTick : tick
        });
        
        return view;
	}
    
    /*
    This is the CreateJS update function for this object
    */
	function tick(event) {
        this.x = event.bodyX();
        this.y = event.bodyY();
        var xDiff = station.bodyX() - event.bodyX();
        var yDiff = station.bodyY() - event.bodyY();
        this.rotation = Math.atan( yDiff / xDiff ) * 180/Math.PI - 90;
        if (xDiff > 0) this.rotation += 180;
	}


}());