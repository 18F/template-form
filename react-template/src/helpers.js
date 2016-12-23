import * as base64 from 'js-base64';

export function decodeContent(gitResource){
   var obj = JSON.parse(gitResource.text);
   var txt = base64.Base64.decode(obj.content);
   return txt;
 }

 String.prototype.toSentenceCase = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

 export function labelMaker(templateName){
  const templateParse = templateName.split('/');
   if (templateParse.length > 1){
    templateParse.shift();
    let templateTitle = templateParse.shift().split('.').slice(0, -1);
      templateTitle = templateTitle[0].split('_').map((word) => word.toSentenceCase()).join(' ');
     return templateTitle;
   }
   return templateParse[0].toSentenceCase();
 }

 export function createFileHash(gitHubTree, fileExtension){
   const subFiles = gitHubTree.filter((file) => {
       return file.path.split('/').length > 1 && file.path.split('.').pop() === fileExtension;
   });
   let subFileHash = {};
   subFiles.forEach(file => {
     const pathArray = file.path.split('/');
     file.filename = pathArray.pop();
     if (pathArray[0] in subFileHash){
       subFileHash[pathArray[0]].push(file);
     } else {
     subFileHash[pathArray[0]] = [file];
     }

 });
 return subFileHash;
 }
