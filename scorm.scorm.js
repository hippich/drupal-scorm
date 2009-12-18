// $Id$

/**
 * SCORM 2004 Run-Time Environment (RTE)
 *
 * @author
 * Stefan Auditor <stefan.auditor@erdfisch.de>
 */

// Global killswitch
if (Drupal.jsEnabled) {
  $(document).ready(function () {
    // Initialize support methods
    
    // Load error strings into session
    API_1484_11.LoadErrorStrings();

    // Load data model and session data into session
    API_1484_11.LoadDataModel();
    
    // Handle unexpected unload
    // see 3.3.2.1 Unexpected events
    $(window).unload(function () {
      if (API_1484_11.state === API_1484_11.API_STATE_1) {
        // The next line should be handled by cmi.js
        API_1484_11.SetValue('cmi.exit', 'time-out');
        //Terminate session
        API_1484_11.Terminate('');
      }
    });
  });
}
