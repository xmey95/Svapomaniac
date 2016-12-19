(function () {
    'use strict';

    angular
        .module('actionQueueService', [])
        .factory('actionQueueService', actionQueueService);

    actionQueueService.$inject = ['executorFactory', 'notifyService', '$timeout', '$log'];

    function actionQueueService(executorFactory, notifyService, $timeout, $log) {
        var ret = {};
        var queues = [];
        var jobId = 0;

        var addNewQueue = function addNewQueue() {
            queues.push({
                status: ret.QUEUE_STATUS_IDLE,
                actions: [],
                jobId: 0,
                progress: {
                    unfinished: 0,
                    finished: 0,
                    errors: 0,
                    class: 'text-muted',
                    getInfoText: function getInfoText() {
                        return this.finished + ' / ' + (this.finished + this.unfinished);
                    }
                }
            });
        };

        var getQueueStatus = function getQueueStatus(queueIndex) {
            return getQueue(queueIndex).status;
        };

        var getQueueProgress = function getQueueProgress(queueIndex) {
            return getQueue(queueIndex).progress;
        };

        var calcQueueProgress = function calcQueueProgress() {
            for (var queueIndex = 0; queueIndex < queues.length; queueIndex++) {
                var queue = queues[queueIndex];
                var progress = queue.progress;
                progress.unfinished = 0;
                progress.finished = 0;
                progress.errors = 0;

                var jid = queue.jobId;
                var actions = queue.actions;

                for (var i = 0; i < actions.length; i++) {
                    var action = actions[i];
                    if (action.jobId >= jid) {
                        if (action.status === ret.ACTION_STATUS_NEW ||
                            action.status === ret.ACTION_STATUS_PENDING ||
                            action.status === ret.ACTION_STATUS_PROCESSING) {
                            progress.unfinished++;
                        } else {
                            progress.finished++;
                        }
                        if (action.status === ret.ACTION_STATUS_ERROR) {
                            progress.errors++;
                        }
                    }
                } // for.

                if (progress.finished > 0 && progress.unfinished === 0) {
                    progress.class = 'font-weight-bold text-success';
                } else if (progress.unfinished > 0) {
                    progress.class = 'text-info';
                } else if (progress.errors) {
                    progress.class = 'font-weight-bold text-danger';
                } else {
                    progress.class = 'text-muted';
                }
            }
            $timeout(dummy, 16);
        };

        var dummy = function () {
        };

        var getQueue = function getQueue(queueIndex) {
            if (!queueIndex) queueIndex = 0;
            if (queueIndex > queues.length) throw new Error('Error: getQueue(queueIndex) queueIndex is ' + queueIndex + ' but queues.length is ' + queues.length + '!');
            if (queueIndex === queues.length) {
                // Auto add new queue:
                addNewQueue();
            }
            return queues[queueIndex];
        };

        var addAction = function addAction(action, queueIndex) {
            var queue = getQueue(queueIndex);
            action.status = ret.ACTION_STATUS_NEW;
            action.jobId = ++jobId;
            queue.actions.push(action);
            queue.jobId = jobId;
            triggerProgress();
        };

        var addActions = function addActions(actions, queueIndex) {
            jobId++;
            var queue = getQueue(queueIndex);
            queue.jobId = jobId;
            for (var i = 0; i < actions.length; i++) {
                var action = actions[i];
                action.status = ret.ACTION_STATUS_NEW;
                action.jobId = jobId;
                queue.actions.push(action);
            }
            triggerProgress();
        };


        var _triggerJobQueueTableUpdate = function _triggerJobQueueTableUpdate() {
            notifyService.emit(ret.REFRESH_JOB_QUEUE_TABLE, '');
        };
        var cancel;
        var triggerJobQueueTableUpdate = function triggerJobQueueTableUpdate() {
            calcQueueProgress();
            if (cancel) $timeout.cancel(cancel);
            cancel = $timeout(_triggerJobQueueTableUpdate, 1111);
        };

        var triggerProgress = function triggerProgress() {
            calcQueueProgress();
            for (var i = 0; i < queues.length; i++) {
                var queue = queues[i];
                if (queue.status === ret.QUEUE_STATUS_IDLE) {
                    next(queue);
                }
            }
        };


        var next = function next(queue) {
            if (!queue) queue = getQueue(0);

            for (var i = 0; i < queue.actions.length; i++) {
                var action = queue.actions[i];
                if (action.status === ret.ACTION_STATUS_NEW) {
                    queue.status = ret.QUEUE_STATUS_RUNNING;
                    action.status = ret.ACTION_STATUS_PROCESSING;

                    if (action.action === ret.ACTION_REFRESH_PANEL) {
                        action.status = ret.ACTION_STATUS_SUCCESS;
                        notifyService.emit(ret.ACTION_REFRESH_PANEL, {index: action.panelIndex});
                        triggerJobQueueTableUpdate();

                    } else {
                        var executor = executorFactory.create(action);
                        //triggerJobQueueTableUpdate();

                        (function (executor) {
                            executor.execute(function (err, events) {
                                if (err) {
                                    queue.status = ret.QUEUE_STATUS_ERROR;
                                    executor.getAction().status = ret.ACTION_STATUS_ERROR;
                                } else {
                                    queue.status = ret.QUEUE_STATUS_IDLE;
                                    executor.getAction().status = ret.ACTION_STATUS_SUCCESS;

                                    //$log.info('executor.getAction().bulk', executor.getAction().bulk);
                                    if (!executor.getAction().bulk && events) {
                                        // fire update events:
                                        for (var j = 0; j < events.length; j++) {
                                            var e = events[j];
                                            //$log.info('actionQueueService fire: ', e.event, e);
                                            notifyService.emit(e.event, e);
                                        }
                                    }
                                    next(queue);
                                }
                                triggerJobQueueTableUpdate();
                            });
                        })(executor);
                        return; // leave the for loop
                    }
                }
            }
            queue.status = ret.QUEUE_STATUS_IDLE;
        };


        // Queue Status:
        ret.QUEUE_STATUS_IDLE = 'IDLE';
        ret.QUEUE_STATUS_RUNNING = 'RUNNING';
        ret.QUEUE_STATUS_ERROR = 'ERROR';

        // Action Status:
        ret.ACTION_STATUS_NEW = 'NEW';
        ret.ACTION_STATUS_PENDING = 'PENDING';
        ret.ACTION_STATUS_PROCESSING = 'PROCESSING'; // Running
        // done:
        ret.ACTION_STATUS_ERROR = 'ERROR';
        ret.ACTION_STATUS_WARNING = 'WARNING';
        ret.ACTION_STATUS_SUCCESS = 'SUCCESS';
        ret.ACTION_STATUS_ABORT = 'ABORT';


        // Action Event Keys:
        ret.ACTION_REFRESH_PANEL = 'REFRESH_PANEL';
        ret.ACTION_MKDIR = 'MKDIR';
        ret.ACTION_COPY = 'COPY';
        ret.ACTION_MOVE = 'MOVE';
        ret.ACTION_REMOVE = 'REMOVE';
        ret.ACTION_DELEMPTY = 'DELEMPTY';
        ret.ACTION_RENAME = 'RENAME';

        // Events:
        ret.REFRESH_JOB_QUEUE_TABLE = 'REFRESH_JOB_QUEUE_TABLE';

        ret.addAction = addAction;
        ret.addActions = addActions;
        ret.getQueue = getQueue;
        ret.getQueueStatus = getQueueStatus;
        ret.next = next;
        ret.getQueueProgress = getQueueProgress;

        return ret;
    }

}());