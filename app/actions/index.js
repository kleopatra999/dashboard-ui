/**
 * Created by Darkstar on 12/2/2016.
 */

import {xhrDashBoardClient, xhrAccountsClient, xhrCBClient} from '../xhrClient';
import {loadState, deleteAllCookies} from '../helper';
import {browserHistory} from 'react-router';
import {twoCheckoutCredentials,cloudBoostAPI} from '../config';
import Alert from 'react-s-alert';

export function showAlert(type,text){
    Alert[type](text, {
        position: 'top-right',
        effect: 'slide',
        timeout: 5000
    });
}

export function fetchApps() {

    return function (dispatch) {
        xhrDashBoardClient.get('app')
            .then(response => {
                dispatch({
                    type: 'FETCH_APPS',
                    payload: response.data
                });

                let appIdArray = response.data.map((app) => app.appId);
                dispatch(getAnalyticsData(appIdArray));
            })
            .catch(error => {
                console.log('inside fetch Apps error catch error: ');
                console.log(error);
            });

    };
}

export const addApp = (name) => {
    return function (dispatch) {
        xhrDashBoardClient.post('/app/create', {"name": name})
            .then(response => {
                console.log(response);
                dispatch({
                    type: 'ADD_APP',
                    payload: response.data
                });
            })
            .catch(error => {
                console.log('inside fetch Apps error catch error: ');
                console.log(error);
            });
    };
};

export const saveAppName = (appId, name) => {

    return function (dispatch) {
        xhrDashBoardClient.put('/app/' + appId, {"name": name})
            .then(response => {
                dispatch({
                    type: 'SAVE_APP_NAME',
                    payload: {
                        appId: appId,
                        name: name
                    }
                });
            })
            .catch(error => {
                console.log('inside saveAppName error catch error: ');
                console.log(error);
            });
    };
};

export const logOut = () => {

    return function (dispatch) {
        xhrAccountsClient.post('/user/logout')
            .then(response => {
                console.log(response);
                localStorage.removeItem('state');
                deleteAllCookies();
                dispatch({
                    type: 'LOGOUT'
                });
            })
            .catch(error => {
                console.log('inside Logout catch error: ');
                console.log(error);
            });
    };
};

export const fetchDevDetails = (IdArray) => {
    console.log("fetchDevDetails");
    console.log(IdArray);
    return function (dispatch) {
        xhrAccountsClient.post('user/list', {IdArray: IdArray})
            .then(response => {
                dispatch({
                    type: 'RECEIVE_USERS',
                    payload: response.data
                });
            })
            .catch(error => {
                console.log('inside fetchDevDetails catch error: ');
                console.log(error);
            });
    };
};

export const sendInvitation = (appId, email) => {
    console.log("inviting:");
    console.log(appId + " " + email);
    return function (dispatch) {
        xhrDashBoardClient.post('/app/' + appId + '/invite', {"email": email})
            .then(response => {
                dispatch({
                    type: 'SAVE_INVITE',
                    payload: {
                        appId: appId,
                        email: email
                    }
                });
            })
            .catch(error => {
                console.log('inside sendInvite error catch error: ');
                console.log(error);
            });
    };
};

export const deleteDev = (appId, userId) => {
    return function (dispatch) {
        xhrDashBoardClient.delete('/app/' + appId + '/removedeveloper/' + userId)
            .then(response => {
                dispatch({
                    type: 'DELETE_DEV',
                    payload: {appId: appId, invited: response.data.developers}
                });
            })
            .catch(error => {
                console.log('inside delete dev error catch error: ');
                console.log(error);
            });
    };
};

export const deleteInvite = (appId, email) => {
    return function (dispatch) {
        xhrDashBoardClient.post('/app/' + appId + '/removeinvitee', {email: email})
            .then(response => {
                dispatch({
                    type: 'DELETE_INVITE',
                    payload: {appId: appId, invited: response.data.invited}
                });
            })
            .catch(error => {
                console.log('inside delete invite error catch error: ');
                console.log(error);
            });
    };
};

export const genMasterKey = (appId) => {
    return function (dispatch) {
        xhrDashBoardClient.get('/app/' + appId + '/change/masterkey')
            .then(response => {
                dispatch({
                    type: 'GEN_MASTER',
                    payload: {appId: appId, masterKey: response.data}
                });
            })
            .catch(error => {
                console.log('inside genMasterKey action error catch error: ');
                console.log(error);
            });
    };
};

