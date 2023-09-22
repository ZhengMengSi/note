/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("sap.ca.ui.utils.Lessifier");jQuery.sap.require("sap.ui.core.theming.Parameters");sap.ca.ui.utils.Lessifier={};sap.ca.ui.utils.Lessifier.DEFAULT_COLOR="#fff";sap.ca.ui.utils.Lessifier.lessifyCSS=function(e,r,s){if(s){jQuery.sap.require("sap.ui.thirdparty.less")}if(e==null||e.length==0||r==null||r.length==0){jQuery.sap.log.error("When trying to lessify a css make sure both the module name and the css file path are specified.");return}var a=jQuery.sap.getModulePath(e);if(a==null){jQuery.sap.log.error("The module "+e+" has never been registered for a specific path.");return}if(jQuery("#"+e+"-less-css").length!=0){jQuery.sap.log.warning("The css for module "+e+" has already been processed.");return}var i=a+r;if(!jQuery.sap.startsWith(r,"/")&&!jQuery.sap.endsWith(a,"/")){i=a+"/"+r}var u=jQuery.ajax({url:i,async:false});var t=u.status<400?u.responseText:"";if(t!=null&&t.length!=0){var l=["media","font-face","-webkit-keyframes","see","keyframes","import","charset","document","page","supports"];var n;if(s){n=t.replace(/@([a-zA-Z0-9\-_]*):/g,function(e,r){if(l.indexOf(r)<0){l.push(r)}return e})}n=t.replace(/@([a-zA-Z0-9\-_]*)/g,function(e,r){var a;if(l.indexOf(r)!=-1){return e}a=sap.ui.core.theming.Parameters.get(r);if(a==null){if(s){jQuery.sap.log.error("The parameter @"+r+" was replaced by a dummy value due to missing reference!");return sap.ca.ui.utils.Lessifier.DEFAULT_COLOR}else{jQuery.sap.log.warning("The parameter @"+r+" was not found via API call!");return"@"+r}}return a});if(s){(new less.Parser).parse(n,function(r,s){if(r!=null){jQuery.sap.log.error("The css for module "+e+" cannot be parsed by less.js : "+r.message)}else{n=s.toCSS({})}})}jQuery("head").append("<style id='"+e+"-less-css'>"+n+"</style>");jQuery.sap.log.info("The css for module "+e+" has been processed correctly.")}};
//# sourceMappingURL=Lessifier.js.map