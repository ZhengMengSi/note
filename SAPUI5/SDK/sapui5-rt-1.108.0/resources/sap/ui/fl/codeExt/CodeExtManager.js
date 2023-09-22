/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/write/_internal/Storage","sap/ui/fl/Change"],function(e,n){"use strict";var t;t={createOrUpdateCodeExtChange:function(t,r){if(!t.content||!t.content.codeRef){throw new Error("no code reference passed for the code extension change")}if(!t.selector||!t.selector.id){throw new Error("no controller name passed for the code extension change")}if(!t.reference){throw new Error("no reference passed for the code extension change")}t.changeType=t.changeType||"codeExt";var o=n.createInitialFileContent(t);return e.write({layer:o.layer,transport:r.transportId,flexObjects:[o]})},createCodeExtChanges:function(t,r){t=t||[];if(t.length===0){return Promise.resolve()}var o=[];t.forEach(function(e){e.changeType=e.changeType||"codeExt";e.packageName=r.packageName;e.content={codeRef:r.codeRef};o.push(n.createInitialFileContent(e))});return e.write({layer:o[0].layer,transport:r.transportId,flexObjects:o})},deleteCodeExtChange:function(n,t){if(n.changeType!=="codeExt"||n.fileType!=="change"){throw new Error("the change is not of type 'code extension'")}if(!n.fileName){throw new Error("the extension does not contains a file name")}if(n.namespace===undefined){throw new Error("the extension does not contains a namespace")}return e.remove({layer:n.layer,transport:t.transportId,flexObject:n})}};return t});
//# sourceMappingURL=CodeExtManager.js.map