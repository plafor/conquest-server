/**
 * Created by charles on 10/01/2017.
 */

/**
 * External Module dependencies.
 */
const jsonfile = require('jsonfile');
//DataBase
const low = require('lowdb');
const fileSync = require('lowdb/lib/file-sync');
const db = low('db.json', {
    storage: fileSync
})
const _ = require('lodash');


function getSpot(title) {
    return db.get('spots').find({ title: title }).value();
}
exports.getSpot = getSpot;

function spotChangeStatus(title, status) {
    const modifiedSpot = getSpot(title).status=status;
    db.get('spots').find(getSpot(title)).assign(modifiedSpot).value();
    // TODO : Broadcast
}
exports.spotChangeStatus = spotChangeStatus;

function getSpotList() {
    return db.get('spots').value();
}
exports.getSpotList = getSpotList;
