import os
import jinja2

# LOCATION OF TEMPLATE PAGES
template_dir = os.path.join(os.path.dirname(__file__), 'templates')
jinja_env = jinja2.Environment(
                    loader = jinja2.FileSystemLoader(template_dir),
                    autoescape = True)

def render_template(template, **params):
    return jinja_env.get_template(template).render(params)