export const genClientKey = (appId) => {
    return function (dispatch) {
        xhrDashBoardClient.get('/app/' + appId + '/change/clientkey')
            .then(response => {
                dispatch({
                    type: 'GEN_CLIENT',
                    payload: {appId: appId, clientKey: response.data}
                });
            })
            .catch(error => {
                console.log('inside genClientKey action error catch error: ');
                console.log(error);
            });
    };
};

export const deleteApp = (appId) => {
    return function (dispatch) {
        xhrDashBoardClient.delete('/app/' + appId)
            .then(response => {
                dispatch({
                    type: 'DELETE_APP',
                    payload: {appId: appId}
                });
            })
            .catch(error => {
                console.log('inside delete app error catch error: ');
                console.log(error);
            });
    };
};

export const manageApp = (appId, masterKey, name) => {
    return function (dispatch) {
        // init CloudApp for current application
        CB.CloudApp.init(SERVER_URL,appId,masterKey)
        dispatch({
            type: 'MANAGE_APP',
            payload: {appId: appId, masterKey: masterKey, name: name}
        });
        browserHistory.push('/tables');
    };
};

export function fetchTables(appId, masterKey) {

    return function (dispatch) {
        xhrCBClient.post('/app/' + appId + '/_getAll', {key: masterKey})
            .then(response => {
                if (response.data)
                    dispatch({
                        type: 'FETCH_TABLES',
                        payload: {appId: appId, tables: response.data}
                    });
            })
            .catch(error => {
                console.log('inside fetch Tables error catch error: ');
                console.log(error);
            });

    };
}

export function createTable(appId, masterKey, tableName) {
    return function (dispatch) {
        xhrCBClient
            .put(
                '/app/' + appId + '/' + tableName,
                {
                    key: masterKey,
                    "data": {
                        "name": tableName,
                        "appId": appId,
                        "_type": "table",
                        "type": "custom",
                        "maxCount": 9999,
                        "columns": [{
                            "name": "id",
                            "_type": "column",
                            "dataType": "Id",
                            "required": true,
                            "unique": true,
                            "relatedTo": null,
                            "relationType": null,
                            "isDeletable": false,
                            "isEditable": false,
                            "isRenamable": false,
                            "editableByMasterKey": false
                        }, {
                            "name": "expires",
                            "_type": "column",
                            "dataType": "DateTime",
                            "required": false,
                            "unique": false,
                            "relatedTo": null,
                            "relationType": null,
                            "isDeletable": false,
                            "isEditable": false,
                            "isRenamable": false,
                            "editableByMasterKey": false
                        }, {
                            "name": "updatedAt",
                            "_type": "column",
                            "dataType": "DateTime",
                            "required": true,
                            "unique": false,
                            "relatedTo": null,
                            "relationType": null,
                            "isDeletable": false,
                            "isEditable": false,
                            "isRenamable": false,
                            "editableByMasterKey": false
                        }, {
                            "name": "createdAt",
                            "_type": "column",
                            "dataType": "DateTime",
                            "required": true,
                            "unique": false,
                            "relatedTo": null,
                            "relationType": null,
                            "isDeletable": false,
                            "isEditable": false,
                            "isRenamable": false,
                            "editableByMasterKey": false
                        }, {
                            "name": "ACL",
                            "_type": "column",
                            "dataType": "ACL",
                            "required": true,
                            "unique": false,
                            "relatedTo": null,
                            "relationType": null,
                            "isDeletable": false,
                            "isEditable": false,
                            "isRenamable": false,
                            "editableByMasterKey": false
                        }]
                    }
                }
            )
            .then(response => {
                if (response.data)
                    dispatch({
                        type: 'ADD_TABLE',
                        payload: {appId: appId, newTable: response.data}
                    });
            })
            .catch(error => {
                console.log('inside add table error catch error: ');
                console.log(error);
            });

    };
}

export function deleteTable(appId, masterKey, tableName) {
    console.log("inside delete table action creator");
    return function (dispatch) {
        xhrCBClient
            .put(
                '/app/' + appId + '/' + tableName,
                {
                    key: masterKey,
                    method: "DELETE",
                    name: tableName
                }
            )
            .then(response => {
                if (response.data)
                    dispatch({
                        type: 'DELETE_TABLE',
                        payload: {appId: appId, name: tableName}
                    });
            })
            .catch(error => {
                console.log('inside delete table error catch error: ');
                console.log(error);
            });

    };
}

export const setTableSearchFilter = (filter) => {
    return function (dispatch) {
        dispatch({
            type: 'SET_TABLE_FILTER',
            payload: filter
        });
    };
};

