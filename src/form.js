var $ = require('jquery');
var Handlebars = require('handlebars');
var showdown = require('showdown');
require('es6-promise').polyfill();
var superagentPromisePlugin = require('superagent-promise-plugin');
var request = superagentPromisePlugin.patch(require('superagent'));
var base64 = require('js-base64').Base64;
var expParse = require('./expression_parser.js');
var _ =require('underscore');

/*jshint multistr: true */
var markdown = new showdown.Converter({'tables': true});
var templateRepo = 'acq-templates';
var branch = 'purchase-order-handlebars';
var lastDataFile = "";

$(document).ready(function(){
  onReady();
});

function onReady() {
  getGitTree(templateRepo, branch).then(function(tree){
    var directories = _.pluck(_.where(tree.body.tree, {type: "tree"}), 'path');
    var subFiles = _.filter(tree.body.tree, function(file){
      var fileExt = file.path.split('.');
      return file.path.split('/').length > 1 && fileExt.pop() == 'md';
    });


    // var templateJson;
    if(directories.length > 1){
      $('#select_template form').append($('<label />').text("Please select type of template you would like to use."))
      .append($('<select />').addClass('form-control').attr({'name': 'template_directory', 'id': 'template_directory'}).append($('<option />')
      .text('Select a Type of Template').attr({'selected':'selected', 'disabled':'disabled'})));



      _.each(directories, function(d){
        $('#select_template form #template_directory').append($('<option />').attr({'name': 'template_directory', 'value': d}).text(capCase(d)));
      });
    } else {
      // templateJson = getDirectoryJSON(directories[0], tree.body.tree);
      makeSubFileSelect(directories[0], subFiles, tree.body.tree);
    }


    $('#select_template form #template_directory').change(function(e){
      var dir = $(this).val();
      makeSubFileSelect(dir, subFiles, tree.body.tree);

    });

}).catch(function(e){console.log(e);});
}


// separate function to be added when template dropdown is populated
//DOM Functions
function templateClickListener(templateJson){
  $('#select_template form select#template_file').change(function(e){
    e.preventDefault();
    var filePath = $(this).val();
    templateBuilder(templateRepo, filePath, templateJson.path);
  });
}

function templateBuilder(templateRepo, templatePath, sampleDataPath){
  getGitResourcePromise(templateRepo, templatePath)
  .then(function (tempRes) {
    getGitResourcePromise(templateRepo, sampleDataPath)
    .then(function(templData){
      var rawMarkdown = decodeContent(tempRes);
      var templateFields = JSON.parse(decodeContent(templData));

      var uri = "data:text/plain;charset=utf-8," + encodeURIComponent(rawMarkdown);
      $('a.download').attr("href", uri);
      renderMarkdown($('#rendered_template'), rawMarkdown);

      //Only build new form if new template
      if(lastDataFile !== sampleDataPath){
        buildForm($('#template_form'),templateFields);
      }
      lastDataFile = sampleDataPath;
      $('#template_form input').keyup(function(e){

          field = $(this).attr('name').split('.'); /// How to split to get to the object
          if (field.length == 1){
              if (typeof templateFields[$(this).attr('name')] === 'object'){
                templateData[$(this).attr('name')][$(this).attr('data-itr')] = $(this).val();

              } else {
                  // Add list Handling
                templateFields[field[0]] = $(this).val();
              }

          } else {
            templateFields[field[0]][field[1]] = $(this).val();
          }

          var template = Handlebars.compile(rawMarkdown);
          var handledBar = template(templateFields);
          //Add download of the md
          var uri = "data:text/plain;charset=utf-8," + encodeURIComponent(handledBar);
          var fileName = templatePath.split('/');
          fileName = fileName[1];
          $('a.download').removeClass('hide').attr({"href": uri, "download": fileName});
          renderMarkdown($('#rendered_template'), handledBar);


    });
  });

});
}
function renderMarkdown($div, content){
  $div.html(markdown.makeHtml(content));
}


function buildForm($formDiv, fieldsObj){
  _.each(fieldsObj, function(val, key){
    if(typeof val == "object"){
      if(_.isArray(val)){

      } else {
        $fieldSet = $('<fieldSet />').addClass('form-group');
        _.each(val, function(subVal, subKey){
          var DataKey = key+"."+subKey;
          $fieldSet.append($('<label />').attr('for', DataKey).text(labelMaker(key, subKey)))
          .append($('<input />').addClass('form-control').attr({'name': DataKey, 'value': ""}));
        });
        $formDiv.append($fieldSet);
      }
    }

    else {
      $formDiv.append($('<label />').attr('for', 'key').text(addWord("", key)))
      .append($('<input />').addClass('form-control').attr({'name': key, 'value': val}));
    }
  });
}

function makeSubFileSelect(dir, subFiles, treeBody){
  var templateJson = getDirectoryJSON(dir, treeBody);
  if($('#select_template form #template_file').length){
    $('#select_template form #template_file option').remove();
    addDropDown(dir, subFiles);
  } else {
    $('#select_template form').append($('<label />').text("Choose the template you would like to use: "))
    .append($('<select />').addClass('form-control').attr({'name': 'template_file', 'id': 'template_file'}));
    addDropDown(dir, subFiles);
  }
  templateClickListener(templateJson);
}

function addDropDown(dir, subFiles){
  $('#select_template #template_file').append($('<option />').text('Select a Template').attr({'selected':'selected', 'disabled':'disabled'}));
  _.each(subFiles, function(s){ // Need to filter subfiles based on mother path
    var p = s.path.split('/');
    if(p[0] == dir){
      $('#select_template #template_file').append($('<option />').attr({'name': 'template_file', 'value': s.path}).text(capCase(p[1])));
    }
  });
}

//   $('.remove-list-item').click(function(e){
//     e.preventDefault();
//     data[$(this).attr('data-field')].slice([$(this).attr('data-itr')]);
//     updateTemplate(templ);
//   });

//Non DOM functions

function getGitResourcePromise(repo, path){
  var url = 'https://api.github.com/repos/18F/'+repo+'/contents/'+path;
  var req = request.get(url)
  .use(superagentPromisePlugin);
  return req;
}

function getGitTree(repo, branch){
  var url = 'https://api.github.com/repos/18F/'+repo+'/git/trees/'+branch+'?recursive=1'; //Not doing recursive because only want to keep it one level deep
  var req = request.get(url)
  .use(superagentPromisePlugin);
  return req;
}

function decodeContent(gitResource){
  var obj = JSON.parse(gitResource.text);
  var txt = base64.decode(obj.content);
  return txt;
}

function labelMaker(key, subKey){
  var label = addWord("", key)+" ";
  return addWord(label, subKey);
}

function ifUpper(char){
  if (char == char.toUpperCase()) {
    return true;
  } else {
    return false;
  }
}

function addWord(label, key){
  label += key[0].toUpperCase();
  for(var i=1; i < key.length; i++){
    if(ifUpper(key[i])){
      label += " "+key[i];
    } else {
      label += key[i];
    }
  }
  return label;
}

function capCase(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getDirectoryJSON(dir, tree){
    var jsons = _.filter(tree, function(file){
    var fileExt = file.path.split('.');
    var treeDir = file.path.split('/');
    return treeDir.length > 1 && fileExt.pop() == 'json' & treeDir[0]==dir;
  });
  if (jsons.length == 1){
    return jsons[0];
  } else {
    return false;
  }
}



//
//

//
