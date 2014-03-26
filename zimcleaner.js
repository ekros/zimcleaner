/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010 Zimbra, Inc.
 * 
 * The contents of this file are subject to the Zimbra Public License
 * Version 1.3 ("License"); you may not use this file except in
 * compliance with the License.  You may obtain a copy of the License at
 * http://www.zimbra.com/license.
 * 
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied.
 * ***** END LICENSE BLOCK *****
 */

// globals
tagIds = new Array();
oldestIds = new Array(); // comma separated ids of oldest messages
heaviestIds = new Array(); // comma separated ids of heaviest messages
tagName = "";
spam_limit_per = 10; // spam (junk) alarm limit percentage
trash_limit_per = 10; // trash alarm limit percentage
briefcase_limit_per = 10;
drafts_limit_per = 10;
heaviest_limit_per = 7; // heaviest items alarm limit percentage
oldest_limit_per = 50; // oldest items alarm limit percentage
unread_limit = 100; // number of unread messages alarm limit
locale = "en-US"; // default locale
VERSION = "0.5"; // version shown in the aplication

/**
 * Defines the Zimlet handler class.
 *   
 */
function zimtransfer_HandlerObject() {
};

/**
 * Makes the Zimlet class a subclass of ZmZimletBase.
 *
 */
zimtransfer_HandlerObject.prototype = new ZmZimletBase();
zimtransfer_HandlerObject.prototype.constructor = zimtransfer_HandlerObject;

/**
 * This method gets called by the Zimlet framework when the zimlet loads.
 *  
 */
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
		// var getHtml = appCtxt.get(ZmSetting.VIEW_AS_HTML);
		var _types = new AjxVector();
		_types.add("CONV");
		appCtxt.getSearchController().search({userInitiated: true, query: 'smaller:99999MB', sortBy: 'sizeDesc', limit: 20,  offset: 0, types:_types});
		// appCtxt.getSearchController().search('prueba', 'smaller:99999MB', null, {types: _types}, 'sizeDesc', 0, 20, null, false);
		// appCtxt.getSearchController().toSearch('jllopis@acb.es');
	});

	$(document).on('click', '#show_oldest_btn', function(){
		// var getHtml = appCtxt.get(ZmSetting.VIEW_AS_HTML);
		var _types = new AjxVector();
		_types.add("CONV");
		var aYearAgo = getAYearAgo();
		// TODO We need a way to limit the number of results returned by the search.. a limit param doesn't work...
		appCtxt.getSearchController().search({userInitiated: true, query: 'after:01/01/1900', sortBy: 'dateAsc', types:_types});
		// var aYearAgo = today.getDate() + '/' + (today.getMonth() + 1) + '/' + (today.getFullYear() - 1);
	});

	$(document).on('click', '#show_trash_btn', function(){
		var _types = new AjxVector();
		_types.add("CONV");
		// _types.add("BRIEFCASE_ITEM");
		appCtxt.getSearchController().search({userInitiated: true, query: 'under:trash', sortBy: 'dateAsc', types:_types});
		// console.log(appCtxt.getSearchController().getTypes({query: 'in:briefcase'}));
	});

	$(document).on('click', '#show_trash_briefcase_btn', function(){
		var _types = new AjxVector();
		_types.add("BRIEFCASE_ITEM");
		appCtxt.getSearchController().search({userInitiated: true, query: 'under:trash', sortBy: 'dateAsc', types:_types});
		// console.log(appCtxt.getSearchController().getTypes({query: 'in:briefcase'}));
	});

	$(document).on('click', '#show_spam_btn', function(){
		var _types = new AjxVector();
		_types.add("CONV");
		appCtxt.getSearchController().search({userInitiated: true, query: 'under:junk', sortBy: 'dateAsc', types:_types});
		// console.log(appCtxt.getSearchController().getTypes({query: 'in:briefcase'}));
	});

	$(document).on('click', '#clean_trash_btn', function(){
		var c = confirm("This will remove all the trash contents, including emails, contacts, appointments and briefcase documents. Are you sure to continue?");
		if (c)
		{
			zimtransfer_HandlerObject.prototype._submitSOAPRequestJSON('FolderAction', 'zimbraMail', {"op":"empty","id":"3","recursive":true});
		}
	});

	$(document).on('click', '#clean_spam_btn', function(){
		var c = confirm("This will remove the spam folder contents. Are you sure to continue?");
		if (c)
		{
			zimtransfer_HandlerObject.prototype._submitSOAPRequestJSON('FolderAction', 'zimbraMail', {"op":"empty","id":"4","recursive":true});
		}
	});

	$(document).on('click', '#export_heaviest_btn', function(){
		// var aYearAgo = getAYearAgo();
		var today = new Date();
		tagName = 'heaviest-messages-' + today.toLocaleDateString() + '-' + today.getHours() + today.getMinutes() + today.getSeconds();
		console.log("tagName: " + tagName);
		// Create tag
		tagIds = heaviestIds;
		zimtransfer_HandlerObject.prototype._submitSOAPRequestJSON('CreateTag', 'zimbraMail', tagName);
		// console.log(heaviestIds);
	});

	$(document).on('click', '#export_oldest_btn', function(){
		// var aYearAgo = getAYearAgo();
		var today = new Date();
		tagName = 'oldest-messages-' + today.toLocaleDateString() + '-' + today.getHours() + today.getMinutes() + today.getSeconds();
		console.log("tagName: " + tagName);
		// Create tag
		tagIds = oldestIds;
		zimtransfer_HandlerObject.prototype._submitSOAPRequestJSON('CreateTag', 'zimbraMail', tagName);
		console.log(tagIds);
	});
};

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
			//	app.setContent(httpGet("https://eros-ferrari.mipiso-badalona.com/home/admin/Briefcase/zimtransfer"));
