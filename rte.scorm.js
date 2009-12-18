// $Id$

/**
 * SCORM 2004 Run-Time Environment (RTE)
 *
 * @author
 * Stefan Auditor <stefan.auditor@erdfisch.de>
 */

/**
 * Initializing the API object
 */
API_1484_11 = {};

/**
 * Debug mode
 */
API_1484_11.debug = true;

/**
 * Defining the API version
 */
API_1484_11.version = '1.0';

/**
 * Default error state
 */
API_1484_11.error = 0; // No error

/**
 * Conceptual communication states
 */
API_1484_11.API_STATE_0 = 'Not Initialized';
API_1484_11.API_STATE_1 = 'Running';
API_1484_11.API_STATE_2 = 'Terminated';

/**
 * Set default conceptual communication state
 */
API_1484_11.state = API_1484_11.API_STATE_0;

/**
 * Error codes
 */
API_1484_11.error_strings = [];

/**
 * Session data
 */
API_1484_11.session = [];

/**
 * The function is used to initiate the communication session. It allows the LMS
 * to handle LMS specific initialization issues.
 *
 * @param parameter
 *   ("") - empty characterstring. An empty characterstring shall be passed as a
 *   parameter.
 * @return
 *   Return Value: The function can return one of two values. The return value 
 *   shall be represented as a characterstring. The quotes ("") are not part of 
 *   the characterstring returned, they are used purely to delineate the values 
 *   returned.
 *     -  "true" - The characterstring "true" shall be returned if communication
 *        session initialization, as determined by the LMS, was successful.
 *     -  "false" - The characterstring "false" shall be returned if 
 *        communication session initialization, as determined by the LMS, was 
 *        unsuccessful. The API Instance shall set the error code to a value 
 *        specific to the error encountered. The SCO may call GetLastError() to 
 *        determine the type of error. More detailed information pertaining to 
 *        the error may be provided by the LMS through the GetDiagnostic() 
 *        function.
 */
