describe('App controller', function () {
    var timer;

    beforeEach(module('poker-timer'));

    beforeEach(inject(function(pokerTimer) {
        timer = pokerTimer;
    }));

    it('should be an object', function () {
        expect(timer).toBeDefined();
    });
});
