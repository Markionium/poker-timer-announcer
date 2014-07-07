var app = angular.module('poker-timer', []);

app.controller('appCtrl', function ($scope, pokerTimer) {
    var timerDuration = 2,
        sounds = {
            positive: [
                'impressive',
                'godlike',
                'excellent',
                'dominating',
                'headshot',
                'winner',
                'rampage'
            ],
            negative: [
                'humiliation',
                'failed',
                'lastplace'
            ]
        };

    function getRandom(array) {
        return Math.floor(Math.random() * array.length) ;
    }

    function getPositiveSoundId() {
        console.log(getRandom(sounds['positive']));
        return sounds['positive'][getRandom(sounds['positive'])];
    }

    function getNegativeSoundId() {
        return sounds['negative'][getRandom(sounds['negative'])];
    }

    function checkForSounds(impressive) {
        var seconds = parseInt($scope.timer.seconds, 10),
            milliseconds = parseInt($scope.timer.milliseconds, 10);
        if (impressive) {
            return document.getElementById(getPositiveSoundId()).play();
        }

        if (seconds !== 0 && seconds <= 10 && milliseconds === 0) {
            return document.getElementById('unrealcd' + seconds).play();
        }

        if (pokerTimer.hasEnded()) {
            return document.getElementById(getNegativeSoundId()).play();
        }
    }

    function setUp() {
        var timer = pokerTimer.start();
        console.log(timer);
        timer.notify(function () {
            $scope.timer.seconds = pokerTimer.getRemainingSeconds();
            $scope.timer.milliseconds = pokerTimer.getRemainingMilliseconds();
            checkForSounds();
        });

        timer.then(function (result) {
            $scope.timer.end = true;
        });

        return timer;
    }

    function updateTimerStatus() {
        if (pokerTimer.hasEnded()) {
            setUp();
            return;
        }
        if (pokerTimer.isPaused()) {
            pokerTimer.resume();
        } else {
            pokerTimer.pause();
            checkForSounds(true);
        }
    }

    setUp(timerDuration);

    $scope.timer = {
        seconds: '00',
        milliseconds: '00',
        end: false,
        pause: function () {
            pokerTimer.pause();
            checkForSounds(true);
        }
    };

    jQuery(document).on('keyup', function (event) {
        if (event.which === 32) {
            updateTimerStatus();
        }
    });
});