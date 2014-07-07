describe('App controller', function () {
    var timer, $q;

    beforeEach(module('poker-timer'));

    beforeEach(inject(function(_pokerTimer_, _$q_, _$interval_) {
        timer = _pokerTimer_;
        $q = _$q_;
        $interval = _$interval_;
    }));

    it('should be an object', function () {
        expect(timer).toBeDefined();
    });

    it('should have a start method', function () {
        expect(typeof timer.start).toBe('function');
    });

    it('should return a promise after starting the timer', function () {
        expect(timer.start().then).toBeDefined();
    });

    it('should add a notify callback to the promise', function () {
        expect(timer.start().notify).toBeDefined();
    });

    it('should set a number of seconds to start from when starting the timer', function () {
        timer.start(10)

        expect(timer.getRemainingSeconds()).toBe('10');
    });

    it('should call the notify function 100 times for a 5 second timer', function () {
        var spy = jasmine.createSpy('TimerSpy');

        timer.start().notify(spy);

        $interval.flush(5000);

        expect(spy.callCount).toBe(100);
    });

    it('should call the notify function 5 times for a 5 second timer', function () {
        var spy = jasmine.createSpy('TimerSpy'),
            spyStop = spyOn(timer, 'stop').andCallThrough();

        timer.start().notify(spy);

        $interval.flush(6000);

        expect(spyStop).toHaveBeenCalled();
    });

    it('should cancel the current timer if start is called twice', function () {
        var spy = jasmine.createSpy('TimerSpy');

        timer.start().then(undefined, spy);
        timer.start();

        $interval.flush(50);

        expect(spy).toHaveBeenCalled();
        expect(timer.getRemainingSeconds()).toBe('04');
        expect(timer.getRemainingMilliseconds()).toBe('950');
    });
});
