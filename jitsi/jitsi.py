"""TO-DO: Write a description of what this XBlock is."""

import pkg_resources

from django.utils import translation
from xblock.core import List, Scope, String, XBlock
from xblock.fields import Scope, Integer
from xblock.fragment import Fragment
from xblockutils.resources import ResourceLoader


class JitsiXBlock(XBlock):
    """
    TO-DO: document what your XBlock does.
    """

    # Fields are defined on the class.  You can access them in your code as
    # self.<fieldname>.

    # TO-DO: delete count, and define your own fields.
    # count = Integer(
    #     default=0, scope=Scope.user_state,
    #     help="A simple counter, to show something happening",
    # )

    display_name = String(
        display_name = "Jitsi Web Conferencing",
        default = "Web Conferencing",
        scode=Scope.settings
    )

    def resource_string(self, path):
        """Handy helper for getting resources from our kit."""
        data = pkg_resources.resource_string(__name__, path)
        return data.decode("utf8")

    # TO-DO: change this view to display your data your own way.
    def student_view(self, context=None):
        """
        The primary view of the JitsiX, shown to students
        when viewing courses.
        """
        html = self.resource_string("static/html/jitsi.html")
        frag = Fragment(html.format(self=self))
        frag.add_css(self.resource_string("static/css/jitsi.css"))

        # Add hmac-sha26 js
        frag.add_javascript(self.resource_string("static/js/hmac-sha256.js"))

        # Add enc-base64 js
        frag.add_javascript(self.resource_string("static/js/enc-base64-min.js"))

        # Add Jitsi External API
        frag.add_javascript(self.resource_string("static/js/external_api.js"))

        # statici18n_js_url = self._get_statici18n_js_url()
        # if statici18n_js_url:
        #     frag.add_javascript_url(self.runtime.local_resource_url(self, statici18n_js_url))

        # Add the actual script
        frag.add_javascript(self.resource_string("static/js/src/script.js"))

        # Fire the initializer here
        frag.add_javascript(self.resource_string("static/js/src/jitsi.js"))

        frag.initialize_js('JitsiXBlock')
        return frag

    # TO-DO: change this handler to perform your own actions.  You may need more
    # than one handler, or you may not need any handlers at all.
    # @XBlock.json_handler
    # def increment_count(self, data, suffix=''):
    #     """
    #     An example handler, which increments the data.
    #     """
    #     # Just to show data coming in...
    #     assert data['hello'] == 'world'

    #     self.count += 1
    #     return {"count": self.count}

    # TO-DO: change this to create the scenarios you'd like to see in the
    # workbench while developing your XBlock.
    @staticmethod
    def workbench_scenarios():
        """A canned scenario for display in the workbench."""
        return [
            ("JitsiXBlock",
             """<jitsi/>
             """),
        ]

    # @staticmethod
    # def _get_statici18n_js_url():
    #     """
    #     Returns the Javascript translation file for the currently selected language, if any.
    #     Defaults to English if available.
    #     """
    #     locale_code = translation.get_language()
    #     if locale_code is None:
    #         return None
    #     text_js = 'public/js/translations/{locale_code}/text.js'
    #     lang_code = locale_code.split('-')[0]
    #     for code in (locale_code, lang_code, 'en'):
    #         loader = ResourceLoader(__name__)
    #         if pkg_resources.resource_exists(
    #                 loader.module_name, text_js.format(locale_code=code)):
    #             return text_js.format(locale_code=code)
    #     return None

    # @staticmethod
    # def get_dummy():
    #     """
    #     Dummy method to generate initial i18n
    #     """
    #     return translation.gettext_noop('Dummy')
