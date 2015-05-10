// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });

})

.factory('Projects', function(){
  return {
    all : function(){
      var projectString = window.localStorage['projects'];
      if (projectString) {
        return angular.fromJson(projectString);
      }
      return [];
    },

    save : function(projects){
      window.localStorage['projects'] = angular.toJson(projects);
    },

    newProject : function(projectTitle){
      return {
        title : projectTitle,
        tasks : []
      };
    },

    getLastActiveIndex : function(){
      return parseInt(window.localStorage['lastActiveProject'] || 0);
    },

    setLastActiveIndex : function(index){
      window.localStorage['lastActiveProject'] = index;
    }
  }
})

.controller('TodoCtrl', function($scope, $timeout, $ionicModal, Projects, $ionicSideMenuDelegate) {
  // No need for testing data anymore
  $scope.tasks = [];

  // Create and load the Modal
  $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  // Called when the form is submitted
  $scope.createTask = function(task) {
    $scope.tasks.push({
      title: task.title
    });
    $scope.taskModal.hide();
    task.title = "";
  };

  // Open our new task modal
  $scope.newTask = function() {
    $scope.taskModal.show();
  };

  // Close the new task modal
  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  };

  var createProject = function(title){
    var newProject = Projects.newProject(title);
    $scope.projects.push(newProject);
    Projects.save($scope.projects);
    $scope.selectProject(newProject, $scope.projects.length - 1);
  };

  $scope.projects = Projects.all();

  $scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];

  $scope.newProject = function(){
    var projectTitle = prompt('project name');
    if (projectTitle) {
      createProject(projectTitle);
    }
  };

  $scope.selectProject = function(project, index){
    $scope.activeProject = project;
    Projects.setLastActiveIndex(index);
    $ionicSideMenuDelegate.toggleLeft(false);
  };

  $scope.toggleProjects = function(){
    $ionicSideMenuDelegate.toggleLeft();
  };

  $timeout(function(){
    if ($scope.projects.length === 0) {
      while(true){
        var projectTitle = prompt('Your first project title');
        if (projectTitle) {
          createProject(projectTitle);
          break;
        }
      }
    }
  });

});
