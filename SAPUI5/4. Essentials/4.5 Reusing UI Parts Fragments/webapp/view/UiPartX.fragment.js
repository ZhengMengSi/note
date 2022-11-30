// fragment is located in a file named: "my/useful/UiPartX.fragment.js"
sap.ui.define(["sap/m/Button"], function(Button) {
    return {
        createContent: function(oController) {
            var oButton  = new Button({
                text: "Hello World" ,
                press: oController.doSomething
            });
            return oButton;
        }
    };
});