'use strict';

/* Controllers */

angular.module('angular-client-side-auth')
.controller('NavCtrl', ['$rootScope', '$scope', '$location', 'Auth', function($rootScope, $scope, $location, Auth) {
    $scope.user = Auth.user;
    $scope.userRoles = Auth.userRoles;
    $scope.accessLevels = Auth.accessLevels;

    $scope.logout = function() {
        Auth.logout(function() {
            $location.path('/login');
        }, function() {
            $rootScope.error = "Failed to logout";
        });
    };
}]);

angular.module('angular-client-side-auth')
.controller('WebCtrl', ['$rootScope', '$scope', '$location', 'Auth', function($rootScope, $scope, $location, Auth) {
    $scope.user = Auth.user;
    $scope.userRoles = Auth.userRoles;
    $scope.accessLevels = Auth.accessLevels;

    Auth.getData(function(res) {
        $scope.data = res;
        //$rootScope.error = "Success";
    }, function() {
        $rootScope.error = "Failed to retrieve data";
    });
    
    //$scope.renderGraph = function() {
    //    $(document).ready(function() {
            // Width and heigh of canvas
            //var width = $(document).width()-200;
            //var height = $(document).height()-100;
            var width = 800;
            var height = 800;

            var g = new Graph();
            g.edgeFactory.template.style.directed = true;

            var render = function(r, n) {
                    /* the Raphael set is obligatory, containing all you want to display */
                    var set = r.set().push(
                        /* custom objects go here */
                        // fill color here = color of the node
                        r.rect(n.point[0]-40, n.point[1]-13, 80, 44).attr({"fill": "#66CCCC", r : "30px", "stroke-width" : 1})).push(
                        r.text(n.point[0], n.point[1] + 10, (n.label || n.id)).attr({"font-size":"15px"}));
                    return set;
                };

            // Figuring out names of nodes / people
            var mapping = new Array();
            for(var i = 0; i<data.length; i++)
            {
                var duplicate = false;
                for (var j = 0; j<mapping.length; j++)
                {
                    var strpayer = $scope.data[i]["payer"];
                    var strtest = mapping[j];

                    if(strpayer == strtest)
                    {
                        duplicate = true;
                    }
                }
                if(duplicate == false)
                {
                    var name = $scope.data[i]["payer"];
                    mapping[mapping.length] = name;
                }
            }
            for(var i = 0; i<$scope.data.length; i++)
            {

                var duplicate = false;
                for (var j = 0; j<mapping.length; j++)
                {
                    var strpayer = $scope.data[i]["payee"];
                    var strtest = mapping[j];

                    if(strpayer == strtest)
                    {
                        duplicate = true;
                    }
                }
                if(duplicate == false)
                {
                    var name = $scope.data[i]["payee"];
                    mapping[mapping.length] = name;
                }
            }

            // Creating the nodes / people
            for(var i = 0; i<mapping.length;i++)
            {
                g.addNode(mapping[i], {render:render});
            }

            // Creating the edges / lines between node / people
            for(var i = 0; i<$scope.data.length; i++)
            {
                var payer = $scope.data[i]["payer"];
                var payee = $scope.data[i]["payee"];
                var amount = "$"+$scope.data[i]["amount"].toFixed(2);
                // stroke and fill color = line
                // fill in "label-style" = font color of $
                g.addEdge(payer,payee, {weight: 2, stroke :"green", fill: "green", directed: true, label : ""+amount, "label-style":{"font-size":20, fill: "#000"}});
            }

            //  Rendering canvas
            var layouter = new Graph.Layout.Spring(g);
            // Replace 'canvas' with name of div
            var renderer = new Graph.Renderer.Raphael('canvas', g, width, height);
            renderer.draw();
        //});
    //};
}]);

angular.module('angular-client-side-auth')
.controller('DataCtrl', ['$rootScope', '$scope', '$location', 'Auth', function($rootScope, $scope, $location, Auth) {
    $scope.user = Auth.user;
    $scope.userRoles = Auth.userRoles;
    $scope.accessLevels = Auth.accessLevels;

    Auth.getData(function(res) {
        $scope.data = res;
        //$rootScope.error = "Success";
    }, function() {
        $rootScope.error = "Failed to retrieve data";
    });
}]);

angular.module('angular-client-side-auth')
.controller('TransCtrl', ['$rootScope', '$scope', '$location', 'Auth', function($rootScope, $scope, $location, Auth) {
    $scope.user = Auth.user;
    $scope.userRoles = Auth.userRoles;
    $scope.accessLevels = Auth.accessLevels;

    $scope.newTransaction = function() {
        Auth.newTransaction( {
            payer: $scope.payer,
            payee: $scope.payee,
            amount: $scope.amount,
            reason: $scope.reason
        }, function() { //Success
            $rootScope.success = "Created transaction";
            $location.path('/');
        }, function() {
            $rootScope.error = "Failed to create transaction";
        });
    };
}]);

angular.module('angular-client-side-auth')
.controller('LoginCtrl',
['$rootScope', '$scope', '$location', '$window', 'Auth', function($rootScope, $scope, $location, $window, Auth) {

    $scope.rememberme = true;
    $scope.login = function() {
        Auth.login({
                username: $scope.username,
                password: $scope.password,
                rememberme: $scope.rememberme
            },
            function(res) {
                $location.path('/');
            },
            function(err) {
                $rootScope.error = "Failed to login";
            });
    };

    $scope.loginOauth = function(provider) {
        $window.location.href = '/auth/' + provider;
    };
}]);

angular.module('angular-client-side-auth')
.controller('RegisterCtrl',
['$rootScope', '$scope', '$location', 'Auth', function($rootScope, $scope, $location, Auth) {
    $scope.role = Auth.userRoles.user;
    $scope.userRoles = Auth.userRoles;

    $scope.register = function() {
        Auth.register({
                username: $scope.username,
                password: $scope.password,
                role: $scope.role
            },
            function() {
                $location.path('/');
            },
            function(err) {
                $rootScope.error = err;
            });
    };
}]);

angular.module('angular-client-side-auth')
.controller('AdminCtrl',
['$rootScope', '$scope', 'Users', 'Auth', function($rootScope, $scope, Users, Auth) {
    $scope.loading = true;
    $scope.userRoles = Auth.userRoles;

    Users.getAll(function(res) {
        $scope.users = res;
        $scope.loading = false;
    }, function(err) {
        $rootScope.error = "Failed to fetch users.";
        $scope.loading = false;
    });

}]);

