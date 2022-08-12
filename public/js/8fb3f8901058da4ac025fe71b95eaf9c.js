/* Bundle: page_splitApps___64d2630f25962a6f9dcd85e40f3b2fef_m */"use strict"; angular.module("pageTemplateApp", []).run(['$templateCache', function($templateCache) { $templateCache.put("assets-list", "<div class=current-items ng-class=\"{'hide-items':!currentData.templateVisible}\"><div class=container-header ng-class=\"{'place-header':currentData.category.name=='Places'&amp;&amp;staticData.isOwnPage}\"><div class=assets-explorer-title><div ng-class=\"{'hidden-xs':currentData.category.items.length>1}\"><ul class=breadcrumb-container><li><span>{{currentData.category.name}}</span><li ng-show=\"currentData.category.items.length>1\"><span class=icon-right-16x16></span><li ng-show=\"currentData.category.items.length>1\"><span>{{currentData.subcategory.name}}</span></ul></div><span class=small>Showing {{numItems|number}} - {{assetsListContent.assetItems.data.Data.End+1|number}} of {{assetsListContent.assetItems.data.Data.TotalItems|number}} results</span></div><div class=header-content ng-hide=\"currentData.itemSection===null\"><a ng-href={{currentData.assetTypeUrl}} class=\"btn btn-more btn-primary-md\">Get More</a><div class=\"small get-more\">Explore the {{currentData.itemSection}} to find more {{currentData.category.name}}!</div></div></div><div ng-show=\"assetsListContent.assetItems.data.Data.TotalItems==0\" class=item-cards><div class=section-content-off><span ng-hide=staticData.isOwnPage>This user has</span> <span ng-show=staticData.isOwnPage>You have</span> <span ng-show=\"assetsListContent.assetItems.data.Data.PageType==='favorites'\">not favorited any {{currentData.category.name|lowercase}}.</span> <span ng-hide=\"assetsListContent.assetItems.data.Data.PageType==='favorites'\">no <span ng-show=\"currentData.category.name=='Accessories'||currentData.category.name=='Avatar Animations'\">{{currentData.subcategory.name|lowercase}}&nbsp;</span><span>{{currentData.category.name|lowercase}}.</span></span> <span ng-hide=\"assetsListContent.assetItems.data.Data.PageType==='favorites'||currentData.subcategory.name=='Badges'||currentData.subcategory.name=='Game Passes'||currentData.category.name=='Places'\">Try using the <a ng-if=\"staticData.isLibraryLinkEnabled||currentData.itemSection==='catalog'\" class=text-link ng-href={{currentData.assetTypeUrl}}>{{currentData.itemSection}}</a> <span ng-if=\"!staticData.isLibraryLinkEnabled&amp;&amp;currentData.itemSection!=='catalog'\">{{currentData.itemSection}}</span> to find new items.</span></div></div><ul id=assetsItems class=\"hlist item-cards item-cards-embed\"><li ng-repeat=\"item in assetsListContent.assetItems.data.Data.Items\" class=\"list-item item-card\" ng-class=\"{'place-item':currentData.category.name=='Places'}\"><div class=item-card-container><a ng-href={{item.Item.AbsoluteUrl}} class=item-card-link><div class=item-card-thumb-container><div ng-hide=\"item.Product.SerialNumber==null\" class=item-serial-number>#{{item.Product.SerialNumber}}</div><img ng-src={{item.Thumbnail.Url}} thumbnail=item.Thumbnail image-retry class=item-card-thumb><div class=\"item-expire-time-label text-overflow\" ng-hide=\"item.UserItem.RentalExpireTime==null\">Exp: {{item.UserItem.RentalExpireTime}}</div><span ng-show=item.AssetRestrictionIcon ng-class=\"'icon-'+item.AssetRestrictionIcon.CssTag+'-label'\"></span></div><div class=\"text-overflow item-card-name\" title={{item.Item.Name}}>{{item.Item.Name}}</div></a><div ng-if=item.Item.AudioUrl class=MediaPlayerControls><div class=\"MediaPlayerIcon icon-play\" data-mediathumb-url={{item.Item.AudioUrl}} data-jplayer-version={{staticData.jPlayerVersion}}></div></div><div class=\"text-overflow item-card-creator\"><span class=\"xsmall text-label\">By</span> <a class=\"xsmall text-overflow text-link\" ng-href={{item.Creator.CreatorProfileLink}} ng-hide=\"assetsListContent.assetItems.data.Data.PageType!=='favorites'&amp;&amp;currentData.category.name=='Places'&amp;&amp;(currentData.subcategory.name=='My VIP Servers'||currentData.subcategory.name=='Other VIP Servers')&amp;&amp;staticData.isOwnPage\">{{item.Creator.Name}}</a> <a class=\"xsmall text-overflow text-link\" ng-href={{item.PrivateServer.OwnerProfileLink}} ng-show=\"assetsListContent.assetItems.data.Data.PageType!=='favorites'&amp;&amp;(currentData.subcategory.name=='My VIP Servers'||currentData.subcategory.name=='Other VIP Servers')\">{{item.PrivateServer.OwnerName}}</a></div><div class=item-card-price><span class=icon-robux-16x16 ng-show=item.HasPrice></span> <span class=text-robux ng-show=item.HasPrice>{{item.Product.PriceInRobux|abbreviate:0}}</span> <span class=text-label ng-hide=item.HasPrice><span ng-if=\"item.Product.NoPriceText.length>0\" ng-class=\"{'text-robux':item.Product.NoPriceText==='Free'||item.Product.NoPriceText==='Public'}\">{{item.Product.NoPriceText}}</span></span></div></div></ul><div class=pager-holder><ul class=pager ng-show=\"currentData.totalPages>1\"><li class=pager-prev ng-class=\"{'disabled':currentData.currentPage==1}\"><a ng-click=newPage((currentData.currentPage-1))><span class=icon-left></span></a><li class=pager-cur><span>{{currentData.currentPage}}</span><li class=pager-total><span>of</span> <span>{{currentData.totalPages|number}}</span><li class=pager-next ng-class=\"{'disabled':currentData.currentPage==currentData.totalPages}\"><a ng-click=newPage((currentData.currentPage+1))><span class=icon-right></span></a></ul></div></div>"); }]);