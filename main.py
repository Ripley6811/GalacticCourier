#!/usr/bin/env python

import os
import logging
import webapp2
from template_manager import render_template

CLIENT_ID = "907844683646-eto8g1ervbr3fc84a67csbmpg5oe9e37.apps.googleusercontent.com"

# Load javascript files from these folders in this order. Ends with main program
game_folders = [
    "thirdpartylibraries",
    "setup",
    "maps",
    "classes",
    "main",
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
        game_scripts = []
        game_path = os.path.join(os.path.dirname(__file__), "src")
        for folder in game_folders:
            for f in os.listdir(os.path.join(game_path, folder)):
                if f.endswith("js"):
                    game_scripts.append(os.path.join( folder, f ))
        self.response.out.write(render_template("base.html", scripts=game_scripts, canvas=game_canvas))


app = webapp2.WSGIApplication([
    ('/', MainHandler),
#    ('/g_login', GLogin)
    ('/gamemain', GameHandler)
], debug=True)
