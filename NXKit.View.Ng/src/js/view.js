module.directive('nxView', ['$compile', function ($compile) {
    return {
        restrict: 'E',
        scope: {
            url: '@url',
        },
        controller: 'nxView',
        template:
'           <div class="nx-ng-host">' +
'               <div class="nx-ng-body"></div>' +
'           </div>',
        link: function ($scope, element, attrs, ctrl) {
            ctrl.init(element, $scope.url);
        },
    };
}]);

module.controller('nxView', ['$scope', '$attrs', '$http', function ($scope, $attrs, $http) {

    this.init = function (element, url) {
        var self = this;

        $scope.url = url;

        // locate element for view body
        var host = $(element[0]).find('>.nx-ng-host');
        if (host.length == 0)
            throw new Error("cannot find host element");

        // locate element for view body
        var body = $(host).find('>.nx-ng-body');
        if (body.length == 0)
            throw new Error("cannot find body element");

        // generate new view
        if ($scope.view == null) {
            $scope.view = new nx.View.View(body[0], function (data, cb) {
                self.send(data, cb);
            });
        }

        // get initial data
        $http.get($scope.url)
            .success(function (result) {
                $scope.view.Receive(result);
            })
            .error(function (result) {
                console.log(result);
            });
    };

    this.send = function (data, cb) {
        $http.post($scope.url, JSON.stringify(data))
            .success(function (result) {
                cb(result);
            })
            .error(function (result) {
                console.log(result);
            });
    };

}]);