/*app.setContent("<form method=POST ENCTYPE='multipart/form-data' ACTION='https://eros-ferrari.mipiso-badalona.com:7070/service/upload?fmt=raw' METHOD=POST>" +
	"<input type='file' name='the_attachment' />" +
	"<input type='hidden' name='requestId' value='my_first_attachment' />" +
	"<input type='submit' value='ship it' />" +
	"</form>");*/
				// httpGet("https://eros-ferrari.mipiso-badalona.com/home/admin/Briefcase/zimtransfer/documentation.html");

				// CARGA DE FICHEROS... USAR ESTO PARA ZIMTRANSFER
				// var up = appCtxt.getUploadDialog();
				// up.popup();

				var toolbar = app.getToolbar(); // returns ZmToolBar

				toolbar.setContent("<span style='color:red'>Zim</span>Cleaner<span class='pull-right'><small>version " + VERSION + "&nbsp<small></span>");

				var overview = app.getOverview(); // returns ZmOverview
				// overview.setContent("<b>THIS IS THE TAB APPLICATION OVERVIEW AREA</b>");

				var controller = appCtxt.getAppController();
				var appChooser = controller.getAppChooser();

				// change the tab label and tool tip
				// var appButton = appChooser.getButton(this._tabAppName);
				// appButton.setText("NEW TAB LABEL");
				// appButton.setToolTipContent("NEW TAB TOOL TIP");

				// Get mailbox info
				// this._submitSOAPRequestJSON('GetMailboxMetadata', 'zimbraMail',  {section: 'zwc:intrinsic'});
				// this._submitSOAPRequestJSON('GetAccountInfo', 'zimbraAccount', {_content: appCtxt.getUsername(), by: "name"});

  				// Get root folder and its descendants

				// Batch Request with all the data needed
				this._submitSOAPRequestJSON('Batch', 'zimbra');
				// this._submitSOAPRequestJSON('GetFolder', 'zimbraMail', {path: '/'});
				// this._submitSOAPRequestJSON('Search', 'zimbraMail');
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

// zimtransfer_HandlerObject.prototype.onSearch =
// function(search) {
// 	if (search == 'test')
// 	{
// 		alert('this is a test!!!');
// 	}	
// };

/**
* ,koiooooooooooooooooooooooooouuuuuuuuuuuuuuuuuuuuuuuuuiiiiik mkjoi98fgt65ju87
*/
    function httpGet(theUrl)
	    {
		    var xmlHttp = null;

			    xmlHttp = new XMLHttpRequest();
				    xmlHttp.open( "GET", theUrl, false );
					    xmlHttp.send( null );
						    return xmlHttp.responseText;
		}

function empty_trash()
{
	zimtransfer_HandlerObject.prototype._submitSOAPRequestJSON('FolderAction', 'zimbraMail', {"op":"empty","id":"3","recursive":true});
}

function empty_drafts()
{
	zimtransfer_HandlerObject.prototype._submitSOAPRequestJSON('FolderAction', 'zimbraMail', {"op":"empty","id":"6","recursive":true});
}

function empty_briefcase()
{
	zimtransfer_HandlerObject.prototype._submitSOAPRequestJSON('FolderAction', 'zimbraMail', {"op":"empty","id":"16","recursive":true});
}

