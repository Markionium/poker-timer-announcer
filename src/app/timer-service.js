'use strict';
var app = angular.module('poker-timer');

app.service('pokerTimer', function ($q, $interval) {
    var self = this,
        deferred,
        promise,
        duration,
        intervalTime = 50,
        stop,
        isPaused;

    function tick() {
        duration = moment.duration(duration.asMilliseconds() - intervalTime, 'milliseconds');
    }

    function startTicks() {
        stop = $interval(function () {
            tick();
            deferred.notify({
                seconds: self.getRemainingSeconds(),
                milliseconds: self.getRemainingMilliseconds()
            });
            if (duration.seconds() + duration.milliseconds() === 0) {
                self.stop();
            }
        }, intervalTime);
    }

    this.stop = function () {
        $interval.cancel(stop);
        deferred.resolve(true);
    };

    this.start = function (timerLength) {
        deferred = $q.defer();
        promise = deferred.promise;
        promise.notify = function (processCallback) {
            this.then(undefined, undefined, processCallback);
        }

        if ( ! timerLength) {
            timerLength = 5
        }

        if (stop && ! this.hasEnded()) {
            $interval.cancel(stop);
            deferred.reject('Timer started before it ended');
        }

        //Set initial timer time
        duration = moment.duration(timerLength * 1000);

        startTicks();

        return promise;
    };

    this.resume = function () {
        isPaused = false;
        startTicks();
    };

    this.pause = function () {
        $interval.cancel(stop);
        isPaused = true;
    }

    this.isPaused = function () {
        return isPaused;
    };

    this.hasEnded = function () {
        if (moment.duration(duration).asMilliseconds() === 0) {
            return true;
        }
        return false;
    }

    this.getRemainingSeconds = function () {
        //return duration.seconds();
        return moment.utc(moment.duration(duration).asMilliseconds()).format("ss");
    };

    this.getRemainingMilliseconds = function () {
        return moment.utc(moment.duration(duration).asMilliseconds()).format("SSS");
    }
});
