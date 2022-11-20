/* dist/js/styleGuide.bundle.min.js */
!function(n){var o={};function l(e){if(o[e])return o[e].exports;var t=o[e]={i:e,l:!1,exports:{}};return n[e].call(t.exports,t,t.exports,l),t.l=!0,t.exports}l.m=n,l.c=o,l.d=function(e,t,n){l.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},l.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},l.t=function(t,e){if(1&e&&(t=l(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(l.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)l.d(n,o,function(e){return t[e]}.bind(null,o));return n},l.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return l.d(t,"a",t),t},l.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},l.p="",l(l.s=100)}([,,,,,,,,function(e,t){e.exports=angular},function(e,t){function i(e){return e.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()}function a(e){return e.split("/").pop().replace(".html","")}var n={importFilesUnderPath:function(e){e.keys().forEach(e)},templateCacheGenerator:function(e,t,o,l){return e.module(t,[]).run(["$templateCache",function(n){o&&o.keys().forEach(function(e){var t=i(a(e));n.put(t,o(e))}),l&&l.keys().forEach(function(e){var t=i(a(e));n.put(t,function(e){return e.replace(/<\/?script[^>]*>/gi,"")}(l(e)))})}])}};e.exports=n},function(e,t,n){"use strict";var o=n(8),l=n.n(o),i=n(32),a=l.a.module("fileUpload",["robloxApp","fileUploadHtmlTemplate"]).config(["languageResourceProvider",function(e){i.Lang.FileUploadComponentResources&&e.setLanguageKeysFromFile(i.Lang.FileUploadComponentResources)}]);t.a=a},,,,,,,,,,,,,function(e,t,n){"use strict";var o=n(8),l=n.n(o).a.module("toast",["toastHtmlTemplate"]);t.a=l},,,,,,,,,function(e,t){e.exports=Roblox},,,,,,,,,,,,,,,function(e,t,n){var o={"./toastDirective.js":48};function l(e){var t=i(e);return n(t)}function i(e){if(n.o(o,e))return o[e];var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}l.keys=function(){return Object.keys(o)},l.resolve=i,(e.exports=l).id=47},function(e,t,n){"use strict";n.r(t);var o=n(23);function l(o){return{restrict:"A",replace:!0,scope:{toastLayout:"="},templateUrl:"toast",link:function(n,e,t){n.layout={isEnabled:!1,isVisible:!1,isNeeded:!1,text:"",timeout:null,animationDuration:200,visibilityDelay:50},n.$watch("toastLayout.isNeeded",function(e,t){e!==t&&e&&!n.layout.timeout&&(n.layout.text=n.toastLayout.text,n.layout.isEnabled=e,n.toastLayout.isNeeded=!1,o(function(){n.layout.isVisible=!0},n.layout.visibilityDelay),n.layout.timeout=o(function(){n.layout.isVisible=!1,o(function(){n.layout.isEnabled=!1,n.layout.timeout=null,n.toastLayout.isNeeded=!1},n.layout.animationDuration)},n.toastLayout.timeout),n.toastLayout.isNeeded=!1)},!0)}}}l.$inject=["$timeout"],o.a.directive("toast",l),t.default=l},function(e,t,n){var o={"./directives/templates/toast.html":50};function l(e){var t=i(e);return n(t)}function i(e){if(n.o(o,e))return o[e];var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}l.keys=function(){return Object.keys(o)},l.resolve=i,(e.exports=l).id=49},function(e,t){e.exports='<div class="toast-container" ng-show="layout.isEnabled" ng-class="{\'toast-visible\': layout.isVisible}"> <div class="toast-content"> <span ng-bind="layout.text"></span> </div> </div>'},,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,function(e,t){e.exports=jQuery},,,,function(e,t,n){"use strict";n.r(t);var o=n(8),l=n.n(o),i=n(9);n(101),n(23),n(10);Object(i.importFilesUnderPath)(n(47)),Object(i.importFilesUnderPath)(n(102)),Object(i.importFilesUnderPath)(n(104)),Object(i.importFilesUnderPath)(n(106)),Object(i.importFilesUnderPath)(n(110));var a=n(49),r=n(113);Object(i.templateCacheGenerator)(l.a,"toastHtmlTemplate",a),Object(i.templateCacheGenerator)(l.a,"fileUploadHtmlTemplate",r)},function(e,t,n){},function(e,t,n){var o={"./fileUploadComponent.js":103};function l(e){var t=i(e);return n(t)}function i(e){if(n.o(o,e))return o[e];var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}l.keys=function(){return Object.keys(o)},l.resolve=i,(e.exports=l).id=102},function(e,t,n){"use strict";n.r(t);var o={templateUrl:"file-upload-v2",bindings:{fileModel:"=",fileName:"=",fileUploadInfo:"="},controller:"fileUploadController"};n(10).a.component("fileUpload",o),t.default=o},function(e,t,n){var o={"./fileUploadController.js":105};function l(e){var t=i(e);return n(t)}function i(e){if(n.o(o,e))return o[e];var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}l.keys=function(){return Object.keys(o)},l.resolve=i,(e.exports=l).id=104},function(e,t,n){"use strict";function o(n,o,e){var l=this;l.onDragOverOrEnter=function(e){var t=e&&e.originalEvent;return t&&(e.preventDefault(),t.dataTransfer.effectAllowed=o.effectTypes.copy),!1},l.allowedFileTypesString=function(){return 1===l.fileUploadInfo.allowedFileTypes.length?l.fileUploadInfo.allowedFileTypes[0]:l.fileUploadInfo.allowedFileTypes.join(", ")},l.onFileChange=function(){var t=l.fileModel[0];if(t)if(function(e){return e&&e.name&&l.fileUploadInfo.allowedFileTypes.includes(e.name.split(".").pop())}(t)){var e=new FileReader;e.onload=function(e){n.$apply(function(){l.fileUploadInfo.previewSrc=e.target.result,l.fileUploadInfo.fileSelected=!0,l.fileUploadInfo.file=t})},e.readAsDataURL(t)}else l.fileModel=[]}}n.r(t),n(10).a.controller("fileUploadController",o),t.default=o},function(e,t,n){var o={"./fileTypes.js":107,"./fileUploadConstants.js":108,"./fileWidgetLayout.js":109};function l(e){var t=i(e);return n(t)}function i(e){if(n.o(o,e))return o[e];var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}l.keys=function(){return Object.keys(o)},l.resolve=i,(e.exports=l).id=106},function(e,t,n){"use strict";n.r(t);var o={image:"image",imageMimeTypes:{"image/png":!0,"image/jpeg":!0},allowedFileTypes:[".png",".jpg",".bmp"]};n(10).a.constant("fileTypes",o),t.default=o},function(e,t,n){"use strict";n.r(t);var o={effectTypes:{copy:"copy"},eventTypes:{drop:"drop"}};n(10).a.constant("fileUploadConstants",o),t.default=o},function(e,t,n){"use strict";n.r(t);var o={template:"file-upload-widget",selectors:{fileInput:".file-upload-elem",fileButton:".file-btn",dropzone:".dropzone"}};n(10).a.constant("fileWidgetLayout",o),t.default=o},function(e,t,n){var o={"./enableFileSelectionDirective.js":111,"./fileUploadDirective.js":112};function l(e){var t=i(e);return n(t)}function i(e){if(n.o(o,e))return o[e];var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}l.keys=function(){return Object.keys(o)},l.resolve=i,(e.exports=l).id=110},function(e,t,n){"use strict";function o(){return{require:"ngModel",link:function(e,t,n,o){o.$setViewValue(t[0].files),t.on("change",function(e){o.$setViewValue(t[0].files)})}}}n.r(t),n(10).a.directive("enableFileSelection",o),t.default=o},function(e,t,n){"use strict";n.r(t);var o=n(10),l=n(96),g=n.n(l),m=n(32);function i(c,d,u,p,v){return{restrict:"A",templateUrl:u.template,scope:{fileUploadInfo:"="},link:function(o,e,t){o.fileUpload={name:"",isFileInvalid:!1,allowedFileTypes:d.allowedFileTypes};var l=c(t.fileModel)(o)||{},i=t.fileName,a=e.find(u.selectors.fileInput),n=e.find(u.selectors.fileButton),r=e.find(u.selectors.dropzone);function s(e){var t=e&&e.originalEvent;return t&&(e.preventDefault(),t.dataTransfer.effectAllowed=p.effectTypes.copy),!1}function f(e){var t=(e&&e.type===p.eventTypes.drop?(e.preventDefault(),e.originalEvent.dataTransfer.files):e.target.files)[0];if(!t)return!1;if(function(e,t){return t===d.image&&d.imageMimeTypes[e.type]}(t,d.image)){o.fileUpload.isFileInvalid=!1,l[i]=t,o.fileUpload.name=t.name;var n=new FileReader;n.onload=function(e){o.fileUploadInfo.previewSrc=e.target.result,o.fileUploadInfo.fileSelected=!0,o.$apply()},n.readAsDataURL(t)}else o.fileUpload.isFileInvalid=!0,m.BootstrapWidgets.ToggleSystemMessage(g()(".alert-warning"),100,4e3,v.get("Message.InvalidFile",{fileTypes:o.fileUploadInfo.allowedFileTypes})),l[i]=null,o.fileUpload.name="",a.val(""),o.$apply();return!1}n.click(function(){a.trigger("click")}),a.on("change",f),r.on("drop",f),r.on("dragover",s),r.on("dragenter",s)}}}i.$inject=["$parse","fileTypes","fileWidgetLayout","fileUploadConstants","languageResource"],o.a.directive("fileUpload",i),t.default=i},function(e,t,n){var o={"./components/templates/fileUploadV2.html":114,"./directives/templates/fileUpload.html":115};function l(e){var t=i(e);return n(t)}function i(e){if(n.o(o,e))return o[e];var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}l.keys=function(){return Object.keys(o)},l.resolve=i,(e.exports=l).id=113},function(e,t){e.exports='<div id="file-upload-widget"> <div class="file-upload-content border"> <div class="thumbnail-holder"> <img ng-src="{{ $ctrl.fileUploadInfo.previewSrc }}"/> <div class="preview-overlay" ng-show="$ctrl.fileUploadInfo.fileSelected"> <div class="font-caption-header preview-text text-overflow" ng-bind="$ctrl.fileUploadInfo.file.name"></div> </div> </div> <div class="dropzone" ng-show="$ctrl.fileUploadInfo.dragAndDrop" ng-on-drop="$ctrl.onFileChange()" ng-on-dragover="$ctrl.onDragOverOrEnter()" ng-on-dragenter="$ctrl.onDragOverOrEnter()"></div> <div ng-show="$ctrl.fileUploadInfo.dragAndDrop"> <p class="instruction-text" ng-bind="\'Label.DragImage\' | translate"></p> <p class="text-on-line"> — <span ng-bind="\'Label.Or\' | translate"></span> — </p> </div> <input type="file" name="file" id="selectFile" class="hidden file-upload-elem" ng-model="$ctrl.fileModel" ng-change="$ctrl.onFileChange()" ng-accept="$ctrl.allowedFileTypesAsString()" enable-file-selection/> <label for="selectFile" class="btn-control-sm btn-action file-btn" ng-class="{ \'dnd-disabled\': !$ctrl.fileUploadInfo.dragAndDrop }" ng-bind="$ctrl.fileUploadInfo.mobileDevice ? (\'Label.SelectFromDevice\' | translate) : (\'Label.SelectFromComputer\' | translate)"> </label> </div> </div> '},function(e,t){e.exports='<div class="alert-system-feedback"> <div class="alert alert-warning"> <span class="alert-context" ng-bind="\'Label.Warning\' | translate"></span> <span id="close" class="icon-close-white"></span> </div> </div> <div class="dropzone" ng-show="fileUploadInfo.dragAndDrop"></div> <div ng-show="fileUploadInfo.dragAndDrop"> <p class="instruction-text" ng-bind="\'Label.DragImage\' | translate"></p> <p class="text-on-line"> — <span ng-bind="\'Label.Or\' | translate"></span> — </p> </div> <input type="file" name="file" class="hidden file-upload-elem"/> <button type="button" class="btn-control-sm btn-action file-btn" ng-class="{ \'dnd-disabled\': !fileUploadInfo.dragAndDrop }"> <span class="btn-text" ng-bind="fileUploadInfo.mobileDevice ? (\'Label.SelectFromDevice\' | translate) : (\'Label.SelectFromComputer\' | translate)"></span> </button> <span class="file-name-container" ng-if="fileUpload.name.length < 1" ng-bind="\'Label.NoFileChosen\' | translate"></span> <span class="file-name-container text-overflow" ng-if="fileUpload.name.length > 0" ng-bind="fileUpload.name"> </span> '}]);

/* Bundle detector */
window.Roblox && window.Roblox.BundleDetector && window.Roblox.BundleDetector.bundleDetected("StyleGuide");