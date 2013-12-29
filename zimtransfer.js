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
oldestIds = new Array(); // comma separated ids of oldest messages

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
		appCtxt.getSearchController().search({userInitiated: true, query: 'before:' + aYearAgo.toLocaleDateString(), sortBy: 'dateAsc', types:_types});
		// var aYearAgo = today.getDate() + '/' + (today.getMonth() + 1) + '/' + (today.getFullYear() - 1);
	});

	$(document).on('click', '#export_oldest_btn', function(){
		var aYearAgo = getAYearAgo();
		// hidden iframe triggers download
		$(".DwtComposite").append("<iframe id='downloadFrame' style='display:none'></iframe>");
		var iframe = document.getElementById("downloadFrame");
		iframe.src = "https://localhost/home/" + appCtxt.getUsername() + "/?fmt=zip&query=before:" + aYearAgo.toLocaleDateString();
		// Create tag
		zimtransfer_HandlerObject.prototype._submitSOAPRequestJSON('CreateTag', 'zimbraMail', 'Before-' + aYearAgo.toLocaleDateString() + 
			'-' + aYearAgo.getHours() + aYearAgo.getMinutes() + aYearAgo.getSeconds());
		console.log(oldestIds);
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
				// toolbar.setContent("<button onClick=empty_trash()>Empty trash</button>");

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
		var jsonObj = {SearchRequest:{_jsns:"urn:zimbraMail", limit: '0', types: 'conversation', sortBy: 'dateDesc'}};
		var aYearAgo = getAYearAgo();
		console.log("AYEARAGO: " + aYearAgo);
		jsonObj.SearchRequest.query = 'before:' + aYearAgo.toLocaleDateString();
	}	
	else if (type == 'SearchUnread')
	{
		var jsonObj = {SearchRequest:{_jsns:"urn:zimbraMail", limit: '101', types: 'conversation', sortBy: 'dateAsc'}};
		jsonObj.SearchRequest.query = 'is:unread';
	}
	else if (type == "CreateTag")
	{
		var jsonObj = {CreateTagRequest:{_jsns:"urn:zimbraMail", tag: {color: Math.floor(Math.random()*7), name: params}}};
	}
	else if (type == "TagConv")
	{
		// TODO DIVIDIR EL ARRAY EN GRUPOS DE 1000 Y LANZARLOS A PLAZOS!! (a mano, pues no encuentro la manera de hacerlo con la API)
		console.log("oldestIds: " + oldestIds.toString());
		var jsonObj = {ConvActionRequest:{_jsns:"urn:zimbraMail", action: {id: oldestIds.toString(), op: "tag", tn: params['name']}}};
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
	traverse(response, process);
	return result_size;
}

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
}

