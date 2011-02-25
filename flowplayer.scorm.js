
/**
 * SCORM 2004 Flowplayer integration
 *
 * @author
 * Stefan Auditor <stefan.auditor@erdfisch.de>
 */

// Global killswitch
if (Drupal.jsEnabled) {
  $(document).ready(function() {

    $(function() {
      $('.flowplayer').each(function() {
        // Get Flowplayer
        var player = flowplayer(this.id);
        var start = null;
        var stop = null;
        
        // Extend Flowplayer with SCORM events
        player.onStart(function() {
          // Start timer
          start = new Date();
          API_1484_11.Initialize('');
        });
        player.onFinish(function() {
          var clip = this.getClip();
          stop = new Date();
          var elapsed = ((stop.getTime()-start.getTime())/1000);

          // Assume success if elapsed time is 90% of clip duration
          // TODO: make this configurable
          var success = (((elapsed/clip.metaData.duration)*100) >= 90) ? 'passed' : 'failed';
          API_1484_11.SetValue('cmi.success_status', success);
          API_1484_11.SetValue('cmi.session_time', 'PT' + elapsed.toFixed(2) + 'S');
          API_1484_11.Terminate('');
        });
      });
    });

  });
}