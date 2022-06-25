;// bundle: page___4e371ef54d152836f148e918ed7a8105_m
;// files: Events/ET.js, jquery.filter_input.js, extensions/Thumbnails.js, Build/BuildPage.js, IDE/Publish.js, /js/Build/ItemLoader.js, Develop/OpenStudio.js

;// Events/ET.js
EventTracker=new function(){var n=this;n.logMetrics=!1,n.transmitMetrics=!0,n.localEventLog=[];var t=new function(){var n={};this.get=function(t){return n[t]},this.set=function(t,i){n[t]=i},this.remove=function(t){delete n[t]}},r=function(){return(new Date).valueOf()},i=function(n,t){var i=r();$.each(n,function(n,r){u(r,t,i)})},u=function(i,r,u){var e=t.get(i),f,o;e?(t.remove(i),f=u-e,n.logMetrics&&console.log("[event]",i,r,f),n.transmitMetrics&&(o=i+"_"+r,$.ajax({type:"POST",timeout:5e4,url:"/game/report-stats?name="+o+"&value="+f,crossDomain:!0,xhrFields:{withCredentials:!0}}))):n.logMetrics&&console.log("[event]","ERROR: event not started -",i,r)};n.start=function(){var n=r();$.each(arguments,function(i,r){t.set(r,n)})},n.endSuccess=function(){i(arguments,"Success")},n.endCancel=function(){i(arguments,"Cancel")},n.endFailure=function(){i(arguments,"Failure")},n.fireEvent=function(){$.each(arguments,function(t,i){$.ajax({type:"POST",timeout:5e4,url:"/game/report-event?name="+i,crossDomain:!0,xhrFields:{withCredentials:!0}}),n.logMetrics&&console.log("[event]",i),n.localEventLog.push(i)})}};

;// jquery.filter_input.js
(function(n){n.fn.extend({filter_input:function(t){function i(t){var i=t.charCode?t.charCode:t.keyCode?t.keyCode:0,r;return(i==8||i==9||i==13||i==35||i==36||i==37||i==39||i==46)&&n.browser.mozilla&&t.charCode==0&&t.keyCode==i?!0:(r=String.fromCharCode(i),u.test(r))?!0:!1}var r={regex:".*",live:!1},t=n.extend(r,t),u=new RegExp(t.regex);if(t.live)n(this).live("keypress",i);else return this.each(function(){var t=n(this);t.unbind("keypress").keypress(i)})}})})(jQuery);

;// extensions/Thumbnails.js
$(function(){function i(n){var t=n.el.is("img")?n.el:n.el.find("img");return t.length===1?t:n.el.find("img.original-image")}function s(n,t){var r=i(t),u;u=n.data!=null&&n.data[0].imageUrl!=null?n.data[0].imageUrl:n.Url,!r.attr("src")&&r.hasClass("lazy")?r.attr("data-original",u):r.attr("src",u),t.el.removeAttr("data-retry-url"),t.el.trigger("thumbnailLoaded")}function h(n){var i=+new Date-n.start;Roblox.ThumbnailMetrics&&Roblox.ThumbnailMetrics.logFinalThumbnailTime(i),t(["ThumbnailGenTime","2D","Success",i]),t(["ThumbnailGenRetries","2D","Success",n.retryCount])}function c(n){var i=+new Date-n.start;Roblox.ThumbnailMetrics&&Roblox.ThumbnailMetrics.logThumbnailTimeout(),t(["ThumbnailGenRetries","2D","Gave Up",n.retryCount]),t(["ThumbnailGenTime","2D","Gave Up",i])}function l(n,t){n.Final||n.data!=null&&n.data[0].state!=null&&n.data[0].state==="Completed"?(t.realRegeneration&&h(t),s(n,t)):(t.realRegeneration=!0,t.retryCount++,t.retryCount<f?setTimeout(function(){t.retryFunction(t)},u):c(t))}function r(n){var t=n.el.data("retry-url");t&&$.ajax({url:t,dataType:"json",cache:!1,crossDomain:!0,xhrFields:{withCredentials:!0},success:function(t){l(t,n)}})}var n=$("#image-retry-data"),u=n?n.data("image-retry-timer"):1500,f=n?n.data("image-retry-max-times"):10,e=n?n.data("ga-logging-percent"):0,o=window.GoogleAnalyticsEvents&&GoogleAnalyticsEvents.FireEvent||function(){},t=function(n){Math.random()<=e/100&&o(n)};$.fn.loadRobloxThumbnails=function(){return this.each(function(){var n={retryCount:0,realRegeneration:!1,start:+new Date,el:$(this),retryFunction:r},t=i(n);t.one("load",function(){var t=+new Date-n.start;Roblox.ThumbnailMetrics&&Roblox.ThumbnailMetrics.logFinalThumbnailTime(t,"2dThumbnailOnLoad")});setTimeout(function(){r(n)},0)})}});