export const editTableNavigate = (tableId) => {
    return function (dispatch) {
        dispatch({
            type: 'TABLE_EDIT',
            payload: {tableId: tableId}
        });

        browserHistory.push('/appmanager');
    };
};

export const editTable = (tableId) => {
    return function (dispatch) {
        dispatch({
            type: 'TABLE_EDIT',
            payload: {tableId: tableId}
        });
    };
};

export function fetchCount(appId, tableName, masterKey) {

    return function (dispatch) {
        xhrCBClient
            .post('/data/' + appId + '/' + tableName + '/count',
                {
                    "query": {"$include": [], "$includeList": []},
                    "limit": 9999,
                    "skip": 0,
                    "key": masterKey
                })
            .then(response => {
                if (response.data !== 0) {
                    dispatch({
                        type: 'FETCH_COUNT',
                        payload: {rowCount: response.data}
                    });

                    dispatch(fetchRows(appId, tableName, masterKey));
                }
            })
            .catch(error => {
                console.log('inside fetch Rows error catch error: ');
                console.log(error);
            });

    };
}

export function fetchRows(appId, tableName, masterKey) {

    return function (dispatch) {
        xhrCBClient
            .post('/data/' + appId + '/' + tableName + '/find',
                {
                    "query": {"$include": [], "$includeList": []},
                    "select": {},
                    "sort": {"createdAt": -1},
                    "limit": 50,
                    "skip": 0,
                    "key": masterKey
                }
            )
            .then(response => {
                if (response.data.length > 0)
                    dispatch({
                        type: 'FETCH_ROWS',
                        payload: {rows: response.data}
                    });
            })
            .catch(error => {
                console.log('inside fetch Rows error catch error: ');
                console.log(error);
            });

    };
}

export const createSale = (appId, cardDetails, planId) => {
    return function (dispatch) {

        let args = {
            sellerId: twoCheckoutCredentials.sellerId,
            publishableKey: twoCheckoutCredentials.publishableKey,
            ccNo: cardDetails.number,
            cvv: cardDetails.cvc,
            expMonth: cardDetails.expMonth,
            expYear: cardDetails.expYear,
        };
        //TCO is a global variable defined outside in an externally linked JS and hence produces linting error,
        // which leads to issues in watching styles the way gulp tasks is configured and hence this empty object only for developement
        let TCO = TCO ? TCO : {};
        TCO.loadPubKey(twoCheckoutCredentials.mode, function () {

            TCO.requestToken(
                function (data) {
                    if (!data) {
                        console.log("Create Token failed,try again..");
                    } else {
                        let reqObj = {
                            token: data.response.token.token,
                            billingAddr: cardDetails.billing,
                            planId: planId
                        };
                        xhrDashBoardClient.post('/' + appId + '/sale', reqObj)
                            .then(response => {
                                console.log(response);
                            })
                            .catch(error => {
                                console.log('inside createSale error catch error: ');
                                console.log(error);
                            });
                    }
                },
                function (data) {
                    if (data.errorCode === 200) {
                        console.log("Opps! Something went wrong, Try again.");
                    } else {
                        console.log(data.errorMsg);
                    }
                },
                args
            );
        });
    };
};

export function getAnalyticsData(appIdArray) {
    return function (dispatch) {
        xhrDashBoardClient
            .post('/analytics/api-storage/bulk/count',
                {appIdArray: appIdArray}
            )
            .then(response => {
                dispatch({
                    type: 'RECEIVE_ANALYTICS',
                    payload: response.data
                });
            })
            .catch(error => {
                console.log('inside getAnalyticsData Apps error catch error: ');
                console.log(error);
                /* dispatch({
                 type: 'LOGOUT'
                 }); */
            });

    };
}


// cache actions 
export function fetchCache() {
    return function (dispatch) {
        CB.CloudCache.getAll().then((data)=>{
            dispatch({
                type: 'FETCH_CACHE',
                payload: data
            });
        },(err)=>{
            console.log("cache fetch error ",err);
        })

    };
}

export function createCache(cacheName) {
    return function (dispatch) {
        let cache = new CB.CloudCache(cacheName);
        cache.create().then(()=>{
            dispatch(fetchCache())
        },(err)=>{
            console.log("cache add error ",err);
        })

    };
}

export function selectCache(selectedCache) {
    return function (dispatch) {
        selectedCache.getAll().then((items)=>{
            dispatch({
                type: 'SELECT_CACHE',
                payload: { selectedCache:selectedCache,items:items }
            });
        },(err)=>{
            console.log("cache select error ",err)
        })
    };
}

