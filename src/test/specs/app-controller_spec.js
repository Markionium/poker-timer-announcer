describe('App controller', function () {
    var controller, scope;

    beforeEach(module('poker-timer'));

    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        controller = $controller;

        controller('appCtrl', {
            $scope: scope
        });
    }));

    it('should have a timer object', function () {
        expect(scope.timer).toBeDefined();
    });
});
