
/**
 * SCORM 2004 Discovery Algorithm
 *
 * @author
 * Stefan Auditor <stefan.auditor@erdfisch.de>
 *
 * see http://www.scorm.com/resources/apifinder/SCORMAPIFinder.htm
 * see http://www.ostyn.com/standards/scorm/samples/api_discovery_ff_issue.htm
 */

/**
 * Initializing the discovery object
 */
API_1484_11_Discovery = {};

var API_MAX_STEPS = 500;

/**
 * Scan parent windows for API instance
 */
API_1484_11_Discovery.ScanParentsForApi = function(win) {
  var nParentsSearched = 0;

  while ((win.API_1484_11 === null) && (win.parent !== null) && (win.parent != win) && (nParentsSearched <= API_MAX_STEPS)) {
    nParentsSearched++;
    win = win.parent;
  }

  return win.API_1484_11;
};

/**
 * Get API instance
 */
API_1484_11_Discovery.GetApi = function() {
  var API = null;

  //Search all the parents of the current window if there are any
  if ((window.parent !== null) && (window.parent != window)) {
    API = this.ScanParentsForApi(window.parent);
  }

  /**
   * If we didn't find the API in this window's chain of parents, then search 
   * all the parents of the opener window if there is one
   */
  if ((API === null) && (window.top.opener !== null)) {
    API = this.ScanParentsForApi(window.top.opener);
  }
    
  return API;
};

var API_1484_11 = null;
API_1484_11 = API_1484_11_Discovery.GetApi(); 

if (API_1484_11 === null) {
  $('.node').eq(0).prepend('<div class="messages error">'+Drupal.t('Could not find SCORM API, SCORM functionality not available.')+'</div>');
}
