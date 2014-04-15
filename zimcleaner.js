// globals
tagIds = new Array();
oldestIds = new Array(); // comma separated ids of oldest messages
heaviestIds = new Array(); // comma separated ids of heaviest messages
tagName = "";
spam_limit_per = 5; // spam (junk) alarm limit percentage
spam_limit_per_crit = 2.5; // spam (junk) alarm limit percentage (CRITICAL)
trash_limit_per = 10; // trash alarm limit percentage
trash_limit_per_crit = 5; // trash alarm limit percentage (CRITICAL)
briefcase_limit_per = 10; // briefcase alarm limit percentage
briefcase_limit_per_crit = 5; // briefcase alarm limit percentage (CRITICAL)
drafts_limit_per = 10; // drafts items limit percentage
drafts_limit_per_crit = 5; // drafts items limit percentage (CRITICAL)
heaviest_limit_per = 7; // heaviest items alarm limit percentage
heaviest_limit_per_crit = 3; // heaviest items alarm limit percentage (CRITICAL)
oldest_limit_per = 50; // oldest items alarm limit percentage
oldest_limit_per_crit = 10; // oldest items alarm limit percentatge (CRITICAL)
unread_limit = 100; // number of unread messages alarm limit
critical_limit = 0.95; // critical usage limit
locale = "en-US"; // default locale
VERSION = "0.6"; // version shown in the aplication
quotaIsCritical = false; // Is quota almost full?
critical_msg_probability = 0.1; // Probability of showing a quota warning message

/**
 * Defines the Zimlet handler class.
 */
function zimtransfer_HandlerObject() {
};

/**
 * Makes the Zimlet class a subclass of ZmZimletBase.
 */
zimtransfer_HandlerObject.prototype = new ZmZimletBase();
zimtransfer_HandlerObject.prototype.constructor = zimtransfer_HandlerObject;

/**
* Check space warnings and show popups if necesary
*/
zimtransfer_HandlerObject.prototype.onShowView =
function(view)
{
	// get browser language and initialize locales
	initLocales(navigator.language);

	// CHECK USER QUOTA
	var quota = appCtxt.get(ZmSetting.QUOTA);
	var quota_used = appCtxt.get(ZmSetting.QUOTA_USED);
	var random = Math.random();
	console.log(random);
	if ( quota_used/quota > critical_limit && random < critical_msg_probability )
	{
		setTimeout(function(){
			appCtxt.setStatusMsg(CRITICAL_WARNING + " " + CLICK_ON_TAB);
		}, 5000);
	}
}

/**
 * This method gets called by the Zimlet framework each time the application is opened or closed.
 *  
 * @param	{String}	appName		the application name
 * @param	{Boolean}	active		if <code>true</code>, the application status is open; otherwise, <code>false</code>
 */
zimtransfer_HandlerObject.prototype.appActive =
function(appName, active) {
	switch(appName) {
		case this._tabAppName: {			
			if (active) {
			
				// get browser language and initialize locales
				initLocales(navigator.language);

				app = appCtxt.getApp(this._tabAppName); // returns ZmZimletApp

				var toolbar = app.getToolbar(); // returns ZmToolBar

				toolbar.setContent("<span style='color:red'>Zim</span>Cleaner<span class='pull-right'><small>  (version " + VERSION + ")<small></span>");

				var overview = app.getOverview(); // returns ZmOverview

				var controller = appCtxt.getAppController();
				var appChooser = controller.getAppChooser();

  				// Get root folder and its descendants

				// Batch Request with all the data needed
				this._submitSOAPRequestJSON('Batch', 'zimbra');
			}
			break;
		}
	}
};

/**
 * This method gets called by the Zimlet framework when the application is opened for the first time.
 *  
 * @param	{String}	appName		the application name		
 */
zimtransfer_HandlerObject.prototype.appLaunch =
function(appName) {
	switch(appName) {
		case this._tabAppName: {
			// the app is launched, do something
			break;	
		}	
	}
};

