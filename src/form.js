var $ = require('jquery');
var Handlebars = require('handlebars');
var showdown = require('showdown');

/*jshint multistr: true */
var markdown = new showdown.Converter();
$(document).ready(function(){
  var templateString = '# RFQ for the {{agency.fullName}}\
  \
  ### {{date}}\
  \
  ### Table of Contents\
  \
  {{#each sections}}\
  \
  * {{this}}\
  \
  {{/each}}\
  \
  Note: All sections of this RFQ will be incorporated into the contract except the Statement of Objectives, Instructions, and Evaluation Factors.\n +\n +******\n +\n +## 1. Definitions\n +{{#each definitions}}\n +\n +{{this}}\n +\n +{{/each}}\n +\n +# 2. Services\n +## Brief Description of Services & Type of Contract\n +\n +{{services.descriptionOfServices}}\n +\n +{{services.naicsText}}\n +\n +## Budget\n +The government is willing to invest a maximum budget of {{services.maxBudget}} in this endeavor.\n +\n +{{#if services.travel.requirement}}\n +\n +The Government anticipates travel will be required under this effort. Contractor travel expenses will not exceed {{services.travel.budget}}.\n +\n +{{services.travel.language}} {{/if}}';
  var templateString2 = '# Second Template {{agency.fullName}}\n +### {{date}}</h3>\n +\n +### Table of Contents\n +{{#each sections}}\n +* {{this}}\n +{{/each}}\n +\n +Note: All sections of this RFQ will be incorporated into the contract except the Statement of Objectives, Instructions, and Evaluation Factors.\n +\n +******\n +\n +## 1. Definitions\n +{{#each definitions}}\n +\n +{{this}}\n +\n +{{/each}}\n +\n +# 2. Services\n +## Brief Description of Services & Type of Contract\n +\n +{{services.descriptionOfServices}}\n +\n +{{services.naicsText}}\n +\n +## Budget\n +The government is willing to invest a maximum budget of {{services.maxBudget}} in this endeavor.\n +\n +{{#if services.travel.requirement}}\n +\n +The Government anticipates travel will be required under this effort. Contractor travel expenses will not exceed {{services.travel.budget}}.\n +\n +{{services.travel.language}} {{/if}}';
  var templateList = [{"name": "Purchase Order", "value": "purchase_order", "text": templateString}, {"name": "Test 2", "value": "test_2", "text": templateString2}];

  for(var i = 0; i < templateList.length; i++){
    $("#select_template select").append($('<option />').attr({'name': templateList[i].name, 'value': templateList[i].value}).text(templateList[i].name));
  }

  var data = {"agency": {fullName: "Hey Gurl"}, "date": "04/17/2016", "sections": [], "definitions": ["def 1", "def 2"], "services": {"descriptionOfServices": "Descript of serv", "naicsText": "Naics Text", "maxBudget": "10000"}};
  var templ = templateList[0].text;
  $("#select_template select").change(function(e){
    e.preventDefault();
    console.log($(this).val());

    //Select Template
    for(var i = 0; i < templateList.length; i++){
      if (templateList[i].value == $(this).val()){
        templ = templateList[i].text;
      }
    }
    // $('#rendered_template').markdown(templ);
    // $('#rendered_template').html(templ);
    $('#rendered_template').html(markdown.makeHtml(templ));
  });

  $('#template_form input').change(function(e){
    field = $(this).attr('name').split('.'); /// How to split to get to the object
    if (field.length == 1){
        if (typeof data[$(this).attr('name')] === 'object'){
          data[$(this).attr('name')][$(this).attr('data-itr')] = $(this).val();

        } else {
            // Add list Handling
          data[field[0]] = $(this).val();
        }


    } else {
      data[field[0]][field[1]] = $(this).val();
    }


    // var template = Handlebars.compile(templ);
    // var fullMarkdown = template(data);
    // // $('#rendered_template').markdown(fullMarkdown);
    // $('#rendered_template').html(fullMarkdown);
    updateTemplate(templ);
  });

  $('.remove-list-item').click(function(e){
    e.preventDefault();
    data[$(this).attr('data-field')].slice([$(this).attr('data-itr')]);
    updateTemplate(templ);
  });

function updateTemplate(selected_template){
  var template = Handlebars.compile(selected_template);
  var fullMarkdown = template(data);
  // $('#rendered_template').markdown(fullMarkdown);
  $('#rendered_template').html(fullMarkdown);
}
});
