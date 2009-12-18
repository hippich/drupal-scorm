// $Id$

/**
 * SCORM 2004 generic SCORM session tracking
 *
 * @author
 * Stefan Auditor <stefan.auditor@erdfisch.de>
 */

// Global killswitch
if (Drupal.jsEnabled) {
  $(document).ready(function() {
    // Start timer
    var start = new Date();
    
    // Initialize session
    API_1484_11.Initialize('');

    $(window).unload(function () {
      // Stop timer
      var stop = new Date();
      var seconds = Math.floor((stop.getTime()-start.getTime())/10)/100;

      // Set session time
      API_1484_11.SetValue('cmi.session_time', 'PT' + seconds + 'S');
      // Set exit
      API_1484_11.SetValue('cmi.exit', 'normal');
      // Set success status
      API_1484_11.SetValue('cmi.success_status', 'passed');
      
      //Terminate session
      API_1484_11.Terminate('');
    });
  });
}