/**
 * Submits a SOAP request in JSON format.
 * 
 * GetAccountInfoRequest: {
 *   _jsns: "urn:zimbraAccount",
 *   account: {
 *     _content: "user1",
 *     by: "name"
 *    }
 * }
 *
 * @private
 */
zimtransfer_HandlerObject.prototype._submitSOAPRequestJSON =
function(type, urn, params) {

	var requestName = type + 'Request';

	if (type == 'GetFolder')
	{
		var jsonObj = {GetFolderRequest:{_jsns:"urn:zimbraMail"}};
		request = jsonObj.GetFolderRequest;
		request.folder = params;
	}
	else if (type == 'GetAccountInfo')
	{
		var jsonObj = {GetAccountInfoRequest:{_jsns:"urn:zimbraAccount"}};
		request = jsonObj.GetAccountInfoRequest;
		request.account = params;
	}
	else if (type == 'FolderAction')
	{
		var jsonObj = {FolderActionRequest:{_jsns:"urn:zimbraMail"}};
		request = jsonObj.FolderActionRequest;
		request.action = params;
	}
	else if (type == 'GetInfo')
	{
		var jsonObj = {GetInfoRequest:{_jsns:"urn:zimbraAccount"}};
		request = jsonObj.GetInfoRequest;
		request.action = params;
	}
	else if (type == 'GetMailbox')
	{
		var jsonObj = {GetMailboxRequest:{_jsns:"urn:zimbraAdmin"}};
		request = jsonObj.GetMailboxRequest;
		request.action = params;
	}
	else if (type == 'GetMailboxMetadata')
	{
		var jsonObj = {GetMailboxMetadataRequest:{_jsns:"urn:zimbraMail"}};
		request = jsonObj.GetMailboxMetadataRequest;
		request.meta = params;
	}
	else if (type == 'SearchHeaviest')
	{
		var jsonObj = {SearchRequest:{_jsns:"urn:zimbraMail", limit: '20', types: 'conversation', sortBy: 'sizeDesc'}};
		jsonObj.SearchRequest.query = 'smaller:99999MB';		
	}
	else if (type == 'SearchOldest')
	{
		var jsonObj = {SearchRequest:{_jsns:"urn:zimbraMail", limit: '1000', types: 'conversation', sortBy: 'dateAsc'}};
		// var aYearAgo = getAYearAgo();
		jsonObj.SearchRequest.query = 'after:01/01/1900';
	}	
	else if (type == 'SearchUnread')
	{
		var jsonObj = {SearchRequest:{_jsns:"urn:zimbraMail", limit: '101', types: 'conversation', sortBy: 'dateDesc'}};
		jsonObj.SearchRequest.query = 'is:unread';
	}
	else if (type == "CreateTag")
	{
		var jsonObj = {CreateTagRequest:{_jsns:"urn:zimbraMail", tag: {color: Math.floor(Math.random()*7), name: params}}};
	}
	else if (type == "TagConv")
	{
		var jsonObj = {ConvActionRequest:{_jsns:"urn:zimbraMail", action: {id: tagIds.toString(), op: "tag", tn: params['name']}}};
		// TODO you can use ItemActionRequest to tag conversations and messages or files in the briefcase
	}
	else if (type == 'Batch')
	{
		var jsonObj = {BatchRequest:{_jsns:"urn:zimbra", onerror: 'continue'}};
		request = jsonObj.BatchRequest;
		// Get all folders
		request.GetFolderRequest = {_jsns:"urn:zimbraMail", path: '/'};
	}

	var params = {
			jsonObj:jsonObj,
			asyncMode:true,
			callback: (new AjxCallback(this, this._handleSOAPResponseJSON)),
			errorCallback: (new AjxCallback(this, this._handleSOAPErrorResponseJSON))
		};

	return appCtxt.getAppController().sendRequest(params);

};

var inboxRequest = function() {

	var jsonObj = {GetFolderRequest:{_jsns:"urn:zimbraMail"}};
	request = jsonObj.GetFolderRequest;
	request.GetFolderRequest = {_jsns:"urn:zimbraMail", path: "/Inbox"};
	// request.folder = "/Inbox";

	var params = {
			jsonObj:jsonObj,
			asyncMode:true,
			callback: (new AjxCallback(this, inboxResponseJSON)),
			errorCallback: (new AjxCallback(this, this._handleSOAPErrorResponseJSON))
		};

	return appCtxt.getAppController().sendRequest(params);
};

