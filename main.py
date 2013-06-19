#!/usr/bin/env python


import logging
import webapp2
from template_manager import render_template

CLIENT_ID = "907844683646-eto8g1ervbr3fc84a67csbmpg5oe9e37.apps.googleusercontent.com"

game_scripts = [
#    "http://code.createjs.com/easeljs-0.6.1.min.js",
    "packages/easeljs-0.6.1.min.js",
#    "http://code.createjs.com/preloadjs-0.3.1.min.js",
    "packages/preloadjs-0.3.1.min.js",
    "packages/Box2dWeb-2.1.a.3.min.js",
    "flight_test/namespaces.js",
    "flight_test/Ship.js",
    "flight_test/Soldier.js",
    "flight_test/Exhaust.js",
    "flight_test/Earth.js",
    "maps/testmap.js",
    "flight_test/Tile.js",
    "flight_test/flight_test.js"
]
game_canvas = [
    "canvas",
    "debug"
]

class MainHandler(webapp2.RequestHandler):
    def get(self):
        self.response.out.write(render_template("base.html", hello="Wow", client_ID=CLIENT_ID))

        self.redirect('/gamemain')

#class GLogin(webapp2.RequestHandler):
#    def get(self, user_name = ''):
#        self.response.out.write(render_template("base.html", hello="Welcome " + user_name, client_ID=CLIENT_ID))
#
#    def post(self):
#        user_name = self.request.get('displayName')
#        user_url = self.request.get('url')
#        user_id = self.request.get('id')
#        user_lang = self.request.get('language')
#        logging.error(user_name + ' : ' + user_lang + ' - ' + user_id)
#        self.get(user_name)
#
#        # LOG IN THE USER
#
#        # REDIRECT TO MAIN PAGE
#        self.redirect('/')

class GameHandler(webapp2.RequestHandler):
    def get(self):
        self.response.out.write(render_template("base.html", scripts=game_scripts, canvas=game_canvas))


app = webapp2.WSGIApplication([
    ('/', MainHandler),
#    ('/g_login', GLogin)
    ('/gamemain', GameHandler)
], debug=True)
