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

$(document).ready(function(){
  getGitResourcePromise(templateRepo, 'sow/agile_bpa.md')
  .then(function (tempRes) {
    getGitResourcePromise(templateRepo, 'sow/sow_data_sample.json')
    .then(function(templData){
      var rawMarkdown = decodeContent(tempRes);
      var templateFields = JSON.parse(decodeContent(templData));
      renderMarkdown($('#rendered_template'), rawMarkdown);
      // var templateList = [{"name": "Purchase Order", "value": "purchase_order", "text": "templateString"}, {"name": "Test 2", "value": "test_2", "text": "templateString2"}];
      buildForm($('#template_form'),templateFields);
      $('#template_form input').change(function(e){

          field = $(this).attr('name').split('.'); /// How to split to get to the object
          if (field.length == 1){
              if (typeof templateFields[$(this).attr('name')] === 'object'){
                templateData[$(this).attr('name')][$(this).attr('data-itr')] = $(this).val();
                console.log($(this).val());

              } else {
                  // Add list Handling
                templateFields[field[0]] = $(this).val();
                console.log($(this).val());
              }

          } else {
            templateFields[field[0]][field[1]] = $(this).val();
            console.log($(this).val());
          }

          var template = Handlebars.compile(rawMarkdown);
          var handledBar = template(templateFields);
          renderMarkdown($('#rendered_template'), handledBar);

          console.log(templateFields);

    });
  });

}).catch(function(e){console.log(e);});


  function getGitResourcePromise(repo, path){
    var url = 'https://api.github.com/repos/18F/'+repo+'/contents/'+path;
    var req = request.get(url)
    .use(superagentPromisePlugin);
    return req;
  }

  function decodeContent(gitResource){
    var obj = JSON.parse(gitResource.text);
    var txt = base64.decode(obj.content);
    return txt;
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
            console.log(DataKey);
            $fieldSet.append($('<label />').attr('for', DataKey).text(DataKey));
            $fieldSet.append($('<input />').addClass('form-control').attr({'name': DataKey, 'value': ""}));
          });
          $formDiv.append($fieldSet);
        }
      }

      else {
        $formDiv.append($('<input />').addClass('form-control').attr({'name': key, 'value': val}));
      }
    });
  }
//   var templateList = [{"name": "Purchase Order", "value": "purchase_order", "text": templateString}, {"name": "Test 2", "value": "test_2", "text": templateString2}];
//
//   for(var i = 0; i < templateList.length; i++){
//     $("#select_template select").append($('<option />').attr({'name': templateList[i].name, 'value': templateList[i].value}).text(templateList[i].name));
//   }
//
//   $("#select_template select").change(function(e){
//     e.preventDefault();
//     console.log($(this).val());
//
//     //Select Template
//     for(var i = 0; i < templateList.length; i++){
//       if (templateList[i].value == $(this).val()){
//         templ = templateList[i].text;
//       }
//     }
//     // $('#rendered_template').markdown(templ);
//     // $('#rendered_template').html(templ);
//     $('#rendered_template').html(markdown.makeHtml(templ));
//   });
//
//
//   $('.remove-list-item').click(function(e){
//     e.preventDefault();
//     data[$(this).attr('data-field')].slice([$(this).attr('data-itr')]);
//     updateTemplate(templ);
//   });
//
});
