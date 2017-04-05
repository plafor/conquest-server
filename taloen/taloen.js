/**
 * TalOen is a self created API designed like GraphQL API used to get and set data quickly and easily
 */

/**
 * External Module dependencies.
 */
const _ = require('lodash');
// Print console
const winston = require('winston');
// Class for TalOen
const convert = require('./convertTL');
//DataBase
const low = require('lowdb');
const fileSync = require('lowdb/lib/file-sync');
const db = low('db.json', { storage: fileSync });

const classe = require('./classe');

function getData(query) {
	let data = "";

	//It is to server timer
	//var date = new Date();
	//console.log(date);
	//let listKey = ["player", "name"];
	//let listValue = [["jerem", 0, 0, null], "Red"]
	//console.log(classe.setValue(query, listKey, listValue));

	winston.info('Function getData() called with query: ' + query);

	if(query == "{team{*player}}")
		data += classe.getValueUsed('team', ['player'], false);
	if(query == "{team}")
		return classe.getValue('team');
  if(query == "{spot}")
		return classe.getValueUsed('team', ['spot'], true);
	if(query == "{endTime}")
		return JSON.stringify(new Date()) + classe.getValue('endTime');
	if (query == "{question}")
		return classe.getQuestionRandom();
	if(query == '{spot:"Dormerie"{state}}')
		data += classe.statement(2);
	if(query == '{spot:"Parking"{state}}')
		data += classe.statement(1);
	if(query == '{spot:"Département Informatique"{state}}')
		data += classe.statement(0);
	if(query == "{team spot}") {
		data += JSON.stringify(classe.getValue('team')) + ",";
		data += JSON.stringify(classe.getValueUsed('team', ['spot'], true));
	}

	winston.info('LISTE :' + JSON.stringify(data));

	//query = stringifyQuery(query);

    //convert.verifSyntax(query);

	//if (data == "") {
	//	data = "error";
	//}
	return data;
}

exports.getData = getData;
