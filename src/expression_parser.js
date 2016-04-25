// select template ->
var _un = require('underscore');
// read template

var templateString = '# RFQ for the {{agency.fullName}}\n +### {{date}}</h3>\n +\n +### Table of Contents\n +{{#list sections}}\n +* {{this}}\n +{{/each}}\n +\n +Note: All sections of this RFQ will be incorporated into the contract except the Statement of Objectives, Instructions, and Evaluation Factors.\n +\n +******\n +\n +## 1. Definitions\n +{{#each definitions}}\n +\n +{{this}}\n +\n +{{/list}}\n +\n +# 2. Services\n +## Brief Description of Services & Type of Contract\n +\n +{{services.descriptionOfServices}}\n +\n +{{services.naicsText}}\n +\n +## Budget\n +The government is willing to invest a maximum budget of {{services.maxBudget}} in this endeavor.\n +\n +{{#if services.travel.requirement}}\n +\n +The Government anticipates travel will be required under this effort. Contractor travel expenses will not exceed {{services.travel.budget}}.\n +\n +{{services.travelLanguage}}';

module.exports = getFormElements;
// extract template input tags
function getFormElements(str){
var re = /\{\{(.*)\}\}/g;
var templStrings = [];
var m;

while ((m = re.exec(str)) !== null) {
    if (m.index === re.lastIndex) {
        re.lastIndex++;
    }
    templStrings.push(m[1]);
}

expressions = [];
_un.each(templStrings, function(expression){
if(expression[0] != '/' && expression != 'this'){ // Ignore end tags and this
 if(expression[0] == "#"){
   var expression_split = expression.split(' ');
   expression = expression_split[1];
   expression = expression + '._list'; // in theory we want a different catch for lists to ensure is the next tag isn't 'this' than we capute that is a child tag'
 }
 var data = expression.split('.');
 expressions.push(data);
}
});

var fieldsets = [];
_un.each(expressions, function(exp){
  _un.each(exp, function(field, index){
      if(exp[index+1] == "_list"){
        exp[index] = {name: field, type: 'list'};
        exp.splice(index+1, 1);
      }
  });

  if (exp.length > 1){

    fieldsets.push({name: exp[0], fields: exp.slice(1), type: 'set'});
  } else {
    if(_un.isObject(exp[0])){
      fieldsets.push({name: exp[0].name, fields: exp[0].name, type: 'list'});
    } else {
      fieldsets.push({name: exp[0], fields: exp[0], type: 'single'});
    }

  }
});
clean_fieldsets = _un.chain(fieldsets)
.groupBy('name')
.map(function(value, key) {
    return {
        name: key,
        fields: _un.pluck(value, 'fields'),
        type: _un.first(_un.uniq(_un.pluck(value, 'type')))
    };
})
.value();

_un.each(clean_fieldsets, function(fieldset){ //Need to make recursive

});

return clean_fieldsets;
}

// var fields = getFormElements(templateString);
// _un.each(fields, function(f,i){
//   console.log(fields[i].fields);
// });

// render form from input tags
//   field sets for tags
//   http://www.alpacajs.org/docs/api/templates.html
//
// enter info -> update template tags
//
// render handlebars -> render markdown
