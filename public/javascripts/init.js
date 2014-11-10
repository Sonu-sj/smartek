angular.module('playlist', ['playlist.services']).config(['$controllerProvider', function($controllerProvider) {
      $controllerProvider.allowGlobals();
   }]);