export function deleteCache(selectedCache) {
    return function (dispatch) {
        selectedCache.delete().then((items)=>{
            dispatch(fetchCache())
        },(err)=>{
            console.log("cache delete error ",err)
        })
    };
}

export function clearCache(selectedCache) {
    return function (dispatch) {
        selectedCache.clear().then((items)=>{
            dispatch(fetchCache())
        },(err)=>{
            console.log("cache delete error ",err)
        })
    };
}

export function addItemToCache(selectedCache,item,value) {
    return function (dispatch) {
        selectedCache.set(item,value).then(()=>{
            dispatch(selectCache(selectedCache))
        },(err)=>{
            console.log("add item to cahce error ",err)
        })
    };
}

export function deleteItemFromCache(selectedCache,item) {
    return function (dispatch) {
        selectedCache.deleteItem(item).then(()=>{
            dispatch(selectCache(selectedCache))
        },(err)=>{
            console.log("delete item from cache error ",err)
        })
    };
}

export function resetCacheState() {
    return function (dispatch) {
        dispatch({
            type: 'RESET'
        });
    };
}

// queue actions 
export function fetchQueue() {
    return function (dispatch) {
        CB.CloudQueue.getAll({
            success : function(list){
                dispatch({
                    type: 'FETCH_QUEUE',
                    payload: list || []
                });
            }, error : function(error){
                console.log("queue fetch error ",error);
            }
        })
    };
}

export function createQueue(queueName) {
    return function (dispatch) {
        let queue = new CB.CloudQueue(queueName);
        queue.create({
            success : function(queueObject){
                dispatch(fetchQueue())
            }, error : function(error){
                console.log("queue add error ",error)
            }
        })
    }
}

export function selectQueue(selectedQueue) {
    return function (dispatch) {
        selectedQueue.getAllMessages({
            success : function(messagesList){
                dispatch({
                    type: 'SELECT_QUEUE',
                    payload: { selectedQueue:selectedQueue,items:messagesList }
                });
            }, error : function(error){
                console.log("Queue select error ",error)
            }
        })
    }
}

export function deleteQueue(selectedQueue) {
    return function (dispatch) {
        selectedQueue.delete({
            success : function(){
                dispatch(fetchQueue())
            }, error : function(error){
                console.log("queue delete error ",error)
            }
        })
    }
}

export function updateQueue(selectedQueue) {
    return function (dispatch) {
        selectedQueue.update({
            success : function(){
                dispatch(fetchQueue())
            }, error : function(error){
                console.log("queue update error ",error)
            }
        })
    };
}

export function addItemToQueue(selectedQueue,message,timeout,delay,expires) {
    return function (dispatch) {

        let queueMessage = new CB.QueueMessage()
        queueMessage.message = message
        if(timeout > 0){
            queueMessage.timeout = timeout
        }     
        if(delay > 0){
            queueMessage.delay = delay
        }     
        if(expires){
            queueMessage.expires = expires
        }
        selectedQueue.addMessage(queueMessage, {
            success : function(queueMessage){
                dispatch(selectQueue(selectedQueue))
            }, error : function(error){
                console.log("add item to queue error ",error)
            }
        })
    };
}

export function deleteItemFromQueue(selectedQueue,itemId) {
    return function (dispatch) {
        selectedQueue.deleteMessage(itemId, {
            success : function(){
                dispatch(selectQueue(selectedQueue))
            }, error : function(error){
                console.log("delete item from queue error ",error)
            }
        })
    }
}

export function updateQueueMessage(selectedQueue,selectedMessage) {
    return function (dispatch) {
        selectedQueue.updateMessage(selectedMessage, {
            success : function(){
              dispatch(selectQueue(selectedQueue)) 
            }, error : function(error){
              console.log("message update error",error)
            }
        });
    }
}

export function resetQueueState() {
    return function (dispatch) {
        dispatch({
            type: 'RESET'
        });
    };
}

//campaign actions
export function sendEmailCampaign(appId,masterKey,emailSubject,emailBody) {
    let postObject = {
        key:masterKey,
        emailBody:emailBody,
        emailSubject:emailSubject,
    }
    return xhrCBClient.post('/email/'+appId+'/campaign',postObject)
}




//analytics
export function fetchAnalyticsAPI(appId) {
    return function (dispatch) {
        xhrDashBoardClient.get('/analytics/api/'+appId+'/usage')
        .then(response => {
            dispatch({
                type: 'ANALYTICS_API',
                payload: response.data
            });
        },err => {
            console.log(err)
        })
    }
}

export function resetAnalytics() {
    return function (dispatch) {
        dispatch({
            type: 'RESET'
        });
    };
}
