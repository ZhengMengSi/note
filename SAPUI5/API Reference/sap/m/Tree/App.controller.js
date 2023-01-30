sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel'
], function (Controller, JSONModel) {
    var x = {
        onInit: function () {
            var oModel = new JSONModel({
                list: [
                    {
                        "text": "Node1",
                        "ref": "sap-icon://attachment-audio",
                        "qqq": [
                            {
                                "text": "Node1-11",
                                "ref": "sap-icon://attachment-e-pub",
                                "nodes":[
                                    {
                                        "text": "Node1-1-1",
                                        "ref": "sap-icon://attachment-html"
                                    },
                                    {
                                        "text": "Node1-1-2",
                                        "ref": "sap-icon://attachment-photo",
                                        "nodes":[
                                            {
                                                "text": "Node1-1-2-1",
                                                "ref": "sap-icon://attachment-text-file",
                                                "nodes":[
                                                    {
                                                        "text": "Node1-1-2-1-1",
                                                        "ref": "sap-icon://attachment-video"
                                                    },
                                                    {
                                                        "text": "Node1-1-2-1-2",
                                                        "ref": "sap-icon://attachment-zip-file"
                                                    },
                                                    {
                                                        "text": "Node1-1-2-1-3",
                                                        "ref": "sap-icon://course-program"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "text": "Node1-2",
                                "ref": "sap-icon://create"
                            }
                        ],
                        "qqq1": [
                            {
                                "text": "Node1-12",
                                "ref": "sap-icon://attachment-e-pub",
                                "nodes":[
                                    {
                                        "text": "Node1-1-1",
                                        "ref": "sap-icon://attachment-html"
                                    },
                                    {
                                        "text": "Node1-1-2",
                                        "ref": "sap-icon://attachment-photo",
                                        "nodes":[
                                            {
                                                "text": "Node1-1-2-1",
                                                "ref": "sap-icon://attachment-text-file",
                                                "nodes":[
                                                    {
                                                        "text": "Node1-1-2-1-1",
                                                        "ref": "sap-icon://attachment-video"
                                                    },
                                                    {
                                                        "text": "Node1-1-2-1-2",
                                                        "ref": "sap-icon://attachment-zip-file"
                                                    },
                                                    {
                                                        "text": "Node1-1-2-1-3",
                                                        "ref": "sap-icon://course-program"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "text": "Node1-2",
                                "ref": "sap-icon://create"
                            }
                        ],

                    },
                    {
                        "text": "Node2",
                        "ref": "sap-icon://customer-financial-fact-sheet"
                    }
                ]
            });
            this.getView().setModel(oModel);
        }
    }

    return Controller.extend('tree.App', x)
})