/**
 * Handles the SOAP response.
 * 
 * @param	{ZmCsfeResult}		result		the result
 * @private
 */
zimtransfer_HandlerObject.prototype._handleSOAPResponseJSON =
function(result) {

	if (result.isException()) {
		// do something with exception
		var exception = result.getException();

		return;
	}
	
	var response;

	if (result.getResponse().GetInfoResponse != null)
	{
		response = result.getResponse().GetInfoResponse;

		var quota_used = response.used;
	}
	else if (result.getResponse().FolderActionResponse != null)
	{
		appCtxt.setStatusMsg('Acción realizada con éxito');
	}
	else if (result.getResponse().GetAccountInfoResponse != null)
	{
		appCtxt.setStatusMsg('cuota');
	}
	else if (result.getResponse().GetMailboxResponse != null)
	{
		response = result.getResponse().GetMailboxResponse;

		var mailbox_size = response.used;
		alert(mailbox_size);
	}
	else if (result.getResponse().GetMailboxMetadataResponse != null)
	{
		response = result.getResponse().GetMailboxMetadataResponse;
		alert(response.meta);
	}
	else if (result.getResponse().SearchResponse != null)
	{
		response = result.getResponse().SearchResponse;

		var title = "";
		var body = "";
		// TODO this is workaround to distinguish between searches
		// HEAVIEST MESSAGES
		if (response.sortBy == 'sizeDesc')
		{
			title = "";
			// check condition
			heaviest_size = getResponseSize(response);
			heaviestIds = getResponseIds(response);
			var percentage = (heaviest_size/total_size)*100;
			// trigger condition: 20 heaviest messages take up more than x% of space
			// depending on the current space usage
			var hl = quotaIsCritical ? heaviest_limit_per_crit : heaviest_limit_per
			console.log("hl: " + hl);
			console.log("hl percentage: " + percentage);
			if (percentage > hl)
			{
				body = "<div class='alert'>" + HEAVIEST_WARNING + "&nbsp<button id='show_heaviest_btn' class='btn btn-mini'>" + SHOW_BUTTON + "</button>&nbsp<button id='export_heaviest_btn' class='btn btn-mini'>" + EXPORT_AND_TAG_BUTTON + "</button><span class='icon icon-question-sign' title='" + HEAVIEST_EXPORT_AND_TAG_TOOLTIP + "'></span></div>";
				$("#suggestions").append("<strong>" + title + "</strong><br>" + body + "<br>");
			}
		}
		// OLDEST MESSAGES
		else if (response.sortBy == 'dateAsc')
		{
			title = "";
			// check condition
			oldest_size = getResponseSize(response);
			var percentage = (oldest_size/total_size)*100;
			oldestIds = getResponseIds(response);
			// trigger condition: 1000 oldest messages take up more than 50% of space
			// TODO add the following extra condition: these messages must be older than a year...
			// depending on the current space usage
			var ol = quotaIsCritical ? oldest_limit_per_crit : oldest_limit_per
			console.log("ol: " + ol);
			console.log("ol percentage: " + percentage);
			if (percentage > ol)
			{
				body = "<div class='alert'>" + OLDEST_WARNING + "&nbsp<button id='show_oldest_btn' class='btn btn-mini'>" + SHOW_BUTTON + "</button>&nbsp<button id='export_oldest_btn' class='btn btn-mini'>" + EXPORT_AND_TAG_BUTTON + "</button><span class='icon icon-question-sign' title='" + OLDEST_EXPORT_AND_TAG_TOOLTIP + "'></span></div>";
				$("#suggestions").append("<strong>" + title + "</strong><br>" + body + "<br>");
			}			
		}
		// UNREAD MESSAGES
		else if (response.sortBy == 'dateDesc')
		{
			title = "";
			// check condition
			if (response.c.length > unread_limit) {
				// action
				body = "<div class='alert'>" + UNREAD_WARNING + "</div>" + UNREAD_ADVICE;
				$("#suggestions").append("<strong>" + title + "</strong><br>" + body + "<br>");
			}
		}
	}
	else if (result.getResponse().CreateTagResponse != null)
	{
		var ctr = result.getResponse().CreateTagResponse;
		var ctr_id = ctr.tag[0].id;
		var ctr_name = ctr.tag[0].name;
		this._submitSOAPRequestJSON('TagConv', 'zimbraMail', {id: ctr_id, name: ctr_name});
		appCtxt.setStatusMsg(TAG_NOTIFICATION);
	}
	else if (result.getResponse().ConvActionResponse != null)
	{
		// hidden iframe triggers download
		console.log("tagName2: " + tagName);
		$(".DwtComposite").append("<iframe id='downloadFrame' style='display:none'></iframe>");
		var iframe = document.getElementById("downloadFrame");
		iframe.src = "https://localhost/home/" + appCtxt.getUsername() + "/?fmt=zip&query=tag:" + tagName;
	}
	else if (result.getResponse().BatchResponse != null)
	{
		// do something with response (in JSON format)
		response = result.getResponse().BatchResponse;

		total_size = 0, inbox_size = 0, trash_size = 0, drafts_size = 0, sent_size = 0, junk_size = 0, briefcase_size = 0, other_size = 0;
		inbox_name = 'Bandeja de entrada';
		trash_name = 'Papelera';
		drafts_name = 'Borradores';
		sent_name = 'Enviados';
		junk_name = 'Spam';
		briefcase_name = 'Maletín';
		other_name = 'Otras carpetas';
		inbox_folder_names = {};
		trash_folder_names = {};
		drafts_folder_names = {};
		sent_folder_names = {};
		junk_folder_names = {};
		briefcase_folder_names = {};
		other_folder_names = {};


		//called with every property and it's value
		function process(key,value) {
			if (key == 'absFolderPath')
			{
				path = value;
			}
		    if (key == 's')
		    {
		    	total_size += value;

		    	if (path.beginsWith('/Inbox'))
		    	{
		    		inbox_folder_names[path] = value;
		    		inbox_size += value;
		    	}
		    	else if (path.beginsWith('/Trash'))
		    	{
		    		trash_folder_names[path] = value;
		    		trash_size += value;
		    	}
		    	else if (path.beginsWith('/Drafts'))
		    	{
		    		drafts_folder_names[path] = value;
		    		drafts_size += value;
		    	}
		    	else if (path.beginsWith('/Sent'))
		    	{
		    		sent_folder_names[path] = value;
		    		sent_size += value;
		    	}
		    	else if (path.beginsWith('/Junk'))
		    	{
		    		junk_folder_names[path] = value;
		    		junk_size += value;
		    	}
		    	else if (path.beginsWith('/Briefcase'))
		    	{
		    		briefcase_folder_names[path] = value;
		    		briefcase_size += value;
		    	}
		    	else
		    	{
		    		other_folder_names[path] = value;
		    		other_size += value;
		    	}
		    }
		}

		function traverse(o,func) {
		    for (var i in o) {
		        func.apply(this,[i,o[i]]);  
		        if (typeof(o[i])=="object") {
		            //going on step down in the object tree!!
		            traverse(o[i],func);
		        }
		    }
		}

		//that's all... no magic, no bloated framework
		traverse(response.GetFolderResponse[0].folder[0].folder, process);

		// TODO show total space versus available space in the account
		var inbox_per = (inbox_size/total_size)*100;
		var trash_per = (trash_size/total_size)*100;
		var drafts_per = (drafts_size/total_size)*100;
		var sent_per = (sent_size/total_size)*100;
		var junk_per = (junk_size/total_size)*100;
		var briefcase_per = (briefcase_size/total_size)*100;
		var other_per = (other_size/total_size)*100;

		var inbox_label = INBOX + " " + bytesToSize(inbox_size) + " (" + inbox_per.toFixed(1) + "%)";
		var trash_label = TRASH + " " + bytesToSize(trash_size) + " (" + trash_per.toFixed(1) + "%)";
		var drafts_label = DRAFTS + " " + bytesToSize(drafts_size) + " (" + drafts_per.toFixed(1) + "%)";
		var sent_label = SENT + " " + bytesToSize(sent_size) + " (" + sent_per.toFixed(1) + "%)";
		var junk_label = SPAM + " " + bytesToSize(junk_size) + " (" + junk_per.toFixed(1) + "%)";
		var briefcase_label = BRIEFCASE + " " + bytesToSize(briefcase_size) + " (" + briefcase_per.toFixed(1) + "%)";
		var other_label = OTHER + " " + bytesToSize(other_size) + " (" + other_per.toFixed(1) + "%)";

		var labels2 = "<strong>" + USED_SPACE_DETAILS + "</strong> | <a href='#'><span id='inbox' style='color: red'>" + inbox_label + "</span></a> | <a href='#'><span id='trash' style='color: green'>" + trash_label + "</span></a> | <a href='#'><span id='drafts' style='color: deeppink'>" + drafts_label + "</span></a>" + 
					 " | <a href='#'><span id='sent' style='color: blue'>" + sent_label + "</span></a> | <a href='#'><span id='spam' style='color: orange'>" + junk_label + "</span></a> | <a href='#'><span id='briefcase' style='color: maroon'>" + briefcase_label + "</span></a> | <a href='#'><span id='other' style='color: black'>" + other_label + "</span></a>";
		var bars2 = "<div class='bar1' title='" + inbox_label + "' style='float: left; width: " + inbox_per + "%; height: 20px; background-color: red; border: 0px'></div>" + 
				   "<div class='bar1' title='" + trash_label + "' style='float: left; width: " + trash_per + "%; height: 20px; background-color: green; border: 0px'></div>" + 
				   "<div class='bar1' title='" + drafts_label + "' style='float: left; width: " + drafts_per + "%; height: 20px; background-color: deeppink; border: 0px'></div>" + 
				   "<div class='bar1' title='" + sent_label + "' style='float: left; width: " + sent_per + "%; height: 20px; background-color: blue; border: 0px'></div>" + 
				   "<div class='bar1' title='" + junk_label + "' style='float: left; width: " + junk_per + "%; height: 20px; background-color: orange; border: 0px'></div>" + 
				   "<div class='bar1' title='" + briefcase_label + "' style='float: left; width: " + briefcase_per + "%; height: 20px; background-color: maroon; border: 0px'></div>" + 
				   "<div class='bar1' title='" + other_label + "' style='float: left; width: " + other_per + "%; height: 20px; background-color: black; border: 0px'></div>";
		var clean_list = "";
		var space_details = "<div id='space_details'>" + CLIC_TO_SEE_MORE_LABEL + "</div>";

		// space usage
		inbox_space_details = getSpaceDetails(INBOX, inbox_folder_names, inbox_size); // inbox
		trash_space_details = getSpaceDetails(TRASH, trash_folder_names, trash_size); // trash
		drafts_space_details = getSpaceDetails(DRAFTS, drafts_folder_names, drafts_size); // drafts
		sent_space_details = getSpaceDetails(SENT, sent_folder_names, sent_size); // sent
		junk_space_details = getSpaceDetails(SPAM, junk_folder_names, junk_size); // spam
		briefcase_space_details = getSpaceDetails(BRIEFCASE, briefcase_folder_names, briefcase_size); // briefcase
		other_space_details = getSpaceDetails(OTHER, other_folder_names, other_size); // other

		// USER QUOTA
		var quota = appCtxt.get(ZmSetting.QUOTA);
		var quota_used = appCtxt.get(ZmSetting.QUOTA_USED);
		if ( quota_used/quota > critical_limit )
		{
			quotaIsCritical = true;
		}

		// INITIAL DATA
		var initialData = "<strong>" + SUGGESTIONS_TITLE + "</strong><br>";
		// CRITICAL WARNING
		if (quotaIsCritical) initialData += "<br><strong style='color: red'>" + CRITICAL_WARNING + "</strong><br><br>";
		// TRASH LIMIT WARNING
		var tl = quotaIsCritical ? trash_limit_per_crit : trash_limit_per
		console.log("tl: " + tl);
		console.log("tl percentage: " + trash_per);
		if (trash_per >= tl)
		{
			initialData += "<div class='alert'>" + TRASH_WARNING + "&nbsp<button id='show_trash_btn' class='btn btn-mini'>" + SHOW_MESSAGES_BUTTON + "</button>&nbsp<button id='show_trash_briefcase_btn' class='btn btn-mini'>" + SHOW_BRIEFCASE_BUTTON + "</button><button id='clean_trash_btn' class='btn btn-mini'>" + CLEAN_BUTTON + "</button></div>";
		}
		var dl = quotaIsCritical ? drafts_limit_per_crit : drafts_limit_per
		console.log("dl: " + dl);
		console.log("dl percentage: " + drafts_per);
		if (drafts_per >= dl)
		{
			initialData += "<div class='alert'>" + DRAFT_WARNING + "&nbsp<button id='show_drafts_btn' class='btn btn-mini'>" + SHOW_BUTTON + "</button><button id='clean_drafts_btn' class='btn btn-mini'>" + CLEAN_BUTTON + "</button></div>";
		}
		// SPAM LIMIT WARNING
		var sl = quotaIsCritical ? spam_limit_per_crit : spam_limit_per
		console.log("sl: " + sl);
		console.log("sl percentage: " + junk_per);
		if (junk_per >= sl)
		{
			initialData += "<div class='alert'>" + SPAM_WARNING + "&nbsp<button id='show_spam_btn' class='btn btn-mini'>" + SHOW_BUTTON + "</button>&nbsp<button id='clean_spam_btn' class='btn btn-mini'>" + CLEAN_BUTTON + "</button></div>";
		}
		// BRIEFCASE LIMIT WARNING
		var bl = quotaIsCritical ? briefcase_limit_per_crit : briefcase_limit_per
		console.log("bl: " + bl);
		console.log("bl percentage: " + briefcase_per);
		if (briefcase_per >= bl)
		{
			initialData += "<div class='alert'>" + BRIEFCASE_WARNING + "&nbsp<button id='show_briefcase_btn' class='btn btn-mini'>" + SHOW_BUTTON + "</button></div>";
		}

		// SET CONTENT
		app.setContent("<strong>" + USER_QUOTA_TITLE + "</strong> " + bytesToSize(quota_used) + " " + OF + " " + bytesToSize(quota) + "<br><br>" + // TODO show quota with decimals (1.4Gb instead of 1Gb)
			"<div style='background-color: lightgray; border: 1px;'>" + 
			labels2 + "<br>" + bars2 + "<br><br>" + 
			space_details +	"</div><br><br><br><br>" + 
			// "<div style='background-color: lightgray; border: 1px;'><br>" + clean_list + "</div><br><br>" + 
			"<div id='suggestions' style='background-color: lightgray; border: 1px;'>" + initialData + "</div>");

		// effect
		firstBarEffect();

		// scrollbar workaroundCannot assign requested address
		$("#z_shell").css("overflow-y", "auto");
		$("#skin_tr_top").click(function(){
			$("#z_shell").css("overflow-y", "hidden");
		});

		// -------------------------------------------------------------------------------------------------
		// send search requests
		this._submitSOAPRequestJSON('SearchHeaviest', 'zimbra');
		this._submitSOAPRequestJSON('SearchOldest', 'zimbra');
		this._submitSOAPRequestJSON('SearchUnread', 'zimbra');
		// -------------------------------------------------------------------------------------------------
	}
};

var inboxResponseJSON = function(result) {
	$("#space_details").html('blablabla');
};

/**
 * Handles the SOAP error response.
 * 
 * @param	{ZmCsfeException}		ex		the exception
 * @private
 */
zimtransfer_HandlerObject.prototype._handleSOAPErrorResponseJSON =
function(ex) {

	var errorMsg = ex.getErrorMsg(); // the error message
	var dump = ex.dump(); // the complete error dump

};

