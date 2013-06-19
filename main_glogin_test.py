#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import logging
import webapp2
from template_manager import render_template

CLIENT_ID = "907844683646-eto8g1ervbr3fc84a67csbmpg5oe9e37.apps.googleusercontent.com"

class MainHandler(webapp2.RequestHandler):
    def get(self):
        self.response.out.write(render_template("base.html", hello="Wow", client_ID=CLIENT_ID))

class GLogin(webapp2.RequestHandler):
    def get(self, user_name = ''):
        self.response.out.write(render_template("base.html", hello="Welcome " + user_name, client_ID=CLIENT_ID))

    def post(self):
        user_name = self.request.get('displayName')
        user_url = self.request.get('url')
        user_id = self.request.get('id')
        user_lang = self.request.get('language')
        logging.error(user_name + ' : ' + user_lang + ' - ' + user_id)
        self.get(user_name)

        # LOG IN THE USER

        # REDIRECT TO MAIN PAGE
        self.redirect('/')



app = webapp2.WSGIApplication([
    ('/', MainHandler),
    ('/g_login', GLogin)
], debug=True)
