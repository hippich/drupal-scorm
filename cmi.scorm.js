// $Id$

/**
 * SCORM 2004 Datamodel (CMI)
 *
 * @author
 * Stefan Auditor <stefan.auditor@erdfisch.de>
 */

API_1484_11.Cmi = {};

/* RTE hooks */

/**
 * Get data from data model
 */
API_1484_11.Cmi.GetValue = function (name) {
  var data = API_1484_11.session, keys = name.split('.');

  for (i = 0; i < keys.length; i = i + 1) {
    if (typeof data[keys[i]] !== undefined) {
      // Reduce to the needed
      data = data[keys[i]];
    }
    else {
      // Undefined Data Model Element
      API_1484_11.SetError(401);
      return '';
    }
  }

  if (data.implemented === true && data.read === true) {
    API_1484_11.Watchdog(Drupal.t('CMI: GetValue return: ') + data.value);//DEBUG

    //TODO: Special case handling and evaluation

    // No error
    API_1484_11.SetError(0);
    return data.value;
  }
  else if (data.implemented === true && data.read === false && data.write === false) {
    API_1484_11.Watchdog(Drupal.t('CMI: GetValue return: ') + data.value);//DEBUG

    // General Argument Error
    API_1484_11.SetError(201);
    return '';
  }
  else if (data.implemented === true && data.read === false) {
    API_1484_11.Watchdog(Drupal.t('CMI: GetValue return: ') + data.value);//DEBUG

    // Data Model Element Is Write Only
    API_1484_11.SetError(405);
    return '';
  }
  else if (data.implemented === false) {
    // Unimplemented Data Model Element
    API_1484_11.SetError(402);
    return '';
  }
  
  // Something went wrong, when we arrive here
  // General Get Failure
  API_1484_11.SetError(301);
  return false;
};

 /**
 * Cache data to data model
 */
API_1484_11.Cmi.SetValue = function (name, value) {
  var session = API_1484_11.session;

  // Switch from dot notation to array notation to prevent
  // errors in case a data model element name starts numeric
  name = "['" + name.replace(/\./g, "']['") + "']";

  //FIXME: eval is evil.

  if (eval("typeof session" + name + " === undefined")) {
    // Undefined Data Model Element
    API_1484_11.SetError(401);
    return false;
  }

  if (eval("session" + name + "['implemented'] === true") && eval("session" + name + "['write'] === true")) {
    
    //TODO: Special case handling and evaluation

    if (eval("session" + name + "['states'] != undefined")) {
      if (API_1484_11.InArray(value, eval("session" + name + "['states']"))) {
        // Save data to session
        this.CacheValue(name, value);

        // No error
        API_1484_11.SetError(0);
        return true;
      }
      else {
        // Data Model Element Type Mismatch
        API_1484_11.SetError(406);
        return false;
      }

    }
    else {
      // Save data to session
      this.CacheValue(name, value);
      
      // No error
      API_1484_11.SetError(0);
      return true;
    }

  }
  else if (eval("session" + name + "['implemented'] === true") && eval("session" + name + "['write'] === false")) {
    // Data Model Element Is Read Only
    API_1484_11.SetError(404);
    return false;
  }
  else if (eval("session" + name + "['implemented'] === false")) {
    // Unimplemented Data Model Element
    API_1484_11.SetError(402);
    return false;
  }

  // Something went wrong, when we arrive here
  // General Set Failure
  API_1484_11.SetError(352);
  return false;
};

/* Helper functions */

/**
 * Cache value into session
 */
API_1484_11.Cmi.CacheValue = function (name, value) {
  var session = API_1484_11.session;

  //FIXME: eval is evil.

  // Save data to session
  eval("session" + name + "['value'] = '" + value + "';");
  // Mark as changed
  //eval("session" + name + "['changed'] = true;");
  API_1484_11.Cmi.SetChangeMarker(name, true);

  return true;
}

/**
 *
 */
API_1484_11.Cmi.SetChangeMarker = function (name, value) {
  var session = API_1484_11.session;
  // Mark as changed
  eval("session" + name + "['changed'] = " + value + ";");
  return true;
}
