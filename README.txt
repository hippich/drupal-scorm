
README.txt
----------

This is a placeholder form a Scorm [1] integration to Drupal, that we plan to implement soon.
If you are interested in joining forces, please don't hesitate to contact [2] me.

[1] http://en.wikipedia.org/wiki/SCORM
[2] http://drupal.org/user/28074/contact

General installation instructions
---------------------------------
1. On admin/build/modules activate all modules from Package LMS
2. Create a SCO node type and make sure to check the box "Treat this content 
   type as SCORM object" in the form used to create the node type.
   You can name the type anything you want as long as you check the box 
   already mentioned.

For testing purposes
--------------------
4. Activate the php filter module under core/optional modules.
5. Create a node of type "sco" and paste any of the test code options in the 
   INSTALL.txt in the docs folder.
6. View the node.

Known issues
------------
   This project is not ready for production use.
   It is a work in progress and not complete, yet.
   
   There is a list of issues in the issue queue [3].
   If you want to join the development don't hesitate - but be aware, SCORM is 
   a rather complex system and I don't have much time for support questions.
   
   [3] http://drupal.org/project/issues/scorm