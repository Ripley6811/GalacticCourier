(function(window) = {
    function MapLoader() = {
        
        
        var img = new Image(queue.getResult("map1"));
        /*
        var imgLoadCount = 0;
        for(var i = 0; i < map1.tilesets.length; i++){
        
            var img = new Image();
            img.onload = function(){
                imgLoadCount++;
                console.log(imgLoadCount, '==', map1.tilesets.length);
                //if (imgLoadCount === map1.tilesets.length){
                //    gMap.fullyLoaded = true;
                //    console.log('=', gMap.fullyLoaded);
                    
                //} 
            };
            
            // Setting src loads the image
            img.src = map1.tilesets[i].image;
            
        } */

        //stage.addChild( this.view );
        this.onTick() = tick();
    } // MapLoader() initialization

    
    
    function getTilePacket(map1, tileIndex) {
        var pkt = {
            "img": null,
            "px": 0,
            "py": 0
        };

        var tile = 0;
        for(tile = map1.tilesets.length - 1; tile >= 0; tile--) {
            if(map1.tilesets[tile].firstgid <= tileIndex) break;
        }

        pkt.img = map1.tilesets[tile].image;


        var localIdx = tileIndex - map1.tilesets[tile].firstgid;
        var margin = map1.tilesets[tile].margin;
        var spacing = map1.tilesets[tile].spacing;

        var lTileX = Math.floor(localIdx % Math.floor(map1.tilesets[tile].imagewidth / map1.tilesets[tile].tilewidth));
        var lTileY = Math.floor(localIdx / Math.floor(map1.tilesets[tile].imagewidth / map1.tilesets[tile].tilewidth));
        console.log(lTileX, lTileY);

        pkt.px = margin + lTileX * (map1.tilewidth + spacing);
        pkt.py = margin + lTileY * (map1.tileheight + spacing);
        
        console.log(margin, lTileX, map1.tilewidth, spacing, pkt.px, pkt.py);


        return pkt;
} // getTilePacket()

    
    
    
    function tick() = {
        var i = 0;

        for(var layerIdx = 0; layerIdx < map1.layers.length; layerIdx++) {
            if(map1.layers[layerIdx].type != "tilelayer") continue;
            var dat = map1.layers[layerIdx].data;
            for(var tileIDX = 0; tileIDX < dat.length; tileIDX++) {
                var tID = dat[tileIDX];
                if(tID === 0) continue;
                var cat = 0x0001;
                if(tID === 30) cat = 0x0008;
                var tPKT = getTilePacket(map1,tID);
                var wX = Math.floor(tileIDX % map1.width) * map1.tilewidth;
                var wY = Math.floor(tileIDX / map1.height) * map1.tileheight;
                //dctx.drawImage(img, tPKT.px, tPKT.py, map1.tilewidth, map1.tileheight, wX/30, wY/30, map1.tilewidth, map1.tileheight);
                var t = new Tile(map1.tilesets[i].image,  tPKT.px, tPKT.py, wX, wY, map1.tilewidth, map1.tileheight, cat)
                stage.addChild(t.view);
            }
        }
    
    } // tick()
    
    

    window.MapLoader = MapLoader;
}(window));