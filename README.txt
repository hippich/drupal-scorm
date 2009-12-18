// $Id$

README.txt
----------

This is a placeholder form a Scorm [1] integration to Drupal, that we plan to implement soon.
If you are interested in joining forces, please don't hesitate to contact [2] me.

[1] http://en.wikipedia.org/wiki/SCORM
[2] http://drupal.org/user/28074/contact

Ray James's version of install
1. Install cmi and cmi_ui first.
2. Install all othe LMS modules.
3. Create sco node type and make sure to check the box "Treat this content type as SCORM object" in the form used to create the node type.  You can name the type anything you want as long as you check the box already mentioned.
4. Activate the php filter module under core/optional modules.
5. Create a node of type "sco" and paste any of the test code options in the INSTALL.txt in the docs folder.
6. View the node.

Ray James notes.
It took me a day and a half to get the D5 code ported to D6.  However, I am not cleat yet on how the code works completely and how to get the sco unpacked.  Also, I don't mind putting in any extra work on this module, but could use a mentor for when I get stuck.  Thanks and enjoy.

Ray James
drupal handle: rayjames
rayjames@cdlcollege.com (preferred)
gizmo5 #: rayjames (preferred)
google talk: cdlcollege.rayjames
skype: cdl.ray.james