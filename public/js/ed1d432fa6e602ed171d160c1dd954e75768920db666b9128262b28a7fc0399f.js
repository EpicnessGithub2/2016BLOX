!function(){var r={1775:function(e,t,r){var n={"./recommendationsComponent.js":825};function a(e){e=i(e);return r(e)}function i(e){if(r.o(n,e))return n[e];e=new Error("Cannot find module '"+e+"'");throw e.code="MODULE_NOT_FOUND",e}a.keys=function(){return Object.keys(n)},a.resolve=i,(e.exports=a).id=1775},5222:function(e,t,r){var n={"./carouselForItemDetailsConstants.js":396,"./carsouselForAvatarPageConstants.js":2669,"./carsouselForInventoryConstants.js":6625,"./experimentConstants.js":5534,"./itemListConstants.js":3695,"./recommendationsConstants.js":135};function a(e){e=i(e);return r(e)}function i(e){if(r.o(n,e))return n[e];e=new Error("Cannot find module '"+e+"'");throw e.code="MODULE_NOT_FOUND",e}a.keys=function(){return Object.keys(n)},a.resolve=i,(e.exports=a).id=5222},6614:function(e,t,r){var n={"./itemListController.js":6403,"./recommendationsController.js":1177};function a(e){e=i(e);return r(e)}function i(e){if(r.o(n,e))return n[e];e=new Error("Cannot find module '"+e+"'");throw e.code="MODULE_NOT_FOUND",e}a.keys=function(){return Object.keys(n)},a.resolve=i,(e.exports=a).id=6614},1691:function(e,t,r){var n={"./itemListDirective.js":7538};function a(e){e=i(e);return r(e)}function i(e){if(r.o(n,e))return n[e];e=new Error("Cannot find module '"+e+"'");throw e.code="MODULE_NOT_FOUND",e}a.keys=function(){return Object.keys(n)},a.resolve=i,(e.exports=a).id=1691},6223:function(e,t,r){var n={"./creatorNameUtilities.js":8023,"./experimentationService.js":555,"./itemsListLayoutService.js":9362,"./itemsListService.js":4809,"./recommendationsService.js":4195};function a(e){e=i(e);return r(e)}function i(e){if(r.o(n,e))return n[e];e=new Error("Cannot find module '"+e+"'");throw e.code="MODULE_NOT_FOUND",e}a.keys=function(){return Object.keys(n)},a.resolve=i,(e.exports=a).id=6223},2979:function(e,t,r){var n={"./components/templates/recommendations.html":7773,"./directives/templates/itemList.html":8128};function a(e){e=i(e);return r(e)}function i(e){if(r.o(n,e))return n[e];e=new Error("Cannot find module '"+e+"'");throw e.code="MODULE_NOT_FOUND",e}a.keys=function(){return Object.keys(n)},a.resolve=i,(e.exports=a).id=2979},726:function(e){function i(e){return e.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()}function o(e){return e.split("/").pop().replace(".html","")}var t={importFilesUnderPath:function(e){e.keys().forEach(e)},templateCacheGenerator:function(e,t,n,a){return e.module(t,[]).run(["$templateCache",function(r){n&&n.keys().forEach(function(e){var t=i(o(e));r.put(t,n(e))}),a&&a.keys().forEach(function(e){var t=i(o(e));r.put(t,a(e).replace(/<\/?script[^>]*>/gi,""))})}])}};e.exports=t},825:function(e,t,r){"use strict";r.r(t);var n={templateUrl:"recommendations",bindings:{recommendationTargetId:"<?",recommendationType:"<",recommendationSubtype:"<?",recommendationItemtypes:"<?",itemCreator:"<?",pageName:"@",showSeeAllButton:"<?"},controller:"recommendationsController"};r(3799).Z.component("recommendations",n),t.default=n},396:function(e,t,r){"use strict";r.r(t);var n={options:{breakpoints:{479:{perView:2.5},766:{perView:4.5},1023:{perView:6.5}}},breakpointWidth:[479,766,1023],glideControl:{defaultNumItemsToMove:6.5,currentNumSlidesToMove:6,currentPageNumber:0,startAt:0,disableLeftMove:!1,disableRightMove:!1}};r(3799).Z.constant("carouselForItemDetails",n),t.default=n},2669:function(e,t,r){"use strict";r.r(t);var n={options:{breakpoints:{479:{perView:4.5},766:{perView:4.5},1023:{perView:4.5}}},breakpointWidth:[479,766,1023],glideControl:{defaultNumItemsToMove:4.5,currentNumSlidesToMove:4,currentPageNumber:0,startAt:0,disableLeftMove:!1,disableRightMove:!1}};r(3799).Z.constant("carouselForAvatarPage",n),t.default=n},6625:function(e,t,r){"use strict";r.r(t);var n={options:{breakpoints:{479:{perView:2.5},766:{perView:4.5},1023:{perView:5.5}}},breakpointWidth:[479,766,1023],glideControl:{defaultNumItemsToMove:5.5,currentNumSlidesToMove:5,currentPageNumber:0,startAt:0,disableLeftMove:!1,disableRightMove:!1}};r(3799).Z.constant("carouselForInventory",n),t.default=n},5534:function(e,t,r){"use strict";r.r(t);var n=r(792),a="https://www.rbx2016.nl",n={getExperimentationValues:function(e,t,r){return{url:"".concat(a,"/product-experimentation-platform/v1/projects/").concat(e,"/layers/").concat(t,"/values?parameters=").concat(r.join(",")),withCredentials:!0,timeout:2e3}}};t.default={url:n,parameterNames:{recommendationNumRows:["recommendationNumRows","recommendationPageName"]},layerNames:{avatarShopPage:"AvatarMarketplace.UI"},defaultProjectId:1}},3695:function(e,t,r){"use strict";r.r(t);var n=r(792),r=r(3799),n={robloxId:1,assetTypes:{hat:8,hairAccessory:41,faceAccessory:42,neckAccessory:43,shoulderAccessory:44,frontAccessory:45,backAccessory:46,waistAccessory:47,gear:19},moreByCreatorVariation:1,endpoints:{getSearchItems:{url:"".concat("https://www.rbx2016.nl","/v1/search/items"),withCredentials:!0,retryable:!0},getItemDetails:{url:"".concat("https://www.rbx2016.nl","/v1/catalog/items/details"),withCredentials:!0,retryable:!0},enrollment:{url:"".concat("https://www.rbx2016.nl","/v1/enrollments"),withCredentials:!0}},searchByCreatorParams:{creatorTargetId:null,createType:null,sortType:"Sales",limit:10},priceStatus:{free:"Free",noResellers:"NoResellers"},userTypes:{1:"User",2:"Group"},systemRobloxId:1,templateUrls:{itemList:"item-list"}};r.Z.constant("itemListConstants",n),t.default=n},135:function(e,t,r){"use strict";r.r(t);var n={recommendationTypes:{asset:0,bundle:2},recommendationSubtypeOverrides:[{assetTypes:[70,71],subject:"user-inventory",newType:2,newSubtype:3}],shoeAssetTypes:[70,71],shoeBundleType:3,recommendationSubtypes:{gamePasses:21,badges:34},assetTypes:{places:9},urls:{catalog:"/catalog"},pageNames:{avatar:"Avatar",catalogItem:"CatalogItem",bundleDetails:"BundleDetail",inventory:"Inventory",favorites:"Favorites"},carouselSelector:"#recommendation-carousel-container",assetRootUrlTemplate:"catalog",bundleRootUrlTemplate:"bundles"};r(3799).Z.constant("recommendationsConstants",n),t.default=n},6403:function(e,t,r){"use strict";r.r(t);r=r(3799);function i(t,e){var r,n=Object.keys(t);return Object.getOwnPropertySymbols&&(r=Object.getOwnPropertySymbols(t),e&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),n.push.apply(n,r)),n}function o(n){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{};e%2?i(Object(a),!0).forEach(function(e){var t,r;t=n,e=a[r=e],r in t?Object.defineProperty(t,r,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[r]=e}):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(a)):i(Object(a)).forEach(function(e){Object.defineProperty(n,e,Object.getOwnPropertyDescriptor(a,e))})}return n}function n(n,e,t,r,a){n.getItemListAndDetails=function(){t.getItemList(n.itemCreator).then(function(e){e&&e.data&&(n.items=e.data.slice(0,7),t.getItemDetails(n.items).then(function(e){e&&e.data&&e.data.forEach(function(t){var r=t.id;n.items.some(function(e){e.id===r&&Object.assign(e,t)})})}))}).finally(function(){n.itemListLayout.isItemListDetailsLoaded=!0})},n.isItemListDetailsAvailable=function(){return n.itemListLayout.isItemListDetailsLoaded&&n.items&&0<n.items.length},n.isItemListDetailsEmpty=function(){return n.itemListLayout.isItemListDetailsLoaded&&n.items&&0===n.items.length},n.initializeLayout=function(){n.itemListLayout=o({},a.itemListLayout);var e=n.itemCreator.Name;n.itemListLayout.heading=a.itemListHeading(e),n.itemListLayout.seeMoreLink=a.getSeeMoreLink(e,n.itemCreator.Type)},n.initializeLayout(),n.getItemListAndDetails()}n.$inject=["$scope","$log","itemsListService","itemListConstants","itemsListLayoutService"],r.Z.controller("itemListController",n),t.default=n},1177:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return o}});var n=r(3799),g=r(5534),a=r(792),t=r(5734),r=r.n(t)().module("catalog",["robloxApp","cursorPagination","infiniteScroll","thumbnails"]).config(["$locationProvider","languageResourceProvider",function(e,t){e.html5Mode({enabled:!0,requireBase:!1}),t.setLanguageKeysFromFile(a.Lang.CatalogResources)}]),t={layout:{initialized:!1,isNavigationMenuLoaded:!1,isSearchItemsLoaded:!1,customText:"custom",accordionMenuIdPrefix:"#category-",showNoResultsMessage:!1,showErrorMessage:!1,isSearchOptionsOpen:!1,isSearchBarFixed:!1,loading:!1,adsInitialized:!1,showFirstLast:!1,isItemDetailsLoaded:!1,isAssetThumbnailLoaded:!1,isBundleThumbnailLoaded:!1,isItemDetailsLoadingFailed:!1,preventLocationChange:!1},defaults:{subcategory:"0"},allGearSubcategoryId:"0",clearFiltersEvent:"Roblox.Catalog.ClearFilters",itemType:{asset:1,bundle:2},templateUrls:{cardItemTemplate:"item-card",catalogBreadcrumbsTemplate:"catalog-breadcrumbs",creatorFiltersTemplate:"creator-filters",genreFiltersTemplate:"genre-filters",mobileSearchBarTemplate:"mobile-search-bar",catalogPageTemplate:"catalog-page",mobileSearchOptionsTemplate:"mobile-search-options",priceFiltersTemplate:"price-filters",searchBarTemplate:"search-bar",searchOptionsTemplate:"search-options",showUnavailableFilterTemplate:"show-unavailable-filter",itemsContainer:"items-container",shimmerContainer:"shimmer-container",shimmerMenu:"shimmer-menu"},buyRobuxUrl:"".concat("https://www.rbx2016.nl","/upgrades/robux?ctx=catalogNew"),catalogUrl:"".concat("https://www.rbx2016.nl","/catalog"),numberOfSearchItems:30,numberOfSearchItemsForFullScreen:60,numberOfSearchItemsExpanded:120,expandedCategoryList:["Recommended"],endpoints:{getMetadata:{url:"".concat("https://www.rbx2016.nl","/v1/catalog/metadata"),retryable:!0,withCredentials:!0},enrollAbTesting:{url:"".concat("https://www.rbx2016.nl","/v1/enrollments"),retryable:!1,withCredentials:!0,timeout:500},getPageItems:{url:a.Endpoints?a.Endpoints.getAbsoluteUrl("/catalog/items"):"/catalog/items"},getSearchOptionsUrl:{url:a.Endpoints?a.Endpoints.getAbsoluteUrl("/catalog/search-options"):"/catalog/search-options"},getNavigationMenuItems:{url:"".concat("https://www.rbx2016.nl","/v1/search/navigation-menu-items"),retryable:!0},getSearchItems:{url:"".concat("https://www.rbx2016.nl","/v1/search/items"),retryable:!0},getCatalogItemDetails:{url:"".concat("https://www.rbx2016.nl","/v1/catalog/items/details"),retryable:!1,withCredentials:!0},getCatalogThumbnails:{url:"".concat("https://www.rbx2016.nl","/v1/assets?format=Png"),retryable:!0,withCredentials:!0},getBundleThumbnails:{url:"".concat("https://www.rbx2016.nl","/v1/bundles/thumbnails?format=Png"),retryable:!0,withCredentials:!0},performanceMeasurements:{url:"".concat("https://www.rbx2016.nl","/v1/performance/measurements"),retryable:!1,withCredentials:!0},avatarRequestSuggestion:{url:"".concat("https://www.rbx2016.nl","/autocomplete-avatar/v2/suggest"),withCredentials:!0,timeout:5e3}},abTestingParams:{subjectType:"User",status:{enrolled:"Enrolled"},apiTimeout:500,variations:{fullScreenCatalogVariation:1}},defaultMetadata:{numberOfCatalogItemsToDisplayOnSplash:25,numberOfCatalogItemsToDisplayOnSplashOnPhone:15},categories:{featured:0},subCategories:{allFeaturedItems:0},queryNames:{category:"Category",subcategory:"Subcategory",pageNumber:"PageNumber",catalogContext:"CatalogContext",sortType:"SortType",sortAggregation:"SortAggregation",sortCurrency:"SortCurrency",currencyType:"CurrencyType",genres:"Genres",gears:"Gears",resultsPerPage:"ResultsPerPage",creatorId:"CreatorID",creatorName:"CreatorName",keyword:"Keyword",pxMin:"PxMin",pxMax:"PxMax",includeNotForSale:"IncludeNotForSale",legendExpanded:"LegendExpanded"},queryValueIsInt:["category","subcategory","catalogcontext","sorttype","sortaggregation","sortcurrency","currencytype","gears","creatorid","pxmin","pxmax"],itemTypes:{bundle:"Bundle",asset:"Asset"},priceStatus:{free:"Free",noResellers:"NoResellers"},itemRestrictionTypes:{thirteenPlus:"ThirteenPlus",limitedUnique:"LimitedUnique",limited:"Limited",rthro:"Rthro"},itemRestrictionIcons:{thirteenPlus:"icon-thirteen-plus-label",limited:"icon-limited-label",limitedUnique:"icon-limited-unique-label",thirteenPlusLimited:"icon-thirteen-plus-limited-label",thirteenPlusLimitedUnique:"icon-thirteen-plus-limited-unique-label",rthroLabel:"icon-rthro-label",rthroLimitedLabel:"icon-rthro-limited-label"},itemStatusClasses:{New:"status-new",Sale:"status-sale",XboxExclusive:"status-default has-text",AmazonExclusive:"status-default has-text",GooglePlayExclusive:"status-default has-text",IosExclusive:"status-default has-text"},itemStatusHasIcons:["SaleTimer"],itemStatusIcons:{SaleTimer:"icon-clock"},robloxSystemUserId:1,pageDirection:{prev:"prev",next:"next"},initializedPaginations:{currentPage:0,isEnabled:!1,direction:"next",startPaging:!1,previousPageCursor:null,nextPageCursor:null},thumbnailValidationStatus:{error:"Error",complete:"Completed",inReview:"InReview",pending:"Pending",blocked:"Blocked"},thumbnailValidationClasses:{error:"icon-error",inReview:"icon-in-review",pending:"icon-pending",blocked:"icon-blocked",placeholder:"icon-placeholder-asset"},userTypes:{user:"User",group:"Group"},errorMessages:{categoryName:"CatalogPageAjaxErrors",endpointNames:{getSearchItems:"SearchItems",getCatalogItemDetails:"CatalogItemDetails"}},englishLanguageCode:"en",autocompleteQueryAmount:10,autocompleteSuggestionEventData:{autocompleteSuggestionEventContext:"webAvatarShop",autocompleteSuggestionEventTimeoutDelay:200,searchAutocompleteEvent:"searchAutocomplete",searchTextTrimEvent:"searchTextTrim",catalogSearchEvent:"catalogSearch",searchClearEvent:"searchClear",searchSuggestionClickedEvent:"searchSuggestionClicked",pageName:"Avatar Shop",searchBox:"avatarShopDesktop",searchType:"avatarshopsearch",suggestionSource:"server"},layeredClothingSubcategories:[59,58,62,61,60,65,63,64]};r.constant("catalogConstants",t);function i(e,s,c,l,t,n,r,a,o,i){var m=this,u={currentPageName:null,isMetaDataLoaded:!1};m.recommendationNumRows=1,m.dismissPlaceholderForRecommendation=function(){e.isPlaceholderOff=!0,e.isRecommendationsLoaded=!0};function d(){var e=m.recommendationSubtype,t=m.recommendationType,r=m.recommendationItemtypes,i=m.pageName;s.overrideRecommendationTypes(r),s.isRecommendationAllowed(t,e)?u.currentPageName!==i?(m.absoluteCatalogUrl=n.getAbsoluteUrl(c.urls.catalog),m.recommendationTargetId||(m.recommendationTargetId=0),u.currentPageName=i,s.getRecommendationMetadata(i).then(function(e){Object.assign(m,e),m.isV2EndpointEnabled=e.isV2EndpointEnabled,s.getCatalogMetadata().then(function(e){u.isPremiumIconOnItemTilesEnabled=e.isPremiumIconOnItemTilesEnabled,u.isPremiumPriceOnItemTilesEnabled=e.isPremiumPriceOnItemTilesEnabled,u.isMetaDataLoaded=!0,m.numberOfItems&&o.getABTestEnrollment(g.default.defaultProjectId,g.default.layerNames.avatarShopPage,g.default.parameterNames.recommendationNumRows).then(function(e){var t,r,n,a;void 0!==(null==e||null===(t=e.data)||void 0===t?void 0:t.recommendationPageName)&&null!==(null==e||null===(r=e.data)||void 0===r?void 0:r.recommendationPageName)&&void 0!==(null==e||null===(n=e.data)||void 0===n?void 0:n.recommendationNumRows)&&null!==(null==e||null===(a=e.data)||void 0===a?void 0:a.recommendationNumRows)&&0<e.data.recommendationPageName.length&&e.data.recommendationPageName.includes(i)&&(m.recommendationNumRows=e.data.recommendationNumRows)},function(){}).finally(function(){m.getItems()})},function(){l.debug(" ------ getCatalogMetadata error -------"),m.dismissPlaceholderForRecommendation()})},function(){l.debug(" ------ getRecommendationsMetadata error -------"),m.dismissPlaceholderForRecommendation()})):u.isMetaDataLoaded&&m.numberOfItems&&m.getItems():m.clearItems(),m.dismissPlaceholderForRecommendation()}function p(e){return void 0!==e.premiumPrice&&null!==e.premiumPrice}m.clearItems=function(){m.items=[]},m.getItems=function(){m.items=[];var t=m.recommendationType,r=m.recommendationSubtype,e=m.recommendationTargetId,n=m.numberOfItems,a=m.subject,i=m.isV2EndpointEnabled,o=m.recommendationNumRows;c.recommendationSubtypeOverrides.forEach(function(e){e.assetTypes.includes(r)&&e.subject===a&&(r=e.newSubtype,t=e.newType)}),s.beginUpdateRecommendedItems(e,t,r,n*o,a,i).then(function(e){m.items=e},function(){l.debug(" ------ beginUpdateRecommendedItems error -------")}).finally(function(){m.dismissPlaceholderForRecommendation()})},m.getDisplayPrice=function(e){return u.isPremiumPriceOnItemTilesEnabled&&p(e)?e.premiumPrice:e.price},m.shouldShowPremiumIcon=function(e){return u.isPremiumIconOnItemTilesEnabled&&p(e)};m.$onInit=function(){d(),m.isMoreByCreatorEnabled=m.itemCreator&&Object.prototype.hasOwnProperty.call(m.itemCreator,"Id"),i.itemCreator=m.itemCreator},i.$watch(function(){return{recommendationType:m.recommendationType,recommendationSubtype:m.recommendationSubtype}},function(e,t){("number"==typeof t.recommendationType&&e.recommendationType!==t.recommendationType||"number"==typeof t.recommendationSubtype&&e.recommendationSubtype!==t.recommendationSubtype)&&d()},!0)}i.$inject=["$rootScope","recommendationsService","recommendationsConstants","$log","itemsListService","urlService","itemListConstants","itemsListLayoutService","experimentationService","$scope"],n.Z.controller("recommendationsController",i);var o=i},7538:function(e,t,r){"use strict";r.r(t);r=r(3799);function n(e){return{restrict:"A",scope:!0,templateUrl:e.templateUrls.itemList}}n.$inject=["itemListConstants"],r.Z.directive("itemList",n),t.default=n},3799:function(e,t,r){"use strict";var n=r(5734),n=r.n(n),a=r(792),n=n().module("recommendations",["robloxApp","thumbnails","recommendationsAppTemplates"]).config(["languageResourceProvider",function(e){e.setLanguageKeysFromFile(a.Lang["Feature.Recommendations"])}]);t.Z=n},8023:function(e,t,r){"use strict";r.r(t);var s=r(792),c=r(4720),r=r(3799);function n(i,o){return{getNameForDisplay:function(e){var t=o.userTypes,r=o.systemRobloxId,n=e.name,a=e.creatorType,e=e.creatorId;return t[1]===a&&r!==e&&s.DisplayNames.Enabled()?c.concatTexts.concat(["",i("escapeHtml")(n)]):i("escapeHtml")(n)}}}n.$inject=["$filter","itemListConstants"],r.Z.factory("creatorNameUtilities",n),t.default=n},555:function(e,t,r){"use strict";r.r(t);var n=r(4720),a=r(5534);function i(){return{getABTestEnrollment:function(e,t,r){return n.httpService.get(a.default.url.getExperimentationValues(e,t,r))}}}r(3799).Z.factory("experimentationService",i),t.default=i},9362:function(e,t,r){"use strict";r.r(t);var a=r(792),r=r(3799);function n(r,e,t){var n=t;return{itemListLayout:{seeMoreLabel:n.get("Action.SeeMore"),isItemListDetailsLoaded:!1},itemListHeading:function(e){return n.get("Heading.MoreByUsers",{username:e})},getSeeMoreLink:function(e,t){t=r.userTypes[t];return a.Endpoints.getAbsoluteUrl("/catalog/?Category=13&CreatorName=".concat(e,"&CreatorType=").concat(t))}}}n.$inject=["itemListConstants","httpService","languageResource"],r.Z.factory("itemsListLayoutService",n),t.default=n},4809:function(e,t,r){"use strict";r.r(t);var u=r(792),r=(r(5734),r(3799));function i(t,e){var r,n=Object.keys(t);return Object.getOwnPropertySymbols&&(r=Object.getOwnPropertySymbols(t),e&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),n.push.apply(n,r)),n}function n(n){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{};e%2?i(Object(a),!0).forEach(function(e){var t,r;t=n,e=a[r=e],r in t?Object.defineProperty(t,r,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[r]=e}):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(a)):i(Object(a)).forEach(function(e){Object.defineProperty(n,e,Object.getOwnPropertyDescriptor(a,e))})}return n}function a(c,r,l,m){function t(e){return e&&e.data&&e.data.forEach(function(e){var t,r,n,a,i,o,s;Object.assign(e,(r=(t=e).id,n=t.name,a=t.price,i=t.creatorTargetId,o=t.creatorName,s=t.creatorType,e=t.productId,t=t.priceStatus,{id:r,name:n,price:a,absoluteUrl:u.Endpoints.getAbsoluteUrl("/catalog/".concat(r,"/catalogname")),creator:{id:i,name:o,nameForDisplay:m("escapeHtml")(o),type:s,profileLink:u.Endpoints.getAbsoluteUrl("/users/".concat(i,"/profile"))},thumbnail:{type:l.thumbnailTypes.assetThumbnail},product:{id:e,noPriceText:t,isFree:t===c.priceStatus.free}}))}),e}return{isMoreByCreatorAvailable:function(e,t){var r=Object.values(c.assetTypes);return u.CurrentUser.isAuthenticated&&-1<r.indexOf(e)&&t!==c.robloxId},enrollAbTesting:function(e){e=[{SubjectType:"User",SubjectTargetId:u.CurrentUser.userId,ExperimentName:e}];return r.httpPost(c.endpoints.enrollment,e)},getItemList:function(e){var t=n({},c.searchByCreatorParams);return t.creatorTargetId=e.Id,t.createType=e.Type,r.httpGet(c.endpoints.getSearchItems,t)},getItemDetails:function(e){e={items:e};return r.httpPost(c.endpoints.getItemDetails,e).then(t)}}}a.$inject=["itemListConstants","httpService","thumbnailConstants","$filter"],r.Z.factory("itemsListService",a),t.default=a},4195:function(e,t,r){"use strict";r.r(t);var S=r(792),n=r(5734),s=r.n(n),c=r(4720),r=r(3799);function a(p,g,b,f,e){var y=g.recommendationTypes;function n(e){return"".concat("https://www.rbx2016.nl","/bundles/").concat(e)}function o(e,t,r){return"Group"===t?"".concat("https://www.rbx2016.nl","/groups/").concat(e,"/").concat(c.seoName.formatSeoName(r)):"".concat("https://www.rbx2016.nl","/users/").concat(e,"/profile")}function v(e){var t=e.creator.name;return{id:e.id,name:e.name,price:e.product.priceInRobux,absoluteUrl:n(e.id),audioUrl:null,urlType:g.bundleRootUrlTemplate,creator:{id:e.creator.id,name:t,nameForDisplay:f.getNameForDisplay(e.creator),type:e.creator.type,profileLink:(t=e.creator.id,"".concat("https://www.rbx2016.nl","/users/").concat(t,"/profile"))},thumbnail:{type:b.thumbnailTypes.bundleThumbnail},product:{id:e.product.id,isForSale:e.product.isForSale,isFree:e.product.isFree,noPriceText:e.product.noPriceText}}}function a(e){var t=e.creatorName,r={name:e.creatorName,type:e.creatorType,id:e.creatorTargetId};return{id:e.id,name:e.name,price:e.price,lowestPrice:e.lowestPrice,absoluteUrl:n(e.id),audioUrl:null,urlType:g.bundleRootUrlTemplate,creator:{id:e.creatorTargetId,name:t,nameForDisplay:f.getNameForDisplay(r),type:e.creatorType,profileLink:o(e.creatorTargetId,e.creatorType,e.creatorName)},thumbnail:{type:b.thumbnailTypes.bundleThumbnail},product:{id:null,isForSale:!(null!==(r=e.itemStatus)&&void 0!==r&&r.includes("Offsale")),isFree:0===e.price,noPriceText:null!==e.priceStatus?e.priceStatus:""}}}function h(e,t){var r={items:[]},n=t===y.bundle?"Bundle":"Asset";e.forEach(function(e){r.items.push({itemType:n,id:e})});e={url:"".concat("https://www.rbx2016.nl","/v1/catalog/items/details")};return p.httpPost(e,r).then(function(e){return e&&e.data?t===y.bundle?e.data.map(a):e.data.map(i):[]})}function i(e){var t,r=e.creatorName,n=e.assetType,a={name:e.creatorName,type:e.creatorType,id:e.creatorTargetId},i=n===g.assetTypes.places?b.thumbnailTypes.placeGameIcon:b.thumbnailTypes.assetThumbnail;return{id:e.id,name:e.name,price:e.price,lowestPrice:e.lowestPrice,absoluteUrl:(t=e.id,n=e.name,"".concat("https://www.rbx2016.nl","/catalog/").concat(t,"/").concat(n)),audioUrl:(n=e.id,3===e.assetType?"".concat("https://www.rbx2016.nl","/library/").concat(n):null),urlType:g.assetRootUrlTemplate,creator:{id:e.creatorTargetId,name:r,nameForDisplay:f.getNameForDisplay(a),type:e.creatorType,profileLink:o(e.creatorTargetId,e.creatorType,e.creatorName)},thumbnail:{type:i},product:{id:null,isForSale:!(null!==(i=e.itemStatus)&&void 0!==i&&i.includes("Offsale")),isFree:0===e.price,noPriceText:null!==e.priceStatus?e.priceStatus:""}}}function T(e){return{url:"".concat("https://www.rbx2016.nl","/v2/recommendations/").concat(e)}}function P(e,t,r,n,a){return{assetTypeId:e,assetId:t,bundleId:r,numItems:n,bundleTypeId:a}}return{isRecommendationAllowed:function(e,t){return e===y.bundle||0<t&&t!==g.recommendationSubtypes.gamePasses&&t!==g.recommendationSubtypes.badges},beginUpdateRecommendedItems:function(e,t,n,r,a,i){if(t===y.bundle)return o=e,s=r,l=a,m=t,u=n,s=(c=i)?P(null,null,o,s,-1!==u?u:null):{numItems:s},o=c?T(l):{url:"".concat("https://www.rbx2016.nl","/v1/bundles/").concat(o,"/recommendations")},p.httpGet(o,s).then(function(e){return e&&e.data?c?h(e.data,m):e.data.map(v):[]});var o,s,c,l,m,u,r=i?P(n,e,null,r):function(e,t){t={numItems:t};0<e&&(t.contextAssetId=e);return t}(e,r),d=i?T(a):(d=n,{url:"".concat("https://www.rbx2016.nl","/v1/recommendations/asset/").concat(d)});return p.httpGet(d,r).then(function(e){return e&&e.data?i?h(e.data,t):e.data.map(function(e){return r=n,e=(t=e).creator.name,r=r===g.assetTypes.places?b.thumbnailTypes.placeGameIcon:b.thumbnailTypes.assetThumbnail,{id:t.item.assetId,name:t.item.name,price:t.item.price,premiumPrice:t.item.premiumPrice,absoluteUrl:t.item.absoluteUrl,audioUrl:t.item.audioUrl,urlType:g.assetRootUrlTemplate,creator:{id:t.creator.creatorId,name:e,nameForDisplay:f.getNameForDisplay(t.creator),type:t.creator.creatorType,profileLink:t.creator.creatorProfileLink},thumbnail:{type:r},product:{id:t.product.id,isForSale:t.product.isForSale,noPriceText:t.product.noPriceText,isFree:t.product.isFree}};var t,r}):e})},getCatalogMetadata:function(){return p.httpGet({url:"".concat("https://www.rbx2016.nl","/v1/catalog/metadata"),retryable:!0,withCredentials:!0})},getRecommendationMetadata:function(e){var t={page:e},e={url:"".concat("https://www.rbx2016.nl","/v1/recommendations/metadata")};return p.httpGet(e,t).then(function(e){var t=s().copy(e);return e&&(e=e.numOfRecommendationsDisplayed,t.numberOfItems=e),t})},overrideRecommendationTypes:function(e){if(!e)return!1;s().forEach(e,function(e,t){y[t.toLowerCase()]=e})}}}a.$inject=["httpService","recommendationsConstants","thumbnailConstants","creatorNameUtilities","$filter"],r.Z.factory("recommendationsService",a),t.default=a},7773:function(e){e.exports='<div> <div class="current-items" ng-show="$ctrl.items.length > 0" ng-cloak> <div class="container-list layer recommendations-container"> <div class="container-header recommendations-header"> <h3> <span ng-bind="\'Heading.RecommendedTitle\' | translate"></span> </h3> <a ng-if="$ctrl.showSeeAllButton" class="see-all-button see-all-link-icon btn-secondary-xs" ng-href="{{ $ctrl.absoluteCatalogUrl }}" ng-bind="\'Action.SeeAll\' | translate"></a> </div> <div class="recommended-items-slider"> <ul class="hlist item-cards recommended-items" ng-class="{\'item-cards-embed\' : $ctrl.numberOfItems < 7, \'single-row\' : $ctrl.recommendationNumRows <= 1}"> <li ng-repeat="item in $ctrl.items" class="list-item item-card recommended-item"> <div class="item-card-container recommended-item-link"> <a ng-href="{{ item.urlType | seoUrl:item.id:item.name}}" class="item-card-link"> <thumbnail-2d class="item-card-thumb-container" thumbnail-type="item.thumbnail.type" thumbnail-target-id="item.id"> </thumbnail-2d> <div class="item-card-name recommended-name" title="{{ item.name }}"> <span class="icon-premium-small" ng-if="$ctrl.shouldShowPremiumIcon(item)"> </span> <span ng-bind="item.name"></span> </div> </a> <div ng-if="item.audioUrl" class="MediaPlayerControls"> <div class="MediaPlayerIcon icon-play" data-mediathumb-url="{{item.audioUrl}}"></div> </div> <div ng-if="item.creator" class="text-overflow item-card-creator recommended-creator"> <span ng-bind-html="\'Label.ByCreatorLink\'| translate:{\r\n                                    linkStart: \'<a target=_self class=\\\'creator-name text-link\\\' href=\\\'\' + item.creator.profileLink + \'\\\'>\', linkEnd: \'</a>\', creator: item.creator.nameForDisplay }"> </span> </div> <div ng-if="$ctrl.getDisplayPrice(item) && item.lowestPrice" class="text-overflow item-card-label"> <span ng-bind="\'Label.Card.PriceWas\' | translate"></span> <span class="icon-robux-gray-16x16"></span> <span class="strike-through" ng-bind="$ctrl.getDisplayPrice(item) | number"></span> </div> <div class="text-overflow item-card-price"> <span class="icon-robux-16x16" ng-show="$ctrl.getDisplayPrice(item) || item.lowestPrice"></span> <span class="text-robux-tile" ng-show="$ctrl.getDisplayPrice(item) && !item.lowestPrice" ng-bind="$ctrl.getDisplayPrice(item) | abbreviate : 1"></span> <span class="text-robux-tile" ng-show="item.lowestPrice" ng-bind="item.lowestPrice | abbreviate : 1"></span> <h4 class="text text-label" ng-hide="$ctrl.getDisplayPrice(item) || item.lowestPrice"> <span class="text-overflow font-caption-body" ng-if="item.product.noPriceText.length > 0" ng-class="{\'text-robux-tile\': item.product.isFree}" ng-bind="item.product.noPriceText"></span> </h4> </div> </div> </li> </ul> </div> </div> </div> <div item-list class="item-list" ng-if="$ctrl.isMoreByCreatorEnabled"></div> </div>'},8128:function(e){e.exports='<div class="container-list layer item-list-container" ng-controller="itemListController" ng-hide="isItemListDetailsEmpty()"> <div class="container-header recommendations-header"> <h3> <span ng-bind="itemListLayout.heading"></span> </h3> <a class="btn-more see-all-link-icon btn-secondary-xs" ng-href="{{itemListLayout.seeMoreLink}}" ng-bind="\'Action.SeeMore\' | translate"></a> </div> <div class="recommended-items-slider"> <ul class="hlist item-cards recommended-items" ng-show="isItemListDetailsAvailable()"> <li ng-repeat="item in items" class="list-item item-card recommended-item"> <div class="item-card-container recommended-item-link"> <a ng-href="{{ item.absoluteUrl }}" class="item-card-link"> <thumbnail-2d class="item-card-thumb-container" thumbnail-type="item.thumbnail.type" thumbnail-target-id="item.id"> </thumbnail-2d> <div class="item-card-name recommended-name" title="{{ item.name }}"> {{ item.name }} </div> </a> <div ng-if="item.audioUrl" class="MediaPlayerControls"> <div class="MediaPlayerIcon icon-play" data-mediathumb-url="{{item.audioUrl}}"></div> </div> <div ng-if="item.creator" class="text-overflow item-card-creator recommended-creator"> <span ng-bind-html="\'Label.ByCreatorLink\'| translate:{\r\n                                      linkStart: \'<a target=_self class=\\\'creator-name text-link\\\' href=\\\'\' + item.creator.profileLink + \'\\\'>\', linkEnd: \'</a>\', creator: item.creator.nameForDisplay }"> </span> </div> <div class="text-overflow item-card-price"> <span class="icon-robux-16x16" ng-show="item.price"></span> <span class="text-robux-tile" ng-show="item.price">{{ item.price | abbreviate : 1 }}</span> <h4 class="text text-label" ng-hide="item.price"> <span class="text-overflow font-caption-body" ng-if="item.product.noPriceText.length > 0" ng-class="{\'text-robux-tile\': item.product.isFree}"> {{item.product.noPriceText}} </span> </h4> </div> </div> </li> </ul> <span class="spinner spinner-default" ng-hide="isItemListDetailsAvailable()"></span> </div> </div> '},4720:function(e){"use strict";},792:function(e){"use strict";e.exports=Roblox},5734:function(e){"use strict";e.exports=angular}},n={};function i(e){if(n[e])return n[e].exports;var t=n[e]={exports:{}};return r[e](t,t.exports,i),t.exports}i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,{a:t}),t},i.d=function(e,t){for(var r in t)i.o(t,r)&&!i.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},function(){"use strict";var e=i(5734),t=i.n(e),r=i(726),n=i(3799);(0,r.importFilesUnderPath)(i(5222)),(0,r.importFilesUnderPath)(i(6223)),(0,r.importFilesUnderPath)(i(1691)),(0,r.importFilesUnderPath)(i(6614)),(0,r.importFilesUnderPath)(i(1775));var e=i(2979),a=(0,r.templateCacheGenerator)(t(),"recommendationsAppTemplates",e);t().element(function(){t().bootstrap("#recommendations-container",[n.Z.name,a.name])})}()}();