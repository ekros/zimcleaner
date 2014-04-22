/**
 *  * This method gets called by the Zimlet framework when the zimlet loads.
 *   */
zimtransfer_HandlerObject.prototype.init =
function() {
	
	// create the tab application
	this._tabAppName = this.createApp("ZimCleaner", "zimbraIcon", "ZimCleaner");

	$(document).on('click', '#inbox', function(){
		// inboxRequest();		
		$("#space_details").html(inbox_space_details);
		secondBarEffect();
	});

	$(document).on('click', '#trash', function(){
		$("#space_details").html(trash_space_details);
		secondBarEffect();
	});

	$(document).on('click', '#drafts', function(){
		$("#space_details").html(drafts_space_details);
		secondBarEffect();
	});	

	$(document).on('click', '#sent', function(){
		$("#space_details").html(sent_space_details);
		secondBarEffect();
	});

	$(document).on('click', '#spam', function(){
		$("#space_details").html(junk_space_details);
		secondBarEffect();
	});

	$(document).on('click', '#briefcase', function(){
		$("#space_details").html(briefcase_space_details);
		secondBarEffect();
	});

	$(document).on('click', '#other', function(){
		$("#space_details").html(other_space_details);
		secondBarEffect();
	});

	$(document).on('click', '#show_heaviest_btn', function(){
		var _types = new AjxVector();
		_types.add("CONV");
		appCtxt.getSearchController().search({userInitiated: true, query: smaller_query, sortBy: 'sizeDesc', limit: 20,  offset: 0, types:_types}); 
	});

	$(document).on('click', '#show_oldest_btn', function(){
		var _types = new AjxVector();
		_types.add("CONV");
		// TODO We need a way to limit the number of results returned by the search.. a limit param doesn't work...
		appCtxt.getSearchController().search({userInitiated: true, query: oldest_query, sortBy: 'dateAsc', types:_types});
	});

	$(document).on('click', '#show_trash_btn', function(){
		var _types = new AjxVector();
		_types.add("CONV");
		appCtxt.getSearchController().search({userInitiated: true, query: 'under:trash', sortBy: 'dateAsc', types:_types});
	});

	$(document).on('click', '#show_trash_briefcase_btn', function(){
		var _types = new AjxVector();
		_types.add("BRIEFCASE_ITEM");
		appCtxt.getSearchController().search({userInitiated: true, query: 'under:trash', sortBy: 'dateAsc', types:_types});
	});

	$(document).on('click', '#show_spam_btn', function(){
		var _types = new AjxVector();
		_types.add("CONV");
		appCtxt.getSearchController().search({userInitiated: true, query: 'under:junk', sortBy: 'dateAsc', types:_types});
	});	

	$(document).on('click', '#show_drafts_btn', function(){
		var _types = new AjxVector();
		_types.add("CONV");
		appCtxt.getSearchController().search({userInitiated: true, query: 'under:drafts', sortBy: 'dateAsc', types:_types});
	});

	$(document).on('click', '#show_briefcase_btn', function(){
		var _types = new AjxVector();
		_types.add("BRIEFCASE_ITEM");
		appCtxt.getSearchController().search({userInitiated: true, query: 'under:briefcase', sortBy: 'sizeDesc', types:_types});
	});

	$(document).on('click', '#clean_trash_btn', function(){
		var c = confirm(CLEAN_TRASH_CONFIRM);
		if (c)
		{
			zimtransfer_HandlerObject.prototype._submitSOAPRequestJSON('FolderAction', 'zimbraMail', {"op":"empty","id":"3","recursive":true});
		}
	});

	$(document).on('click', '#clean_spam_btn', function(){
		var c = confirm(CLEAN_SPAM_CONFIRM);
		if (c)
		{
			zimtransfer_HandlerObject.prototype._submitSOAPRequestJSON('FolderAction', 'zimbraMail', {"op":"empty","id":"4","recursive":true});
		}
	});

	$(document).on('click', '#clean_drafts_btn', function(){
		var c = confirm(CLEAN_DRAFTS_CONFIRM);
		if (c)
		{
			zimtransfer_HandlerObject.prototype._submitSOAPRequestJSON('FolderAction', 'zimbraMail', {"op":"empty","id":"6","recursive":true});
		}
	});

	$(document).on('click', '#export_heaviest_btn', function(){
		var today = new Date();
		tagName = HEAVIEST_MESSAGES_TAG + today.toLocaleDateString() + '-' + today.getHours() + today.getMinutes() + today.getSeconds();
		console.log("tagName: " + tagName);
		// Create tag
		tagIds = heaviestIds;
		zimtransfer_HandlerObject.prototype._submitSOAPRequestJSON('CreateTag', 'zimbraMail', tagName);
	});

	$(document).on('click', '#export_oldest_btn', function(){
		var today = new Date();
		tagName = OLDEST_MESSAGES_TAG + today.toLocaleDateString() + '-' + today.getHours() + today.getMinutes() + today.getSeconds();
		console.log("tagName: " + tagName);
		// Create tag
		tagIds = oldestIds;
		zimtransfer_HandlerObject.prototype._submitSOAPRequestJSON('CreateTag', 'zimbraMail', tagName);
		console.log(tagIds);
	});

	$(document).on('click', '#reload_btn', function(){
		//	Send batch request (reloads contents)
		zimtransfer_HandlerObject.prototype._submitSOAPRequestJSON('Batch', 'zimbra');
	});
};