;// Build/BuildPage.js
typeof Roblox=="undefined"&&(Roblox={}),typeof Roblox.BuildPage=="undefined"&&(Roblox.BuildPage={}),$(function(){function i(){if(t){var n=$(t);n.removeClass("gear-open"),n.parent().css({"background-color":"#FFFFFF","border-color":"white","z-index":"0"}),t=null}return c.hide(),s.hide(),!1}function o(t,i){var f=i.find(n).data("fetchplaceurl"),h=i.find(n).data("universeid"),c=i.find(n).data("fetchuniverseplaces"),l=i.find(r).val(),a={creationContext:l,assetLinksEnabled:k,universeId:h,fetchUniversePlaces:c},e="?",u,o,s;return f.indexOf("?")!=-1&&(e="&"),u=f+e+$.param(a),t&&(o=i.find("table.item-table").length,s="&startRow="+o,u+=s),u}function e(n,t){var f=t.find(".build-loading-container").html(),u;t.find(".items-container").html(f);var e=t.find(r).val(),i=t.find(".content-area .content-title .aside-text"),s=t.find(".breadCrumb .breadCrumbContext"),h=t.find(r+" option:selected").text();t.find(".context-game-separator").hide(),t.find(".breadCrumbGame").hide(),e!="NonGameCreation"?(t.find(".show-active-places-only").hide(),t.find(".creation-context-breadcrumb").show(),s.text(h),i.hide(),n&&(t.find(".context-game-separator").show(),t.find(".breadCrumbGame").show())):(t.find(".creation-context-breadcrumb").hide(),i.show(),t.find(".show-active-places-only").show()),u=o(!1,t),t.find(".items-container").load(u)}function f(t,i){i.find(n).data("universeid",0),i.find(n).data("fetchuniverseplaces",!1),e(t,i)}function u(n,t,i){n.hide(),$.ajax({url:t,cache:!1,dataType:"html",success:function(t){n.remove();var u=i.find(".items-container"),r=$(t).hide();u.append(r),r.fadeIn(),r.find("a[data-retry-url]").loadRobloxThumbnails()},fail:function(){n.show()}})}function l(n,t){Roblox.GenericConfirmation.open({titleText:"Shut Down Servers",bodyContent:t.hasOwnProperty("placeId")?"Are you sure you want to shut down all servers for this place?":"Are you sure you want to shut down all servers in all places in this game?",onAccept:function(){$.ajax({type:"POST",url:n,data:t,error:function(){Roblox.GenericConfirmation.open({titleText:Roblox.BuildPage.Resources.errorOccurred,bodyContent:"An error occured while shutting down servers.",acceptText:Roblox.BuildPage.Resources.ok,acceptColor:Roblox.GenericConfirmation.blue,declineColor:Roblox.GenericConfirmation.none,allowHtmlContentInBody:!0,dismissable:!0})}})},acceptColor:Roblox.GenericConfirmation.blue,acceptText:"Yes",declineText:"No",allowHtmlContentInBody:!0})}function a(n,r){var u;if(t==this)return i();t&&i(),t=this,u=$(this),u.addClass("gear-open");var e=u.closest("table"),f=e.data("item-id"),o=e.data("item-moderation-approved");o=o==="True",r.find("a").each(function(){var n=$(this),i=n.hasClass("advertise-link"),r=n.data("href-template"),s,t;r&&(s=r.replace(/=0/g,"="+f).replace(/\/0\//g,"/"+f+"/").replace(/\/0$/,"/"+f),n.attr("href",s)),n.attr("data-place-id")&&n.attr("data-place-id",f),n.attr("data-item-id")&&n.attr("data-item-id",f),e.data("runnable")==="False"&&n.data("ad-activate-link")==="Run"?n.hide():e.data("runnable")==="True"&&n.data("ad-activate-link")==="Run"&&n.show(),u.data("is-sponsored-game")&&(n.data("parent-sponsored-game-element",u.parents(".sponsored-game")),n.hasClass("dropdown-item-run-sponsored-game")&&n.toggle(u.data("show-run")),n.hasClass("dropdown-item-stop-sponsored-game")&&n.toggle(u.data("show-stop"))),n.data("href-reference")&&n.attr("href",e.data(n.data("href-reference"))),n.hasClass("shutdown-all-servers-button")&&(e.data("type")=="universes"?n.attr("data-universe-id",f).removeAttr("data-place-id"):n.attr("data-place-id",f).removeAttr("data-universe-id")),t=e.data("rootplace-id"),n.data("require-root-place")&&!t?n.hide():n.data("require-root-place")&&t&&(n.show(),n.data("configure-place-template")&&n.attr("href",n.data("configure-place-template").replace(/\/\d+\//,"/"+t+"/"))),i&&!o?n.hide():i&&o&&n.show()}),$("#configure-localization-link").click(function(){Roblox&&Roblox.EventStream&&Roblox.EventStream.SendEventWithTarget("formInteraction","Create",{universeId:f},Roblox.EventStream.TargetTypes.WWW)});var s=r.parent().offset(),c=r.outerWidth(),h=u.offset();return r.css({top:h.top-s.top+21+u.outerHeight()+9+"px",left:h.left-s.left+15-c+u.outerWidth()+"px"}).show(),u.parent().css({"background-color":"#EFEFEF","border-color":"gray","z-index":999}),n.preventDefault(),!1}function v(n,t,r,u,f){i();var e={adid:n,bidAmount:t,confirmed:r,useGroupFunds:u},o="/user-sponsorship/processadpurchase";$.post(o,e,function(i){i.success?Roblox.GenericConfirmation.open({titleText:Roblox.BuildPage.Resources.purchaseComplete,bodyContent:Roblox.BuildPage.Resources.youHaveBid+f+t+"</span> .",acceptText:Roblox.BuildPage.Resources.ok,acceptColor:Roblox.GenericConfirmation.blue,declineColor:Roblox.GenericConfirmation.none,onAccept:function(){window.location.reload()},allowHtmlContentInBody:!0,dismissable:!0}):i.requireConfirmation?Roblox.GenericConfirmation.open({titleText:Roblox.BuildPage.Resources.confirmBid,bodyContent:i.error,acceptText:Roblox.BuildPage.Resources.placeBid,declineText:Roblox.BuildPage.Resources.cancel,acceptColor:Roblox.GenericConfirmation.blue,declineColor:Roblox.GenericConfirmation.gray,onAccept:function(){v(n,t,!0,u,f)},allowHtmlContentInBody:!0,dismissable:!0}):Roblox.GenericConfirmation.open({titleText:Roblox.BuildPage.Resources.errorOccurred,bodyContent:i.error,acceptText:Roblox.BuildPage.Resources.ok,acceptColor:Roblox.GenericConfirmation.blue,declineColor:Roblox.GenericConfirmation.none,allowHtmlContentInBody:!0,dismissable:!0})})}function b(n){i();var t={adid:n},r="/user-sponsorship/deletead";$.post(r,t,function(n){n.success?Roblox.GenericConfirmation.open({titleText:Roblox.BuildPage.Resources.adDeleted,bodyContent:Roblox.BuildPage.Resources.theAdWasDeleted,acceptText:Roblox.BuildPage.Resources.ok,acceptColor:Roblox.GenericConfirmation.blue,declineColor:Roblox.GenericConfirmation.none,onAccept:function(){window.location.reload()},allowHtmlContentInBody:!0,dismissable:!0}):Roblox.GenericConfirmation.open({titleText:Roblox.BuildPage.Resources.errorOccurred,bodyContent:n.error,acceptText:Roblox.BuildPage.Resources.ok,acceptColor:Roblox.GenericConfirmation.blue,declineColor:Roblox.GenericConfirmation.none,allowHtmlContentInBody:!0,dismissable:!0})})}function h(n){i();var t=n.find("tr.bid-now-row"),r=n.find("a[data-ad-status-toggle]").hasClass("runnable");return r&&t.show(),!1}var n=".creation-context-filters-and-sorts",r=".place-creationcontext-drop-down",w=$("#MyCreationsTab "+r),p=$("#GroupCreationsTab "+r),c=$("#MyCreationsTab #build-dropdown-menu"),s=$("#GroupCreationsTab #build-dropdown-menu"),t=null,k=$("#assetLinks").data("asset-links-enabled"),y;$("a[data-retry-url]").loadRobloxThumbnails(),w.change(function(){f(!0,$("#MyCreationsTab"))}),p.change(function(){f(!0,$("#GroupCreationsTab"))});$("#MyCreationsTab .items-container").on("click",".view-places-button",function(){var t=$("#MyCreationsTab"),i=$(this),r=i.data("universeid"),u=i.data("universename");return t.find(n).data("universeid",r),t.find(n).data("fetchuniverseplaces",!0),t.find(".breadCrumbGame").text(u),t.find(".context-game-separator").show(),t.find(".breadCrumbGame").show(),e(!0,t),!1});$("#GroupCreationsTab .items-container").on("click",".view-places-button",function(){var t=$("#GroupCreationsTab"),i=$(this),r=i.data("universeid"),u=i.data("universename");return t.find(n).data("universeid",r),t.find(n).data("fetchuniverseplaces",!0),t.find(".breadCrumbGame").text(u),t.find(".context-game-separator").show(),t.find(".breadCrumbGame").show(),e(!0,t),!1});$("#MyCreationsTab").on("click",".breadCrumbContext",function(){return f(!1,$("#MyCreationsTab")),!1});$("#GroupCreationsTab").on("click",".breadCrumbContext",function(){return f(!1,$("#GroupCreationsTab")),!1});$("#MyCreationsTab .items-container").on("click",".load-more-places",function(){var t=$(this),n=$("#MyCreationsTab"),i=o(!0,n);return u(t,i,n),!1});$("#GroupCreationsTab .items-container").on("click",".load-more-places",function(){var t=$(this),n=$("#GroupCreationsTab"),i=o(!0,n);return u(t,i,n),!1});$(".BuildPageContent").on("click","a.roblox-edit-button",function(){var n,t,i,r;$(".build-page").data("edit-opens-studio")!="False"||Roblox.Client.isIDE()?(n=$(this).closest("table"),t=n.data("rootplace-id")||n.data("item-id"),window.play_placeId=t,i=n.data("universeid")||n.data("item-id"),r=$("#PlaceLauncherStatusPanel").data("is-protocol-handler-launch-enabled")=="True",r?Roblox.GameLauncher.editGameInStudio(t,i,!0):editGameInStudio(t)):Roblox.GenericConfirmation.open({titleText:Roblox.BuildPage.Resources.editGame,bodyContent:Roblox.BuildPage.Resources.openIn+"<a target='_blank' href='https://developer.rbx2016.tk/en-us/articles/Studio-Setup'>"+Roblox.BuildPage.Resources.robloxStudio+"</a>.",acceptText:Roblox.BuildPage.Resources.ok,acceptColor:Roblox.GenericConfirmation.blue,declineColor:Roblox.GenericConfirmation.none,imageUrl:"/images/Icons/img-alert.png",allowHtmlContentInBody:!0,dismissable:!0})});$("body").on("click","a.shutdown-all-servers-button[data-universe-id]",function(){return l("/universes/shutdown-all-games",{universeId:$(this).data("universe-id")}),!1});$("body").on("click","a.shutdown-all-servers-button[data-place-id]",function(){return l("/games/shutdown-all-instances",{placeId:$(this).data("place-id")}),!1});$(".BuildPageContent").on("mouseover","a.gear-button",function(){$(this).addClass("gear-hover")});$(".BuildPageContent").on("mouseout","a.gear-button",function(){$(this).removeClass("gear-hover")});$("#MyCreationsTab").on("click","a.gear-button",function(n){return a.apply(this,[n,c])});$("#GroupCreationsTab").on("click","a.gear-button",function(n){return a.apply(this,[n,s])});$(document).click(function(){i()}),$(window).resize(i),$("input[data-bid-now-amount]").filter_input({regex:"[0-9]"});$(".items-container").on("click","a.runnable[data-ad-status-toggle]",function(){var n=$(this).closest("table.item-table");return h(n),!1});$("a[data-ad-activate-link]").click(function(){var n=$(t).closest("table.item-table");return h(n),!1}),$("a[data-ad-remove-link]").click(function(){var n=$(t).closest("table.item-table"),i=n.data("item-id");return Roblox.GenericConfirmation.open({titleText:Roblox.BuildPage.Resources.confirmDelete,bodyContent:Roblox.BuildPage.Resources.areYouSureDelete,acceptText:Roblox.BuildPage.Resources.ok,declineText:Roblox.BuildPage.Resources.cancel,acceptColor:Roblox.GenericConfirmation.blue,declineColor:Roblox.GenericConfirmation.gray,onAccept:function(){b(i)},allowHtmlContentInBody:!1,dismissable:!0}),!1});$(".items-container").on("click","a.cancel-ad-buy",function(){var n=$(this).closest("table.item-table"),t=n.find("tr.bid-now-row"),i=n.find("input[data-bid-now-amount]");return i.val(""),t.hide(),!1});$(".items-container").on("click","a.process-ad-buy",function(){var t=$(this).closest("table.item-table"),e=t.find("input[data-bid-now-amount]"),o=$("#dataHolder"),r=o.data("minrobuxbid"),n=e.val(),s=t.data("item-id"),h=t.find("input[data-use-group-funds]").is(":checked"),i="<span class='icon-robux-16x16'></span><span>";if(n<r||isNaN(n))return Roblox.GenericConfirmation.open({titleText:Roblox.BuildPage.Resources.yourRejected,bodyContent:Roblox.BuildPage.Resources.bidRange2+i+r+"</span>.",acceptText:Roblox.BuildPage.Resources.ok,acceptColor:Roblox.GenericConfirmation.blue,declineColor:Roblox.GenericConfirmation.none,allowHtmlContentInBody:!0,dismissable:!0}),!1;var u=t.data("cost-per-impression"),c='<img class="tooltip-bottom"  src="'+Roblox.BuildPage.Resources.questionmarkImgUrl+'" alt="Help" title="'+Roblox.BuildPage.Resources.estimatorExplanation+'"/>',f="";return u!=""&&(f="<br />"+Roblox.BuildPage.Resources.estimatedImpressions+c+": "+Math.round(n/u)),Roblox.GenericConfirmation.open({titleText:Roblox.BuildPage.Resources.makeAdBid,bodyContent:Roblox.BuildPage.Resources.wouldYouLikeToBid+i+n+"</span> ?"+f,acceptText:Roblox.BuildPage.Resources.placeBid,declineText:Roblox.BuildPage.Resources.cancel,acceptColor:Roblox.GenericConfirmation.blue,declineColor:Roblox.GenericConfirmation.gray,onAccept:function(){v(s,n,!1,h,i)},onDecline:"",allowHtmlContentInBody:!0,dismissable:!0}),!1});$("#MyCreationsTab .items-container").on("click",".load-more-ads",function(){var n=$(this),t=$("#MyCreationsTab"),i=n.attr("data-next-start"),r="/build/ads?startRow="+i;return u(n,r,t),!1});$("#GroupCreationsTab .items-container").on("click",".load-more-ads",function(){var n=$(this),t=$("#GroupCreationsTab"),i=n.attr("data-next-start"),r=t.find(".BuildPageContent").data("groupid"),f="/build/ads?startRow="+i+"&groupId="+r;return u(n,f,t),!1});$("a.item-image.ad-image").click(function(){var t=$(this).closest("table.item-table"),i=t.data("item-id"),r="/user-sponsorship/getadimage?adId="+i;$.ajax({url:r,success:function(n){$("#AdPreviewContainer").html(n)},cache:!1}),$("span[data-retry-url]").loadRobloxThumbnails();var u=["30%","30%"],f=["10%","45%"],e=["30%","40%"],o=t.data("ad-type"),n=["10%","30%"];switch(o){case"Banner":n=u;break;case"Box":n=e;break;case"Skyscraper":n=f}return $("#AdPreviewModal").modal({overlayClose:!0,escClose:!0,opacity:80,overlayCss:{backgroundColor:"#000"},position:n}),!1}),y=window.location.search;$("#GroupCreationsTab .groups-dropdown-container").on("change","select",function(){var n=$(this).val(),t=$("#GroupCreationsTab .groups-dropdown-container").data("get-url");window.location=t+"/"+n+y})});

;// IDE/Publish.js
$(function(){$("#closeButton").click(function(){window.close()});var n=$("div.BuildPageContent");n.attr("data-gear-menu-enabled")=="False"&&$("div.gear-button-wrapper").hide()});

;// /js/Build/ItemLoader.js
var Roblox=Roblox||{};Roblox.BuildPage=Roblox.BuildPage||{},Roblox.BuildPage.ItemLoader=Roblox.BuildPage.ItemLoader||function(){function i(n){var t=l(n),i=$("option[value='"+t+"'][data-universe-id]");return i.data("universeId")}function l(n){return n.find("select.universe-selection-drop-down").val()}function e(t){var r=l(t),u=Number(t.find(">.BuildPageContent").data("groupid")),i={assetTypeId:n};return r&&(i.targetPlaceId=r),u&&(i.groupId=u),i}function y(n,t){var i=e(n);return i.startRow=t?n.find(".items-container > .item-table").length:0,i.archivedOnly=n.find(f).is(":checked"),"/build/assets?"+$.param(i)}function p(n){var t=n.find("#upload-iframe"),r=i(n),u;r!=t.attr("data-target-universe-id")&&(t.attr("data-target-universe-id",r),u="/build/upload?"+$.param(e(n)),n.find("#upload-iframe").attr("src",u))}function o(n,t){var i=n.find(".load-more-items"),r=y(n,!t);a(n,t,i,r)}function a(n,t,i,r){var u=n.find(".items-container"),e,s,o;t&&u.html(""),i.hide(),e=n.find(".asset-container-dropdown"),n.find(f).is(":checked")?e.hide():e.show(),s=u.closest(".BuildPageContent"),o=s.find(".build-loading-container").show(),$.ajax({type:"GET",url:r,cache:!1,dataType:"html",success:function(n){i.remove(),o.hide();var t=$(n).hide();u.append(t),t.fadeIn(),t.find("a[data-retry-url]").loadRobloxThumbnails()},fail:function(){i.show(),o.hide()}})}function r(n,r){var s=i(n),f,u,o;if(!s){n.find(".items-container").text("No public experiences to display passes for.");return}f=n.find("."+t.gamePass),u=e(n),u.startId=r,o="/build/game-passes?"+$.param(u),a(n,r<=0,f,o)}function u(n,r){var e=i(n),f=n.find(".items-container"),o=n.find(".build-loading-container"),u=n.find("."+t.badge);if(!e){f.text("No public experiences to display badges for.");return}r||f.html(""),o.show(),u.remove(),$.get(Roblox.EnvironmentUrls.badgesApi+"/v1/universes/"+e+"/badges",{cursor:r||"",sortOrder:"Desc",limit:50}).done(function(n){n.data.length<=0&&!n.previousPageCursor&&f.text("You haven't created any badges for this experience."),n.data.forEach(function(t,i){(i>0||n.previousPageCursor)&&f.append($('<div class="separator">'));var o=new Date(t.created),u=Roblox.Endpoints.getBadgeDetailsUrl(t.id,t.name),r=c.clone(),e=r.find(".title");r.removeClass("item-template"),r.attr("data-item-id",t.id),e.text(t.name),e.attr("href",u),r.find(".item-date").append(o.toLocaleDateString()),r.find(".won-ever-count").text(t.statistics.awardedCount),r.find(".won-yesterday-count").text(t.statistics.pastDayAwardedCount),r.find("img").parent().attr({href:u,"data-retry-url":Roblox.Endpoints.getAbsoluteUrl(Roblox.EnvironmentUrls.thumbnailsApi+"/v1/assets?assetIds="+t.iconImageId+"&size=150x150&format=png")}),f.append(r)}),$("a[data-retry-url]").loadRobloxThumbnails(),n.nextPageCursor&&(u.length<=0&&(u=$('<a href="#">'),u.attr("class",t.badge+" btn-control btn-control-small"),u.text("Load More Badges")),u.attr("data-cursor",n.nextPageCursor),f.append(u))}).fail(function(){f.append(u)}).always(function(){o.hide()})}function v(e){if(n=Number($("#assetTypeId").val()),c=e.find(".item-template").clone(),e.find(".item-template").remove(),!(e.length<=0)){e.on("click",".load-more-items",function(){return o(e,!1),!1});e.on("click","."+t.gamePass,function(){return r(e,$(this).data("startId")),!1});e.on("click","."+t.badge,function(){return u(e,$(this).data("cursor")),!1});e.on("change",f,function(){return o(e,!0),!1});e.on("change","select.universe-selection-drop-down",function(){p(e),n===s?r(e,0):n===h&&u(e,"")});e.find("#upload-iframe").attr("data-target-universe-id",i(e)),e.is(":visible")&&(n===s?r(e,0):n===h&&u(e,""))}}var n,s=34,h=21,c,f=".show-archive-checkbox > input[type='checkbox']",t={badge:"load-more-badges",gamePass:"load-more-game-passes"};return $(function(){v($("#MyCreationsTab")),v($("#GroupCreationsTab"))}),{loadBadges:u,loadGamePasses:r,loadAssets:o}}();

;// Develop/OpenStudio.js
$(function(){play_placeId=0,$(".studio-launch").click(function(){Roblox&&Roblox.GameLauncher?Roblox.GameLauncher.openStudio():console.warn("Roblox or Roblox.GameLauncher was not defined. Failed to open Studio.")})});

;//Bundle detector
Roblox && Roblox.BundleDetector && Roblox.BundleDetector.bundleDetected('page');