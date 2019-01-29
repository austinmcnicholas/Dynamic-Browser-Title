/*global logger*/
/*
    DynamicBrowserTitle
    ========================

    @file      : DynamicBrowserTitle.js
    @version   : 1.0.0
    @author    : Austin McNicholas
    @date      : 2019-1-28
    @copyright : EPI-USE America
    @license   : undefined

    Documentation
    ========================
    Describe your widget here.
*/

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "dojo/_base/lang",
    "dojo/ready"
], function (declare, _WidgetBase, lang, ready) {
    "use strict";

    // Declare widget's prototype.
    return declare("DynamicBrowserTitle.widget.DynamicBrowserTitle", [ _WidgetBase], {
       // Parameters configured in the Modeler.
        
       title: "",
       _contextObj: null,
       delay: null,
       emptyReplacement: "",
       
       
       // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
       postCreate: function () {
           logger.debug(this.id + ".postCreate");
           
          this._updateRendering();
       },
        
       // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
       update: function (obj, callback) {
           logger.debug(this.id + ".update");
           
           this._contextObj = obj;
           this._resetSubscriptions(obj);
           this._updateRendering(obj, callback); // We're passing the callback to updateRendering to be called after DOM-manipulation
           
       },
       
        _setTitle : function(title) {
           logger.debug(this.id + "._setTitle");
            
           var backupString = this.emptyReplacement;

           if (title){
            setTimeout(function(){ document.title = title }, this.delay);
           } else {
            setTimeout(function(){ document.title = backupString }, this.delay);  
           }
           //use a timeout to ensure the title is not replaced too early. If the title is replaced too soon, then the mendix default page title will overwrite it.
           
            
           /*
            ready(function(){ document.title = title }); //ready function didnt work

            //addOnLoad would still replace the title before mxui was fully loaded
            mx.addOnLoad(function(x) {
               document.title = title
            }); 
            
            */ 
       },
       
       // Reset subscriptions.
       _resetSubscriptions: function (obj) {
           logger.debug(this.id + "._resetSubscriptions");
           // Release handles on previous object, if any.
           this.unsubscribeAll();

           // When a mendix object exists create subscribtions.
           if (obj) {
               this.subscribe({
                   guid: this._contextObj.getGuid(),
                   callback: lang.hitch(this, function (guid) {
                       this._updateRendering(obj);
                   })
               });

               
           }
       },
       

       
        // Rerender the interface.
       _updateRendering: function (obj, callback) {
           logger.debug(this.id + "._updateRendering");

           //if an object is passed then replace the title
           if (obj){      
            this._setTitle(obj.get(this.title));    
           }
        
           this._executeCallback(callback, "_updateRendering"); // The callback, coming from update, needs to be executed, to let the page know it finished rendering
           
       },
       
           
           
       _executeCallback: function (cb, from) {
          logger.debug(this.id + "._executeCallback" + (from ? " from " + from : ""));
           if (cb && typeof cb === "function") {
               cb();
           }
       }
       
    });
       
});

require(["DynamicBrowserTitle/widget/DynamicBrowserTitle"]);