API_1484_11.Initialize = function (parameter) {
  this.Watchdog(Drupal.t('RTE: Initialize'));//DEBUG

  if (this.state === this.API_STATE_1) {
    // Already initialized
    this.SetError(103);
    return false;
  }

  // Inform LMS of initialization
  $.ajax({
    url: API_1484_11.basepath + '?q=node/' + API_1484_11.nid + '/scorm/initialize',
    data: 'parameter=' + parameter,
    dataType: 'json',
    success: function (data, textStatus) {
      API_1484_11.Watchdog(Drupal.t('RTE: Initialize return: ') + textStatus + ' (' + data + ')');//DEBUG

      // Set error in case LMS side fails to initialize
      if (data === false) {
        // General Initialization Failure
        API_1484_11.SetError(102);
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      API_1484_11.Watchdog(Drupal.t('RTE: Initialize error:') + textStatus + ':' + errorThrown);//DEBUG

      // General communication failure (Ajax)
      API_1484_11.SetError(1000);
    }
  });
  
  // Set Conceptual communication state to running
  this.SetState(this.API_STATE_1);
  // No error
  this.SetError(0); //XXX
  
  return true;
};

/**
 * The function is used to terminate the communication session. It is used by 
 * the SCO when the SCO has determined that it no longer needs to communicate 
 * with the LMS. The Terminate() function also shall cause the persistence of 
 * any data (i.e., an implicit Commit("") call) set by the SCO since the last 
 * successful call to Initialize("") or Commit(""), whichever occurred most 
 * recently. This guarantees to the SCO that all data set by the SCO has been 
 * persisted by the LMS. Once the communication session has been successfully 
 * terminated, the SCO is only permitted to call the Support Methods.
 *
 * @param parameter
 *   ("") - empty characterstring. An empty characterstring shall be passed as a
 *   parameter.
 * @return
 *   Return Value: The method can return one of two values. The return value 
 *   shall be represented as a characterstring. The quotes ("") are not part of 
 *   the characterstring returned, they are used purely to delineate the values 
 *   returned.
 *     -  "true" - The characterstring "true" shall be returned if termination 
 *        of the communication session, as determined by the LMS, was successful
 *     -  "false" - The characterstring "false" shall be returned if termination
 *        of the communication session, as determined by the LMS, was 
 *        unsuccessful. The API Instance shall set the error code to a value 
 *        specific to the error encountered. The SCO may call GetLastError() to 
 *        determine the type of error. More detailed information pertaining to 
 *        the error may be provided by the LMS through the GetDiagnostic() 
 *        function.
 */
API_1484_11.Terminate = function (parameter) {
  this.Watchdog(Drupal.t('RTE: Terminate'));//DEBUG

  if (this.state === this.API_STATE_0) {
    // Termination Before Initialization
    this.SetError(112);
    return false;
  }
  else if (this.state === this.API_STATE_2) {
    // Termination After Termination
    this.SetError(113);
    return false;
  }

  // Commit data to persistent data store
  this.Commit('');

  // Inform the LMS of termination
  $.ajax({
    url: API_1484_11.basepath + '?q=node/' + API_1484_11.nid + '/scorm/terminate',
    dataType: 'json',
    data: 'parameter=' + parameter,
    success: function (data, textStatus) {
      API_1484_11.Watchdog(Drupal.t('RTE: Terminate return:') + textStatus + ' (' + data + ')');//DEBUG
      
      // Set error in case LMS side fails to terminate
      if (data === false) {
        // General Termination Failure
        API_1484_11.SetError(111);
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      API_1484_11.Watchdog(Drupal.t('RTE: Terminate error:') + textStatus + ':' + errorThrown);//DEBUG
      
      // General communication failure (Ajax)
      API_1484_11.SetError(1000);
    }
  });

  // Set Conceptual communication state
  this.SetState(this.API_STATE_2);
  // No error
  this.SetError(0); //XXX

  return true;//DEBUG
};

/**
 * The function requests information from an LMS. It permits the SCO to request 
 * information from the LMS to determine among other things:
 *   -   Values for data model elements supported by the LMS.
 *   -   Version of the data model supported by the LMS.
 *   -   Whether or not specific data model elements are supported.
 * @param name
 * The parameter represents the complete identification of a data model element.
 * @return
 *   The method can return one of two values. The return value shall be 
 *   represented as a characterstring.
 *    -  A characterstring containing the value associated with the parameter
 *    -  If an error occurs, then the API Instance shall set an error code to a 
 *       value specific to the error and return an empty characterstring (""). 
 *       The SCO may call GetLastError() to determine the type of error. More 
 *       detailed information pertaining to the error may be provided by the LMS
 *       through the GetDiagnostic() function.
 */
API_1484_11.GetValue = function (name) {
  var data  = '', data_model = this.UcFirst(name.split('.').shift());

  this.Watchdog(Drupal.t('RTE: GetValue ') + name);//DEBUG

  if (this.state === this.API_STATE_0) {
    // Retrieve Data Before Initialization
    this.SetError(122);
    return '';
  }
  else if (this.state === this.API_STATE_2) {
    // Retrieve Data After Termination
    this.SetError(123);
    return '';
  }

  // Get value from cache
  if (typeof this[data_model].GetValue === 'function') {
    // Invoke the method if it exists
    data = this[data_model].GetValue(name);
    return data;
  }
  else {
    // Data Model Dependency Not Established
    this.SetError(408);
    return '';
  }
  
  // Something went wrong, when we arrive here
  // General Get Failure
  this.SetError(301);
  return false;
};

/**
 * The method is used to request the transfer to the LMS of the value of
 * parameter_2 for the data element specified as parameter_1. This method allows
 * the SCO to send information to the LMS for storage. The API Instance may be 
 * designed to immediately persist data that was set (to the server-side 
 * component) or store data in a local (client-side) cache.
 *
 * @param
 *  - name - The complete identification of a data model element to be set.
 *  - value - The value to which the contents of parameter_1 is to be set. The
 *    value of parameter_2 shall be a characterstring that shall be convertible 
 *    to the data type defined for the data model element identified in 
 *    parameter_1.
 * @return
 * Return Value: The method can return one of two values. The return value shall
 * be represented as a characterstring. The quotes ("") are not part of the 
 * characterstring returned, they are used purely to delineate the values 
 * returned.
 *   -  "true" - The characterstring "true" shall be returned if the LMS accepts
 *      the content of parameter_2 to set the value of parameter_1.
 *   -  "false" - The characterstring "false" shall be returned if the LMS 
 *      encounters an error in setting the contents of parameter_1 with the 
 *      value of parameter_2. The SCO may call GetLastError() to determine the 
 *      type of error. More detailed information pertaining to the error may be 
 *      provided by the LMS through the GetDiagnostic() function.
 */
API_1484_11.SetValue = function (name, value) {
  var data_model = this.UcFirst(name.split('.').shift());

  this.Watchdog(Drupal.t('RTE: SetValue ') + name + ':' + value);//DEBUG
  
  if (this.state === this.API_STATE_0) {
    // Store Data Before Initialization
    this.SetError(132);
    return false;
  }
  else if (this.state === this.API_STATE_2) {
    // Store Data After Termination
    this.SetError(133);
    return false;
  }

  // Save value to cache
  if (typeof this[data_model].SetValue === 'function') {
    // Invoke the method if it exists
    data = this[data_model].SetValue(name, value);
    return data;
  }
  else {
    // Data Model Dependency Not Established
    this.SetError(408);
    return '';
  }

  // Something went wrong, when we arrive here
  // General Set Failure
  this.set.error(352);
  return false;
};

/**
 * The method requests forwarding to the persistent data store any data from the
 * SCO that may have been cached by the API Instance since the last call to
 * Initialize("") or Commit(""), whichever occurred most recently. The LMS would
 * then set the error code to 0 (No Error encountered) and return "true".
 * If the API Instance does not cache values, Commit("") shall return "true" and
 *  set the error code to 0 (No Error encountered) and do no other processing.
 * Cached data shall not be modified because of a call to the commit data 
 * method. For example, if the SCO sets the value of a data model element, then 
 * calls the commit data method, and then subsequently gets the value of the 
 * same data model element, the value returned shall be the value set in the 
 *  call prior to invoking the commit data method. The Commit("") method can be 
 * used as a precautionary mechanism by the SCO. The method can be used to 
 * guarantee that data set by the SetValue() is persisted to reduce the 
 * likelihood that data is lost because the communication session is 
 * interrupted, ends abnormally or otherwise terminates prematurely prior to a 
 * call to Terminate("").
 *
 * @param parameter
 *   ("") - empty characterstring. An empty characterstring shall be passed as a
 *   parameter.
 * @return
 *   The method can return one of two values. The return value shall be 
 *   represented as a characterstring. The quotes ("") are not part of the 
 *   characterstring returned, they are used purely to delineate the values 
 *   returned.
 *     -  "true" - The characterstring "true" shall be returned if the data was 
 *        successfully zhpersisted to a long-term data store.
 *     -  "false" - The characterstring "false" shall be returned if the data 
 *        was unsuccessfully persisted to a long-term data store. The API 
 *        Instance shall set the error code to a value specific to the error 
 *        encountered. The SCO may call GetLastError() to determine the type of 
 *        error. More detailed information pertaining to the error may be 
 *        provided by the LMS through the GetDiagnostic() function.
 */
API_1484_11.Commit = function (parameter) {
  // Encode the session data to JSON
  var session = JSON.stringify(this.session);
  
  this.Watchdog(Drupal.t('RTE: Commit: ') + session);//DEBUG

  if (this.state === this.API_STATE_0) {
    // Commit Before Initialization
    this.SetError(142);
    return false;
  }
  else if (this.state === this.API_STATE_2) {
    // Commit After Termination
    this.SetError(143);
    return false;
  }

  // Commit cached data
  $.ajax({
    type: 'POST',
    url: API_1484_11.basepath + '?q=node/' + API_1484_11.nid + '/scorm/commit',
    data: {parameter: parameter, session: session},
    success: function (data, textStatus) {
      API_1484_11.Watchdog(Drupal.t('RTE: Commit: ') + textStatus + ' (' + data + ')');//DEBUG
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      API_1484_11.Watchdog(Drupal.t('RTE: Commit error: ') + textStatus + ':' + errorThrown);//DEBUG

      // General communication failure (Ajax)
      API_1484_11.SetError(1000);
    }
  });
  
  return true;
};

/**
 * This method requests the error code for the current error state of the API
 * Instance. If a SCO calls this method, the API Instance shall not alter the 
 * current error state, but simply return the requested information.
 * A best practice recommendation is to check to see if a Session Method or 
 * Data-transfer Method was successful. The GetLastError() can be used to return
 * the current error code. If an error was encountered during the processing of 
 * a function, the SCO may take appropriate steps to alleviate the problem.
 *
 * @param
 *   The API method shall not accept any parameters.
 * @return
 *   The API Instance shall return the error code reflecting the current error
 *   state of the API Instance. The return value shall be a characterstring 
 *   (convertible to an integer in the range from 0 to 65536 inclusive) 
 *   representing the error code of the last error encountered.
 */
API_1484_11.GetLastError = function () {
  this.Watchdog(Drupal.t('RTE: GetLastError ') + '(' + this.error + ')');//DEBUG
  
  return this.error;
};

/**
 * The GetErrorString() function can be used to retrieve a textual description 
 * of the current error state. The function is used by a SCO to request the 
 * textual description for the error code specified by the value of the 
 * parameter. The API Instance shall be responsible for supporting the error 
 * codes identified in Section 3.1.7: API Implementation Error Codes. This call 
 * has no effect on the current error state; it simply returns the requested 
 * information.
 *
 * @param errcode
 *   Represents the characterstring of the error code (integer value) 
 *   corresponding to an error message.

 * @return
 *   The method shall return a textual message containing a description of the
 *   error code specified by the value of the parameter. The following 
 *   requirements shall be adhered to for all return values:
 *     -   The return value shall be a characterstring that has a maximum length
 *         of 255 characters.
 *     -   SCORM makes no requirement on what the text of the characterstring 
 *         shall contain. The error codes themselves are explicitly and 
 *         exclusively defined. The textual description for the error code is 
 *         LMS specific.
 *     -   If the requested error code is unknown by the LMS, an empty 
 *         characterstring ("") shall be returned. This is the only time that an
 *         empty characterstring shall be returned.
 */
API_1484_11.GetErrorString = function (error_code) {
  this.Watchdog(Drupal.t('RTE: GetErrorString ') + '(' + error_code + '): ' + this.error_strings[error_code]);//DEBUG

  return this.error_strings[error_code] ? this.error_strings[error_code] : '';
};

/**
 * The GetDiagnostic() function exists for LMS specific use. It allows the LMS 
 * to define additional diagnostic information through the API Instance. This 
 * call has no effect on the current error state; it simply returns the 
 * requested information.
 *
 * @param
 *   An implementer-specific value for diagnostics. The maximum length of the 
 *   parameter value shall be 255 characters. The value of the parameter may be 
 *   an error code, but is not limited to just error codes.
 * @return
 *   The API Instance shall return a characterstring representing the diagnostic
 *   information. The maximum length of the characterstring returned shall be 
 *   255 characters. If the parameter is unknown by the LMS, an empty 
 *   characterstring ("") shall be returned.
 *   If the parameter passed into the GetDiagnostic() function is an empty 
 *   characterstring (""), then it is recommended that the function return a 
 *   characterstring representing diagnostic information about the last error 
 *   encountered.
 */
API_1484_11.GetDiagnostic = function (parameter) {
  var output = '';
  
  this.Watchdog(Drupal.t('RTE: GetDiagnostic: ') + '(' + parameter + ')');//DEBUG

  // Return error description in case an error code is given
  if (parameter && this.error_strings[parameter] && parameter.length > 0) {
    output = parameter + ': ' + this.error_strings[parameter];
    this.Watchdog(Drupal.t('RTE: GetDiagnostic return: ') + '(' + output + ') (Error string requested error)');//DEBUG
  }
  // Return error description of last error
  else if (parameter === '') {
    output = this.error + ': ' + this.error_strings[parameter];
    this.Watchdog(Drupal.t('RTE: GetDiagnostic return: ') + '(' + output + ') (Error string last error)');//DEBUG
  }
  // Unknown - return empty string
  else {
    // Nothing to do
    this.Watchdog(Drupal.t('RTE: GetDiagnostic return: ') + '(' + output + ') (Empty string)');//DEBUG
  }

  return output;
};

/**
 * Helper functions
 */

/**
 * Set error
 */
API_1484_11.SetError = function (parameter) {
  this.Watchdog(Drupal.t('RTE: Set Error ') + '(' + parameter + ')');//DEBUG
  
  // Set error
  this.error = parameter;

//  // Inform LMS of the error
//  $.ajax({
//    url: location.href + '/scorm/set_error',
//    data: 'parameter=' + parameter,
//    success: function (data, textStatus) {
//      API_1484_11.Watchdog('Set error: ' + textStatus + ' (' + data + ')');//DEBUG
//    },
//    error: function (XMLHttpRequest, textStatus, errorThrown) {
//      API_1484_11.Watchdog('RTE: Set error error:' + textStatus + ':' + errorThrown);//DEBUG
//
//      // General communication failure (Ajax)
//      API_1484_11.SetError(1000);
//    }
//  });

  return true;
};

/* Helper functions */

/**
 * Set conceptual communication state
 */
API_1484_11.SetState = function (parameter) {
  this.Watchdog(Drupal.t('RTE: Set state: ') + parameter);//DEBUG
  
  this.state = parameter;
  
  this.Watchdog(Drupal.t('RTE: State set to: ') + this.state);//DEBUG

  return true;
};

/**
 * Load error strings
 */
API_1484_11.LoadErrorStrings = function () {
  this.Watchdog(Drupal.t('RTE: Load Error Strings'));//DEBUG
        
  // Load error strings
  $.ajax({
    url: API_1484_11.basepath + '?q=node/' + API_1484_11.nid + '/scorm/get_error_string',
    dataType: 'json',
    success: function (data, textStatus) {
      API_1484_11.Watchdog(Drupal.t('RTE: Load Error Strings return: ') + textStatus + ' (' + data + ')');//DEBUG
      
      // Cache error strings
      API_1484_11.error_strings = data;
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      API_1484_11.Watchdog(Drupal.t('RTE: Load Error Strings error: ') + textStatus + ':' + errorThrown);//DEBUG
      
      // General communication failure (Ajax)
      API_1484_11.SetError(1000);
    }
  });
};

/**
 * Load data model
 */
API_1484_11.LoadDataModel = function (parameter) {
  this.Watchdog(Drupal.t('RTE: Load Data'));//DEBUG

  // Load error strings
  $.ajax({
    url: API_1484_11.basepath + '?q=node/' + API_1484_11.nid + '/scorm/load_datamodel',
    dataType: 'json',
    data: 'parameter=' + parameter,
    success: function (data, textStatus) {
      API_1484_11.Watchdog(Drupal.t('RTE: Load Data return: ') + textStatus + ' (' + data + ')');//DEBUG
      
      // Cache session data
      API_1484_11.session = data;
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      API_1484_11.Watchdog(Drupal.t('RTE: Load Data error: ') + textStatus + ':' + errorThrown);//DEBUG
      
      // General communication failure (Ajax)
      API_1484_11.SetError(1000);
    }
  });
};

/**
 * Change first character to uppercase
 */
API_1484_11.UcFirst = function (str) {
  var f = str.charAt(0).toUpperCase();
  return f + str.substr(1, str.length - 1);
};

/**
 * Find key in array
 */
API_1484_11.InArray = function (needle, haystack) {
  var found = false, key;

  for (key in haystack) {
    if (haystack[key] === needle) {
      found = true;
      break;
    }
  }
  return found;
};

/**
 * Debugging
 */
API_1484_11.Watchdog = function (message) {
  var debug = this.debug, dbox = $('#API_1484_11');
  
  if (debug) {
    if (typeof window.console === 'object') {
      console.debug(message);
    }
    else if (dbox) {
      dbox.append('<div>' + message + '</div>');//DEBUG
    }
    else {
      alert(message);
    }
  }
};
