#!/usr/bin/env python

import os
import logging
import webapp2
from template_manager import render_template

CLIENT_ID = "907844683646-eto8g1ervbr3fc84a67csbmpg5oe9e37.apps.googleusercontent.com"

# Load javascript files from these folders in this order. Ends with main program
game_folders = [
    "thirdparty",
    "setup",
    "maps",
    "classes",
    "main"
]
game_files = [
    "thirdparty/Box2dWeb-2.1.a.3.min.js",
    "thirdparty/easeljs-0.6.1.min.js",
    "thirdparty/preloadjs-0.3.1.min.js",
    "thirdparty/tweenjs-0.4.1.min.js",
    "setup/addBox2DListeners.js",
    "setup/addDocumentListeners.js",
    "setup/loadGame.js",
    "setup/namespaces.js",
    "maps/testmap.js",
    "classes/Pointer.js",
    "classes/Ship.js",
    "classes/Soldier.js",
    "classes/Station.js",
    "classes/Rover.js",
    "classes/Exhaust.js",
    "classes/Tile.js",
    "main/flight_test.js"
]
game_canvas = [
    "canvas"
#    ,"debug"
]

class MainHandler(webapp2.RequestHandler):
    def get(self):
        self.response.out.write(os.path.join(os.path.dirname(__file__), "main.py"))
#        game_path = os.path.join(os.path.dirname(__file__), "src")
#        self.response.out.write(os.listdir(os.path.dirname(__file__)))
#        self.redirect('/gamemain')

class Testing(webapp2.RequestHandler):
    def get(self):
        self.response.out.write("main.py is working")
        self.response.out.write(os.listdir(os.path.dirname(__file__)))
        self.response.out.write("\n"+os.path.dirname(__file__)+"/classes")
#        self.response.out.write(os.listdir(os.path.dirname(__file__)+"/classes"))


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
#==============================================================================
#          game_scripts = []
#          game_path = os.path.join(os.path.dirname(__file__), "src")
# #         game_path = os.path.dirname(__file__)
#          for folder in game_folders:
#              joined_path = os.path.join(game_path, folder)
#              files = os.listdir(joined_path)
#              for f in files:
#                  if f.endswith("js"):
#                      game_scripts.append(os.path.join( folder, f ))
#==============================================================================
         self.response.out.write(render_template("base.html", scripts=game_files, canvas=game_canvas))


app = webapp2.WSGIApplication([
    ('/', MainHandler),
#    ('/g_login', GLogin)
    ('/gamemain', GameHandler),
    ('/test', Testing)
], debug=True)