/**
 * Submits a SOAP request in JSON format.
 * 
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
		// console.log("AYEARAGO: " + aYearAgo);
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
		// console.log("tagIds: " + tagIds.toString());
		// this.tagAction(true, tagIds[0], params['name']);
		// var current_chunk = tagIds.slice(tagChunkIndex, tagChunkIndex + 100);
		// tagChunkIndex++;
		var jsonObj = {ConvActionRequest:{_jsns:"urn:zimbraMail", action: {id: tagIds.toString(), op: "tag", tn: params['name']}}};
		// TODO you can use ItemActionRequest to tag conversations and messages or files in the briefcase
	}
	else if (type == 'Batch')
	{
		var jsonObj = {BatchRequest:{_jsns:"urn:zimbra", onerror: 'continue'}};
		request = jsonObj.BatchRequest;
		// Heaviest messages
		// request.SearchRequest = {_jsns:"urn:zimbraMail", limit: '10', types: 'conversation', sortBy: 'sizeDesc'};
		// request.SearchRequest.query = 'smaller:10000MB';
		// Oldest messages
		// request.SearchRequest = {_jsns:"urn:zimbraMail", limit: '10', types: 'conversation', sortBy: 'dateDesc'};
		// request.SearchRequest.query = 'before:01/01/2013';
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

function getResponseSize(response)
{
	var result_size = 0;

	//called with every property and it's value
	function process(key,value) {
	    if (key == 's')
	    {
	    	result_size += value;
	    }
	};

	function traverse(o,func) {
	    for (var i in o) {
	        func.apply(this,[i,o[i]]);  
	        if (typeof(o[i])=="object") {
	            //going on step down in the object tree!!
	            traverse(o[i],func);
	        }
	    }
	};

	//that's all... no magic, no bloated framework
	traverse(response, process);
	return result_size;
};

function getResponseIds(response)
{
	var idArray = new Array();
	var convArray = response.c;

	// iterate over conversations
	for (var i in convArray)
	{
    	idArray.push(convArray[i].id);
	}

	return idArray;
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
		// var condition = false;
		// TODO this is workaround to distinguish between searches
		if (response.sortBy == 'sizeDesc')
		{
			// title = "Heaviest messages";
			title = "";
			// check condition
			heaviest_size = getResponseSize(response);
			// for (i in response.c)
			// {
			// 	heaviest_size += parseInt(response.c[i].sf);
			// }
			console.log("heaviest size: " + heaviest_size);
			console.log("total size: " + total_size);
			console.log("percentage: " + (heaviest_size/total_size));
			heaviestIds = getResponseIds(response);
			console.log("heaviestIds: " + heaviestIds);

			var percentage = (heaviest_size/total_size)*100;
			// trigger condition: 20 heaviest messages take up more than 7% of space
			if (percentage > heaviest_limit_per)
			{
				body = "<div class='alert'><span class='icon-warning-sign'></span>" + HEAVIEST_WARNING + "&nbsp<button id='show_heaviest_btn' class='btn btn-mini'>" + SHOW_BUTTON + "</button>&nbsp<button id='export_heaviest_btn' class='btn btn-mini'>" + EXPORT_AND_TAG_BUTTON + "</button><span class='icon icon-question-sign' title='" + HEAVIEST_EXPORT_AND_TAG_TOOLTIP + "'></span></div>";
				$("#suggestions").append("<strong>" + title + "</strong><br>" + body + "<br>");
			}
		}
		else if (response.sortBy == 'dateAsc')
		{
			// title = "Oldest messages";
			title = "";
			// check condition
			oldest_size = getResponseSize(response);
			// for (i in response.c)
			// {
			// 	oldest_size += parseInt(response.c[i].sf);
			// }
			console.log("oldest size: " + oldest_size);
			console.log("total size: " + total_size);
			console.log("percentage: " + (oldest_size/total_size));
			var percentage = (oldest_size/total_size);
			oldestIds = getResponseIds(response);
			console.log("oldestIds: " + oldestIds);
			// trigger condition: 1000 oldest messages take up more than 50% of space
			// TODO add the following extra condition: these messages must be older than a year...
			if (percentage > oldest_limit_per)
			// if (true)
			{
				body = "<div class='alert'><span class='icon-warning-sign'></span>" + OLDEST_WARNING + "&nbsp<button id='show_oldest_btn' class='btn btn-mini'>" + SHOW_BUTTON + "</button>&nbsp<button id='export_oldest_btn' class='btn btn-mini'>" + EXPORT_AND_TAG_BUTTON + "</button><span class='icon icon-question-sign' title='" + OLDEST_EXPORT_AND_TAG_TOOLTIP + "'></span></div>";
				$("#suggestions").append("<strong>" + title + "</strong><br>" + body + "<br>");
			}			
		}
		else if (response.sortBy == 'dateDesc')
		{
			// title = "Unread messages";
			title = "";
			// title += response.c.length;
			// check condition
			if (response.c.length > unread_limit) {
				// action
				body = "<div class='alert'><span class='icon-warning-sign'></span>" + UNREAD_WARNING + "</div>" + UNREAD_ADVICE;
				$("#suggestions").append("<strong>" + title + "</strong><br>" + body + "<br>");
			}
		}

		// var suggestions = "";
		// var total_result_size = 0;
		// for (var i in response.c)
		// {
		// 	suggestions += "<input id=" + response.c[i]['id'] + " type='checkbox'>" + response.c[i]['id'] + "</input>&nbsp" + response.c[i].su + " " + parseInt(response.c[i].sf) + "<br>";
		// 	total_result_size += parseInt(response.c[i].sf);
		// 	if (i == 10)
		// 	{
		// 		break;
		// 	}
		// }
		// $("#suggestions").append("<strong>" + title + "</strong><br>" + suggestions + "<br>Total size: " + total_result_size + "<br>");
	}
	else if (result.getResponse().CreateTagResponse != null)
	{
		// console.log("respuesta createtag");
		// console.log(result.getResponse().CreateTagResponse);
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
			// if (key == 'name')
			// {
			// 	var name = value;
			// }
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

		// app.setContent("Tamaño ocupado por <strong>" + inbox_name + "</strong>: " + inbox_size + "<br>" + 
		// 				"Tamaño ocupado por <strong>" + trash_name + "</strong>: " + trash_size + "<br>" + 
		// 				"Tamaño ocupado por <strong>" + drafts_name + "</strong>: " + drafts_size + "<br>" + 
		// 				"Tamaño ocupado por <strong>" + sent_name + "</strong>: " + sent_size + "<br>" + 
		// 				"Tamaño ocupado por <strong>" + junk_name + "</strong>: " + junk_size + "<br>" + 
		// 				"Tamaño ocupado por <strong>" + briefcase_name + "</strong>: " + briefcase_size + "<br>" + 
		// 				"Tamaño ocupado por <strong>" + other_name + "</strong>: " + other_size + "<br>" + 
		// 				"Tamaño total <strong>" + "</strong>: " + total_size);

		// TODO show total space versus available space in the account

		var inbox_per = (inbox_size/total_size)*100;
		var trash_per = (trash_size/total_size)*100;
		var drafts_per = (drafts_size/total_size)*100;
		var sent_per = (sent_size/total_size)*100;
		var junk_per = (junk_size/total_size)*100;
		var briefcase_per = (briefcase_size/total_size)*100;
		var other_per = (other_size/total_size)*100;
		// var used_per = (total_size/mailbox_size)*100;

		var inbox_label = INBOX + " " + bytesToSize(inbox_size) + " (" + inbox_per.toFixed(1) + "%)";
		var trash_label = TRASH + " " + bytesToSize(trash_size) + " (" + trash_per.toFixed(1) + "%)";
		var drafts_label = DRAFTS + " " + bytesToSize(drafts_size) + " (" + drafts_per.toFixed(1) + "%)";
		var sent_label = SENT + " " + bytesToSize(sent_size) + " (" + sent_per.toFixed(1) + "%)";
		var junk_label = SPAM + " " + bytesToSize(junk_size) + " (" + junk_per.toFixed(1) + "%)";
		var briefcase_label = BRIEFCASE + " " + bytesToSize(briefcase_size) + " (" + briefcase_per.toFixed(1) + "%)";
		var other_label = OTHER + " " + bytesToSize(other_size) + " (" + other_per.toFixed(1) + "%)";

		// var suggestions = "<br><br>Heaviest messages<br>";
		// for (var i in response.SearchResponse[0].c)
		// {
		// 	suggestions += "<input id=" + response.SearchResponse[0].c[i].m[0]['id'] + " type='checkbox'>" + response.SearchResponse[0].c[i].m[0]['id'] + "</input>&nbsp" + response.SearchResponse[0].c[i].su + " " + response.SearchResponse[0].c[i].m[0]['s'] + "<br>";
		// }

		// var labels1 = "<strong>Total space</strong> | <span style='color: green'>Used space " + used_per.toFixed(1) + "%</span>";
		// var bars1 = "<div title='inbox' style='float: left; width: " + used_per + "%; height: 20px; background-color: green; border: 0px'></div>" + 
		// 		   "<div title='trash' style='float: left; width: " + 100 - used_per + "%; height: 20px; background-color: white; border: 0px'></div>";

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
		// "<table class='table table-striped'>" + 
		// 	"<tr>" + 
		// 		"<td><strong>Select what you want to clean</strong></td>" + 
		// 		"<td><strong>Size</strong></td>" + 
		// 		"<td></td>" + 
		// 	"</tr>" + 		
		// 	"<tr>" + 
		// 		"<td>Trash</td>" + 
		// 		"<td>" + trash_size + "</td>" + 
		// 		"<td><button class='btn btn-mini' onClick=empty_trash()>Clean</button></td>" + 
		// 	"</tr>" + 
		// 	"<tr>" + 
		// 		"<td>Drafts</td>" + 
		// 		"<td>" + drafts_size + "</td>" + 
		// 		"<td><button class='btn btn-mini' onClick=empty_drafts()>Clean</button></td>" + 
		// 	"</tr>" + 
		// 	"<tr>" + 
		// 		"<td>Briefcase</td>" + 
		// 		"<td>" + briefcase_size + "</td>" + 
		// 		"<td><button class='btn btn-mini' onClick=empty_briefcase()>Clean</button></td>" + 
		// 	"</tr>" + 
		// "</table>";
		
		var space_details = "<div id='space_details'>" + CLIC_TO_SEE_MORE_LABEL + "</div>";

		// inbox space usage
		inbox_space_details = getSpaceDetails(INBOX, inbox_folder_names, inbox_size);
		// trash space usage
		trash_space_details = getSpaceDetails(TRASH, trash_folder_names, trash_size);
		// drafts space usage
		drafts_space_details = getSpaceDetails(DRAFTS, drafts_folder_names, drafts_size);
		// sent space usage
		sent_space_details = getSpaceDetails(SENT, sent_folder_names, sent_size);
		// spam space usage
		junk_space_details = getSpaceDetails(SPAM, junk_folder_names, junk_size);
		// briefcase space usage
		briefcase_space_details = getSpaceDetails(BRIEFCASE, briefcase_folder_names, briefcase_size);
		// other space usage
		other_space_details = getSpaceDetails(OTHER, other_folder_names, other_size);

		// INITIAL DATA
		var initialData = "<strong>" + SUGGESTIONS_TITLE + "</strong><br>";

		if (trash_per >= trash_limit_per)
		{
			initialData += "<div class='alert'><span class='icon-warning-sign'></span>" + TRASH_WARNING + "&nbsp<button id='show_trash_btn' class='btn btn-mini'>" + SHOW_MESSAGES_BUTTON + "</button>&nbsp<button id='show_trash_briefcase_btn' class='btn btn-mini'>" + SHOW_BRIEFCASE_BUTTON + "</button><button id='clean_trash_btn' class='btn btn-mini'>Clean</button></div>";
		}
		if (drafts_per >= drafts_limit_per)
		{
			// initialData += "Parece que tienes muchos borradores.<br>"; // TODO in 0.6 version
		}
		if (junk_per >= spam_limit_per)
		{
			initialData += "<div class='alert'><span class='icon-warning-sign'></span>" + SPAM_WARNING + "&nbsp<button id='show_spam_btn' class='btn btn-mini'>" + SHOW_BUTTON + "</button>&nbsp<button id='clean_spam_btn' class='btn btn-mini'>Clean</button></div>";
		}
		if (briefcase_per >= briefcase_limit_per)
		{
			// TODO in 0.6 version
			// initialData += "<div class='alert'><span class='icon-warning-sign'></span>Your briefcase takes up too much space'></div>";
		}

		// USER QUOTA
		var quota = appCtxt.get(ZmSetting.QUOTA);
		var quota_used = appCtxt.get(ZmSetting.QUOTA_USED);

		// SET CONTENT
		app.setContent("<strong>" + USER_QUOTA_TITLE + "</strong> " + bytesToSize(quota_used) + " " + OF + " " + bytesToSize(quota) + "<br>" + // TODO show quota with decimals (1.4Gb instead of 1Gb)
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

		// send search requestsCannot assign requested address
		this._submitSOAPRequestJSON('SearchHeaviest', 'zimbra');
		this._submitSOAPRequestJSON('SearchOldest', 'zimbra');
		this._submitSOAPRequestJSON('SearchUnread', 'zimbra');
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

String.prototype.beginsWith = function (string) {
    return(this.indexOf(string) === 0);
};