// returns the date a year ago
function getAYearAgo()
{
	var today = new Date();
	var aYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate(), today.getHours(), today.getMinutes(), today.getSeconds());
	return aYearAgo;
}

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
			title = "Heaviest messages";
			// check condition
			heaviest_size = getResponseSize(response);
			// for (i in response.c)
			// {
			// 	heaviest_size += parseInt(response.c[i].sf);
			// }
			console.log("heaviest size: " + heaviest_size);
			console.log("total size: " + total_size);
			console.log("percentage: " + (heaviest_size/total_size));

			var percentage = heaviest_size/total_size;
			// trigger condition: 20 heaviest messages take up more than 7% of space
			if (percentage > 0.07)
			{
				body = "<div class='alert'><span class='icon-warning-sign'></span>Your heavy messages take up too much space&nbsp<button id='show_heaviest_btn' class='btn btn-mini'>Show</button>&nbsp<button id='export_heaviest_btn' class='btn btn-mini'>Export and tag</button><span class='icon icon-question-sign' title='Export and tag messages..'></span></div>"; // TODO more descriptive title
				$("#suggestions").append("<strong>" + title + "</strong><br>" + body + "<br>");
			}
		}
		else if (response.sortBy == 'dateDesc')
		{
			title = "Oldest messages";
			// check condition
			oldest_size = getResponseSize(response);
			// for (i in response.c)
			// {
			// 	oldest_size += parseInt(response.c[i].sf);
			// }
			console.log("oldest size: " + oldest_size);
			console.log("total size: " + total_size);
			console.log("percentage: " + (oldest_size/total_size));
			var percentage = oldest_size/total_size;
			oldestIds = getResponseIds(response);
			// trigger condition: messages oldest than 1 year take up more than 50% of space
			// if (percentage > 0.5)
			if (true)
			{
				body = "<div class='alert'><span class='icon-warning-sign'></span>Your old messages take up too much space&nbsp<button id='show_oldest_btn' class='btn btn-mini'>Show</button>&nbsp<button id='export_oldest_btn' class='btn btn-mini'>Export and tag</button><span class='icon icon-question-sign' title='Export and tag messages...	'></span></div>";
				$("#suggestions").append("<strong>" + title + "</strong><br>" + body + "<br>");
			}			
		}
		else if (response.sortBy == 'dateAsc')
		{
			title = "Unread messages";
			// title += response.c.length;
			// check condition
			if (response.c.length > 100) {
				// action
				body = "<div class='alert'><span class='icon-warning-sign'></span>You have too many unread messages</div>Solution: See unread messages<br>You can use filters in order to automatically deal with incoming messages. See Preferences > Filters";
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

		// var suggestions = "<br><br>Heaviest messages<br>";
		// for (var i in response.SearchResponse[0].c)
		// {
		// 	suggestions += "<input id=" + response.SearchResponse[0].c[i].m[0]['id'] + " type='checkbox'>" + response.SearchResponse[0].c[i].m[0]['id'] + "</input>&nbsp" + response.SearchResponse[0].c[i].su + " " + response.SearchResponse[0].c[i].m[0]['s'] + "<br>";
		// }

		// var labels1 = "<strong>Total space</strong> | <span style='color: green'>Used space " + used_per.toFixed(1) + "%</span>";
		// var bars1 = "<div title='inbox' style='float: left; width: " + used_per + "%; height: 20px; background-color: green; border: 0px'></div>" + 
		// 		   "<div title='trash' style='float: left; width: " + 100 - used_per + "%; height: 20px; background-color: white; border: 0px'></div>";

		var labels2 = "<strong>Used space details</strong> | <span id='inbox' href='#' style='color: red'>Inbox " + inbox_per.toFixed(1) + "%</span> | <span id='trash' href='#' style='color: black'>Trash " + trash_per.toFixed(1) + "%</span> | <span id='drafts' href='#' style='color: deeppink'>Drafts " + drafts_per.toFixed(1) + "%</span>" + 
					 " | <span id='sent' href='#' style='color: blue'>Sent " + sent_per.toFixed(1) + "%</span> | <span id='spam' href='#' style='color: orange'>Spam " + junk_per.toFixed(1) + "%</span> | <span id='briefcase' href='#' style='color: maroon'>Briefcase " + briefcase_per.toFixed(1) + "%</span> | <span id='other' href='#' style='color: green'>Other " + other_per.toFixed(1) + "%</span>";
		var bars2 = "<div class='bar1' title='inbox' style='float: left; width: " + inbox_per + "%; height: 20px; background-color: red; border: 0px'></div>" + 
				   "<div class='bar1' title='trash' style='float: left; width: " + trash_per + "%; height: 20px; background-color: black; border: 0px'></div>" + 
				   "<div class='bar1' title='drafts' style='float: left; width: " + drafts_per + "%; height: 20px; background-color: deeppink; border: 0px'></div>" + 
				   "<div class='bar1' title='sent' style='float: left; width: " + sent_per + "%; height: 20px; background-color: blue; border: 0px'></div>" + 
				   "<div class='bar1' title='spam' style='float: left; width: " + junk_per + "%; height: 20px; background-color: orange; border: 0px'></div>" + 
				   "<div class='bar1' title='briefcase' style='float: left; width: " + briefcase_per + "%; height: 20px; background-color: maroon; border: 0px'></div>" + 
				   "<div class='bar1' title='other folders' style='float: left; width: " + other_per + "%; height: 20px; background-color: green; border: 0px'></div>";
		var clean_list = 
		"<table class='table table-striped'>" + 
			"<tr>" + 
				"<td><strong>Select what you want to clean</strong></td>" + 
				"<td><strong>Size</strong></td>" + 
				"<td></td>" + 
			"</tr>" + 		
			"<tr>" + 
				"<td>Trash</td>" + 
				"<td>" + trash_size + "</td>" + 
				"<td><button class='btn btn-mini' onClick=empty_trash()>Clean</button></td>" + 
			"</tr>" + 
			"<tr>" + 
				"<td>Drafts</td>" + 
				"<td>" + drafts_size + "</td>" + 
				"<td><button class='btn btn-mini' onClick=empty_drafts()>Clean</button></td>" + 
			"</tr>" + 
			"<tr>" + 
				"<td>Briefcase</td>" + 
				"<td>" + briefcase_size + "</td>" + 
				"<td><button class='btn btn-mini' onClick=empty_briefcase()>Clean</button></td>" + 
			"</tr>" + 
		"</table>";
		
		var space_details = "<div id='space_details'>Click on an element to see more</div>";

		// inbox space usage
		inbox_space_details = getSpaceDetails("Inbox", inbox_folder_names, inbox_size);
		// trash space usage
		trash_space_details = getSpaceDetails("Trash", trash_folder_names, trash_size);
		// drafts space usage
		drafts_space_details = getSpaceDetails("Drafts", drafts_folder_names, drafts_size);
		// sent space usage
		sent_space_details = getSpaceDetails("Sent", sent_folder_names, sent_size);
		// spam space usage
		junk_space_details = getSpaceDetails("Spam", junk_folder_names, junk_size);
		// briefcase space usage
		briefcase_space_details = getSpaceDetails("Briefcase", briefcase_folder_names, briefcase_size);
		// other space usage
		other_space_details = getSpaceDetails("Other folders", other_folder_names, other_size);

		// INITIAL DATA
		var initialData = "<strong>Suggestions</strong><br>";

		if (trash_per >= 10)
		{
			initialData += "Parece que tienes la papelera bastante llena.<br>";
		}
		if (drafts_per >= 10)
		{
			initialData += "Parece que tienes muchos borradores.<br>";
		}
		if (junk_per >= 10)
		{
			initialData += "Parece que tienes muchos correos basura.<br>";
		}
		if (briefcase_per >= 10)
		{
			initialData += "Parece que tu maletín ocupa mucho espacio.<br>";
		}

		// SET CONTENT
		app.setContent("<div style='background-color: lightgray; border: 1px;'>" + 
			labels2 + "<br>" + bars2 + "<br><br>" + 
			space_details +	"</div><br><br><br><br>" + 
			"<div style='background-color: lightgray; border: 1px;'><br>" + clean_list + "</div><br><br>" + 
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

function getSpaceDetails(name, folders, total_size)
{
	var space_details = null;
	var labels = "<strong>" + name + " space usage</strong>";
	var bars = "";
	var colors = ["red", "blue", "coral", "green", "darkblue", "orange", "maroon", "olive", "lime", "purple"];

	// sort folders by size
	// var ordered_folders =  [];
	// var ordered_folders = Object.keys(folders).sort(function(b,a){return a-b});
	// var ordered_folders = Object.values(folders);
	
	// var array_keys = new Array();
	// var array_values = new Array();

	// for (var key in folders) {
	//     array_keys.push(key);
	//     array_values.push(folders[key]);
	// }

	// alert(array_keys);
	// alert(array_values);

	// var ordered_values = array_values.sort(function(b,a){return a-b});
	// alert(ordered_values);

	// var x=document.getElementById("demo");
	// x.innerHTML=size;
	// }

	// sort folders by size
	var tuples = [];
	var ordered_folders = {};

	for (var key in folders) tuples.push([key, folders[key]]);

	tuples.sort(function(a, b) {
	    a = a[1];
	    b = b[1];

	    return a > b ? -1 : (a < b ? 1 : 0);
	});

	for (var i = 0; i < tuples.length; i++) {
	    var key = tuples[i][0];
	    var value = tuples[i][1];

	    // do something with key and value
	    ordered_folders[key] = value;
	}

	// fill labels and bars with data
	for (var i in Object.keys(ordered_folders))
	{
		if (i > 9) 
		{
			// TODO añadir espacio ocupado a 'otros'
		}
		else
		{
			labels += " | <span style='color: " + colors[i] + "'>" + Object.keys(ordered_folders)[i].split(' ').join('_') + ": " + ((ordered_folders[Object.keys(ordered_folders)[i]]/total_size)*100).toFixed(1) + "%</span>";
			bars += "<div class='bar2' title=" + Object.keys(ordered_folders)[i].split(' ').join('_') + " style='float: left; width: " + (ordered_folders[Object.keys(ordered_folders)[i]]/total_size)*100 + "%; height: 20px; background-color:" + colors[i] + "; border: 0px'></div>";
		}
		// bars += (ordered_folders[Object.keys(ordered_folders)[i]]/total_size)*100;
		// bars += Object.keys(ordered_folders)[i] + " " + ordered_folders[Object.keys(ordered_folders)[i]] + "<br>";
	}
	space_details = labels + "<br>" + bars;

	return space_details;
};

function firstBarEffect()
{
	$(".bar1").hide();
	$(".bar1").show("slow");
}

function secondBarEffect()
{
	$(".bar2").hide();
	$(".bar2").show("slow");
}