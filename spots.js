/**
 * Created by charles on 10/01/2017.
 */

const jsonfile = require('jsonfile');
//DataBase
const low = require('lowdb');
const fileSync = require('lowdb/lib/file-sync');
const db = low('db.json', {
    storage: fileSync
})
const _ = require('lodash');
db.defaults({ spots: [] }).value();

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
    console.log(db.get('spots').value());
    return db.get('spots').value();
}
exports.getSpotList = getSpotList;
