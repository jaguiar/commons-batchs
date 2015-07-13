/** To execute this script use the shell command:
 *      mongo <mongoServer>:<mongoPort> mongoDB_purge.js  
 * to purge all values older than 15 days (defaultValue) in collection "collection" (defaultValue) of DB "test" (default value) without any dbRepair:
 *   mongo <mongoServer>:<mongoPort>/test --verbose mongoDB_purge.js
 * to purge and repair with the specified "dbName", "collectionName", "purgeRequest" and enabling "repairDatabase":
 *   mongo <mongoServer>:<mongoPort>/<dbName> --verbose --eval "var collectionName='<collectionName>'; var purgeRequest=<mongo request>; var repairDatabase=true" mongoDB_purge.js
 *****
 * Example : mongo 10.98.208.150:50000 --eval "var collectionName='zouzoupette'; var repairDatabase=true; var purgeRequest={ 'req_date' : { '\$lt' : ISODate('2015-06-28T13:47:20.055Z') } }" mongoDB_purge.js 
 */

print("Starting purge script...");
var dateMinus15Days = new Date(Date.now() - ((24 * 60 * 60 * 1000) * 15)); // now - 15 days 
print("date=" + dateMinus15Days.toISOString());
var collection = typeof collectionName !== 'undefined' ? collectionName : "collection";
print("Collection to purge= " + collection);

var pRequest = typeof purgeRequest !== 'undefined' ? purgeRequest : { 'req_date' : { $lt: ISODate(dateMinus15Days.toISOString()) } };
print("purgeRequest= " + tojson(pRequest));

var repairDB = typeof repairDatabase !== 'undefined' ? repairDatabase : false;
print("Repair Database? " + repairDB);

/**
 * Purge
 */
print("Starting purge...");
var writeResults = db.getCollection(collection).remove(pRequest);
print("Purge ended, number of items removed=" + writeResults.nRemoved);

/**
 * Repair Database
 */
if(repairDB){
 print("repairDatabase enabled, repairing...(this may take some time)"); 
 db.repairDatabase();
 print("repairDatabase ended");
}
print ("End of purge script...");
