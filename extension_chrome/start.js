
//alert("yaya")

//$(".basic-info-section").


MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

 // function checksend(){

 //    this.data={};
 //    this.checker= function(){

 //      this.data


 //      return 


 //    }



 // }



function cssappend(){
  var css = '.dotz .hx {width: 220px; }',
      head = document.getElementsByTagName('head')[0],
      style = document.createElement('style');
    style.type = 'text/css';
  if (style.styleSheet){
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }

  head.appendChild(style);
}
cssappend();


var observer = new MutationObserver(function(mutations, observer) {
    // fired when a mutation occurs
   // console.log(mutations, observer);
    getdataObj.scrap(mutations, observer);
  
  });


 getdata=function(){

  this.data={}
  t=this
  this.mainDiv
  this.rapportiveDiv
  this.emailCurrent={}
  this.emailCurrent.type=null
  this.emailCurrent.value=null

  // this.scrapemail=function(){

  // }
  this.scrap=function(mutations, observer){
     for (var i = mutations.length - 1; i >= 0; i--) {

      // console.log(mutations[i].target.className)

      // console.log(mutations[i].target.getAttribute("role"))

      console.log(mutations[i].target.getAttribute("email"))

        //we need to turn off rapportive
        
        // call our server for data
       
        // if we succeed show data
        
        // if we fail fallback to rapportive
          // check back overy 10 sec for updates to dotz....
           // if rapportive is on place a button
           //if rapportive is off load the screen

      if ("rapportive-placeholder"==mutations[i].target.className){
            if (!t.rapportiveDiv){
            t.rapportiveDiv=mutations[i].target
           }  
            if (t.active)
            t.hideOther();
      }

      if (mutations[i].target.getAttribute("role")=="main")
        t.inject(), t.switch();

     // console.log(mutations[i].target.length)

     // wehsould only scrape the data if the email is not what we just fetched
       if (mutations[i].target.className=="authorizations-section"){
             // alert(mutations[i].target.className)



              var m, n, o, email, emailText, job, jobText, occupation, twitterList,img;
              m=document.getElementsByClassName("basic-info-section")[0]

              name=m.getElementsByClassName("name")[0]
              if (name){
              nameText=name=m.getElementsByClassName("name")[0].innerHTML
              namesplit=nameText.split(/ /)
              firstName=namesplit[0] 
              lastName=namesplit[namesplit.length-1]
              }
              img=m.getElementsByTagName("img")
              if(img.length)
                t.data.img=img[0].src
              if (!firstName || !lastName || t.data.firstName==firstName && t.data.lastName==lastName){
                return
              }
              t.data.firstName=firstName
              t.data.lastName=lastName
              //var m, n, o;
              //m=document.getElementsByClassName("basic-info-section")[0]

              var email=m.getElementsByClassName("email")
              if (email.length)
              t.data.email=striphtml( m.getElementsByClassName("email")[0].innerHTML )


              occupations=document.getElementsByClassName("occupations")[0].getElementsByTagName("li")

              if (occupations[0]){        
                  t.data.jobs=[];
                  for (var i = occupations.length - 1; i >= 0; i--) {
                    dataAppend={}
                    if (occupations[i].getElementsByClassName("job-title")[0])
                     dataAppend.title=occupations[i].getElementsByClassName("job-title")[0].innerHTML
                    if (occupations[i].getElementsByClassName("company")[0])
                     dataAppend.name=occupations[i].getElementsByClassName("company")[0].innerHTML
                    t.data.jobs.push(dataAppend)
                  };
              }


              var links=document.getElementsByClassName("membership-link")

              for (var i = links.length - 1; i >= 0; i--) {
                
                  if (!links[i].href){

                  }else if (links[i].href.match(/twitter.com/)){
                    var m=links[i].href.split("/")
                    t.data.twitter=m[m.length-1]
                  }else if (links[i].href.match(/facebook.com/)){
                    t.data.facebook=links[i].href
                  }else if (links[i].href.match(/linkedin.com/)){
                    t.data.linkedin=links[i].href
                  }else if (links[i].href.match(/angel.co/)){
                    t.data.angellist=links[i].href
                  }else if (links[i].href.match(/facebook.com/)){
                    t.data.facebook=links[i].href
                  }
              };

              // var twitter= document.getElementsByClassName("twitter-section")
              // if (twitter.length){

              //   twitterList=twitter[0].getElementsByClassName("membership-link")[0].getAttribute('href').split("/")
              //   t.data.twitter=twitterList[twitterList.length-1]
              // }
 
              //  var facebook=document.getElementsByClassName("facebook-section")
              // if (facebook.length){
              //   t.data.facebook=facebook[0].getElementsByClassName("membership-link")[0].getAttribute('href')
              // }

              //  var linkedin=document.getElementsByClassName("linked-in-section")
              // if (linkedin.length){
              //   t.data.linkedin=linkedin[0].getElementsByClassName("membership-link")[0].getAttribute('href')
              // }                                
              // var linkedin=document.getElementsByClassName("memberships-section")
              // if (linkedin.length){

              //   //linked-in-section
              //   t.data.linkedin=linkedin[0].getElementsByClassName("membership-link")[0].getAttribute('href')
              // } 


            //  company=occupation.getElementsByClassName("company")[0]
            //  if (company)
            //  t.data.company=occupation.getElementsByClassName("company")[0].innerHTML

            if (t.emailCurrent.value!=t.data.email || t.emailCurrent.type!="scrapped")
            t.emailCurrent.value=t.data.email,
            t.emailCurrent.type="scraped",
            t.loadXMLDoc();
              //t.inject()
             // if (!t.mainDiv || !t.rapportiveDiv || t.rapportiveDiv.style.display!="none")
              
            
              //else
            //  t.update()
      }
    }
  }

  document.onmouseover=function(e){ getdataObj.emailClickHandler(e.target), console.log("dd")}

  // this.bindMouseOver=function(divs){
  //    // var divs=getAllElementsWithAttribute("email", undefined, divs);


  //     for (var i = divs.length - 1; i >= 0; i--) {
  //       delete divs[i].onmouseover,
  //       divs[i].onmouseover=getdataObj.emailClickHandler;
  //     };
  // }
 this.emailClickHandler=function(div){
  var email=div.getAttribute("email")
  if (email && getdataObj.emailCurrent.value!=email)
    t.emailCurrent.value=email,
    t.emailCurrent.type="mouseover",
    getdataObj.clear(),
    getdataObj.switch(),
    getdataObj.data={},
    getdataObj.data.email=email,
    getdataObj.loadXMLDoc();
  }
  this.loadXMLDoc=function (){
            var StringSend="";
            // var xmlhttp;
            // if (window.XMLHttpRequest)
            //   {// code for IE7+, Firefox, Chrome, Opera, Safari
            //   xmlhttp=new XMLHttpRequest();
            //   }
            // else
            //   {// code for IE6, IE5
            //   xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
            //   }
            // xmlhttp.onreadystatechange=function()
            //   {
            //   if (xmlhttp.readyState==4 && xmlhttp.status==200)
            //     {
               
            //         console.log(xmlhttp.responseText)
            //    // document.getElementById("myDiv").innerHTML=xmlhttp.responseText;
            //     }
            //   }
            // xmlhttp.open("POST","http://localhost:3000/",true);
            // xmlhttp.send({"jeff":"rules"});


            var xhr = new XMLHttpRequest();
            xhr.open("POST", "https://54.242.240.99/mainpost", true);
            //xhr.open("POST", "https://127.0.0.1/", true);
            xhr.onreadystatechange = function(data) {
              if (xhr.readyState == 4) {
                // JSON.parse does not evaluate the attacker's scripts.

                if (xhr.responseText!="")
                var resp = JSON.parse(xhr.responseText);

                ///if the response has no data load reportive
                if (resp && resp.status && resp.result && t.emailCurrent.value==resp.result.email)
               // t.emailCurrent.value=resp.result.email,
              //  t.emailCurrent.type="scraped",
                t.switch(),
                t.update(resp); 
                else
                t.switchoff()


                //console.log(xhr.responseText)
              }else{
                t.switchoff()
              }
            };

            xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            
            // "firstname="+t.data.firstName+"&surname="+t.data.lastName
            if (t.data.firstName)
            StringSend+=t.postname("givenname", t.data.firstName)
            if (t.data.lastName)
            StringSend+=t.postname("surname", t.data.lastName)
            if (t.data.email)
            StringSend+=t.postname("email", t.data.email);
            if (t.data.twitter)
            StringSend+=t.postname("twitter_username", t.data.twitter)
            if (t.data.linkedin)
            StringSend+=t.postname("linkedin_link", t.data.linkedin)
            if (t.data.facebook)
            StringSend+=t.postname("facebook_link", t.data.facebook)
            if (t.data.angellist)
            StringSend+=t.postname("angellist_link", t.data.angellist)
            if (t.data.img)
            StringSend+=t.postname("img", t.data.img)

            //if (t.data.title)
            if (t.data.jobs)
            for (var i = t.data.jobs.length - 1; i >= 0; i--) {
              StringSend+=t.postname("name["+i+"]",  t.data.jobs[i].name)
              StringSend+=t.postname("title["+i+"]",  t.data.jobs[i].title)
            };



            

            // StringSend+=t.postname("title", t.data.title)
            // if (t.data.company)
            // StringSend+=t.postname("company", t.data.company)
            //console.log(StringSend)
            xhr.send(StringSend);

            //xhr.send('{"jeff":"rules"}');

    }
    this.postname=function(name, value){

        var string=name+"="+value+"&"
        return string

    }
    this.update=function(data){


      // data={}
      // data.src="https://mail.google.com/mail/c/u/0/photos/public/AIbEiAIAAABDCNqt5snR1YzvbSILdmNhcmRfcGhvdG8qKGZlMDY4NWEyYWQ3YWU2OWYxZjIwNzdlYjU3YjhkNDQwMjQzMWQ4ZGIwAcSjhR4fOWSZ-rLx8juc3tfFHmri?sz=64"
      // data.title="CEO"
      // data.email="jenkinsjeffrey@gmail.com"
      // data.name="Love It"
      // data.org="Stuffy"
      html=""
      html=mainContactTmpl(data)

      for (var i = data.index.length - 1; i >= 0; i--) {
        html+=altContactTmpl( data.index[i] )
      };

      // html=altContactTmpl(data.result.index[0])
      //     html+=altContactTmpl(data)
      //     html+=altContactTmpl(data)
      //     html+=altContactTmpl(data)
      //     html+=altContactTmpl(data)
      //     html+=altContactTmpl(data)    
     
      t.mainDiv.innerHTML=html

      //binders go here
      document.getElementsByClassName("toggler")[0].onclick=getdataObj.switchoff


      //data[0].success

    }
    this.inject=function(){

      var m, n,mainDiv;
      
      m=getAllElementsWithAttributeValue("role","main")
      n=m[0].getElementsByClassName("Bu")

      for (var i = n.length - 1; i >= 0; i--) {
        if ( n[i].className.match(/y3/)!=null && n[i].className.match(/dotz/)==null ){
          t.rapportiveDiv=rapportiveDiv=n[i]
        } else if (n[i].className.match(/dotz/)!=null){
          mainDiv=n[i]
        }
      };
      if (!mainDiv){
     //   rapportiveDiv.style.display="none"
        parent=n[0].parentNode
        mainDiv=document.createElement('td')
        mainDiv.className="Bu y3 dotz"
        mainDiv.innerHTML='<div style="padding:5px;">Loading Data...</div>'
        parent.appendChild(mainDiv)
      }

      //mainDiv.innerHTML="yaya"

      t.mainDiv=mainDiv
      t.rapportiveDiv=rapportiveDiv
  }
  this.clear =function(){
      if (t.mainDiv)
        t.mainDiv.innerHTML='<div style="padding:5px;">Loading Data...</div>'
  }
    
    this.showDiv =function(){
      t.mainDiv.style.display=""
    }
    this.hideDiv =function(){
      t.mainDiv.style.display="none"
    }
    this.hideOther =function(){
      if (t.rapportiveDiv)
        t.rapportiveDiv.style.display="none"

    }
    this.showOther =function(){
      t.rapportiveDiv.style.display=""

    }
    this.switch =function(){
        t.showDiv(),t.hideOther(), t.active=true;
    }
    this.switchoff =function(){
        t.hideDiv(),t.showOther(), t.active=false;
    }



  }

  getdataObj=new getdata()


  function striphtml(html)


{
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent||tmp.innerText;
}


   	 // if (mutations[i].target.className=="email"){

   	 // 	   	  //console.log( mutations[i].target.innerHTML )
            



     //        console.log( o )

   	 // }


   	 //  if (mutations[i].target.className=="job-title"){

   	 // 	   	 	   	 	console.log( mutations[i].target.innerHTML )

   	 // }


   	 //  if (mutations[i].target.className=="company"){

   	 // 	   	 	   	 	console.log( mutations[i].target.innerHTML )

   	 // }





// var dividertmpl='<div class="hx" style="
//     width: 100%;
//     border-bottom: 1px solid #eee;
//     height: 10px;
// "></div>'
function mainContactTmpltwo(data){

  var orginType="id_finish"
  var contacttmpl='<div class="hx">'
  contacttmpl+='<div class="aju"><div class="aCi"><div class="aFg" style="display: none;"></div><img id=":0_2-e" name=":0" src="'+data.result.img+'" class="ajn" style="background-color: #a4c2f4" aria-label=" "></div></div>'
  contacttmpl+='<div class="gs gt"><div class="gE hI"><table cellpadding="1" class="cf gJ" recipienthovers="true"><tbody>'
  contacttmpl+=titleTMPL(data.result)
  contacttmpl+=''
   for (var i = data.edges.length - 1; i >= 0; i--) {
     var input = {"relationship":data.edges[i].relationship,"name": data.edges[i].id_finish.name }
     contacttmpl+=jobTMPL(input)

   }
//  contacttmpl+='</tbody></table>'
  contacttmpl+='</td></tr></tbody></table>'
  contacttmpl+=iconTMPL(data.result)
  contacttmpl+='</div></div></div>'
  return contacttmpl
 //  var mainContacttmpl=' <div class="hx">'
 //  mainContacttmpl+=' <div class="aju"><div class="aCi"><div class="aFg" style="display: none;"></div><img id=":0_2-e" name=":0" src="'+data.result.img+'" class="ajn" style="background-color: #a4c2f4" jid="ulysses.design@yahoo.com" aria-label=" "></div></div>'
 //  mainContacttmpl+='<div class="gs gt"><div class="gE hI"><table cellpadding="1" class="cf gJ" recipienthovers="true"><tbody>'
 //  mainContacttmpl+=titleTMPL(data.result)
 //  mainContacttmpl+=' <table cellpadding="1" class="cf iB" recipienthovers="true"> <tbody> </tbody></table></td></tr>'

 // // var data={title:"Conductor",org:"startupbus"}

 //  for (var i = data.edges.length - 1; i >= 0; i--) {
 //    orginType="id_finish"
 //    input={"relationship" : data.edges[i].relationship, "name" : data.edges[i][orginType].name }
 //    mainContacttmpl+=jobTMPL(data.edges[i], orginType)
 //  };
 //  mainContacttmpl+='</tbody></table>'
 //  mainContacttmpl+=iconTMPL(data.result)

 //  mainContacttmpl+='</td></tr></tbody></table></div></div></div>'
 //  mainContacttmpl+='<div class="hx" style="width: 100%; border-bottom: 1px solid #eee; height: 10px;"></div>'
 //  return mainContacttmpl

  //


}



function altContactTmpl(data){
  //orginType=orgin(data)
  var orginType="id_finish"
  var contacttmpl='<div class="hx">'
  contacttmpl+='<div class="aju"><div class="aCi"><div class="aFg" style="display: none;"></div><img id=":0_2-e" name=":0" src="'+data[0].article.img+'" class="ajn" style="background-color: #a4c2f4" aria-label=" "></div></div>'
  contacttmpl+='<div class="gs gt"><div class="gE hI"><table cellpadding="1" class="cf gJ" recipienthovers="true"><tbody>'
  contacttmpl+=titleTMPL(data[0].article)
  contacttmpl+=''
  for (var i = 0; i < data.length; i++) {
  var input = {"relationship":data[i].edge.relationship,"name": data[i].orgin.name, "title": data[i].edge.title }
  contacttmpl+=jobTMPL(input)
  };


  contacttmpl+='</td></tr></tbody></table>'
  contacttmpl+=iconTMPL(data[0].article)
  contacttmpl+='</div></div></div>'
  return contacttmpl
}

//<div class="gs gt" style="padding: 0px 7px 0px 0px;">

function mainContactTmpl(data){
  var contacttmpl='<div class="hx" style="height: 110px;">  <div class="gE hI" style="">'
  contacttmpl+='<table cellpadding="1" class="cf gJ" recipienthovers="true" style="float: left;"><tbody>'
  contacttmpl+='<tr> <td class="gF gK" style="width:auto"><h1 email="p.bergerii@gmail.com" class="gD" style="font-size: 14px;">'+data.result.givenname+' '+data.result.surname+'</td></tr>'
  //contacttmpl+='</h1>'
  contacttmpl+='<tr><td class="gF gK" style="width:auto"><h1 class="gD" style="font-size: 12px; color: #777; font-weight: normal; ">'+data.result.location+'</h1></td> </tr>'
  contacttmpl+='<tr><td class="gF gK" style="width:auto">'+iconTMPL(data.result)+'</td> </tr>'

  //contacttmpl+=iconTMPL(data.result)
  contacttmpl+='</tbody>'
  contacttmpl+='</table>'

  contacttmpl+='<div class="Vt" style="float: right;"><img src="'+data.result.img+'" width="75px" height="75px"> <a target="_blank" class="g-s-n-aa Wk"></a></div> '

  contacttmpl+='</div></div>'
  //</div>
  contacttmpl+='<div class="hx" style=""><div class="gE hI gt" style=""><table cellpadding="1" class="cf gJ" recipienthovers="true"><tbody>'
  // contacttmpl+=jobTMPL(data)
  for (var i = data.edges.length - 1; i >= 0; i--) {
    var input = {"relationship":data.edges[i].relationship,"name": data.edges[i].id_finish.name, "title": data.edges[i].title }
    contacttmpl+=jobTMPL(input)
  };
  contacttmpl+='</tbody></table></div>'
  contacttmpl+='<div style="text-align: right; padding-right: 5px;"><a href="javascript:void(0);" aria-haspopup="true" class="ajy toggler" style=" text-decoration: none; color: #999; font-size: 12px; float: right; margin-top:-10px;">toggle</a></div>'
  contacttmpl+='<div style="border-bottom: 1px solid #eee; margin: 17px 20px 5px;"></div>'
  contacttmpl+='</div>'
  return contacttmpl
}








function iconTMPL(data){
  var contacttmpl=""
  contacttmpl+='<div style="text-align: right; padding-right: 5px;">'
  if (data.facebook_link)
  contacttmpl+='<a href="'+data.facebook_link+'" aria-haspopup="true" class="ajy"><img class="ajz" id=":on" role="button" tabindex="0" src="https://rapportive.com/images/icons/facebook.png" alt="" data-tooltip="Facebook" aria-label="Show details"></a>'
  if (data.twitter_username)
  contacttmpl+='<a href="https://twitter.com/'+data.twitter_username+'" aria-haspopup="true" class="ajy"><img class="ajz" id=":on" role="button" tabindex="0" src="https://rapportive.com/images/icons/twitter.png" alt="" data-tooltip="Twitter" aria-label="Show details"></a>'
  if (data.linkedin_link)
  contacttmpl+='<a href="'+data.linkedin_link+'" aria-haspopup="true" class="ajy"><img class="ajz" id=":on" role="button" tabindex="0" src="https://rapportive.com/images/icons/linkedin.png" alt="" data-tooltip="Twitter" aria-label="Show details"></a>'
  if (data.angellist_link)
  contacttmpl+='<a href="'+data.angellist_link+'" aria-haspopup="true" class="ajy"><img class="ajz" id=":on" role="button" tabindex="0" src="https://rapportive.com/images/icons/angellist.png" alt="" data-tooltip="Twitter" aria-label="Show details"></a>'
  contacttmpl+='</div>'
  return contacttmpl

}



function jobTMPL(data){
  var mainContacttmpl=""
  mainContacttmpl+=' <tr style=""><td class="gF gK" colspan="3"> <table cellpadding="1" class="cf iB" recipienthovers="true"><tbody><tr style="'
  mainContacttmpl+=' margin-top: 3px;'
  mainContacttmpl+=' "><td> <div class="" style=" white-space: normal; ">'
  if (data.relationship=="employee")
  mainContacttmpl+=data.title+' at '+data.name
  else if (data.relationship=="investments")
  mainContacttmpl+='Investmented in '+data.name
  else
  mainContacttmpl+=' '


  mainContacttmpl+='</div> </td></tr></tbody></table></tr>'
  return mainContacttmpl
}

function titleTMPL(data){
  var contacttmpl=""
  contacttmpl+='<tr> <td class="gF gK" style="width:auto">'
    contacttmpl+='<span class="gD">'+data.givenname+" "+data.surname+'</span>'
   if (data.email && data.email.length)
   contacttmpl+='<div style="color: #999;" id=":ox" class="g3">'+data.email+'</div>'

   contacttmpl+='</td>'
   //contacttmpl+='<td class="gF gK"><table cellpadding="1" class="cf iB za"><tbody><tr><td></td></tr> </tbody> </table></td><td class="gH"><span></span>'

   //contacttmpl+='</td></tr>'
  return contacttmpl
}




  //this use this to kill raportives section
//  document.getElementsByClassName("basic-info-section")[0].parentNode

  // we use this to get all the attribures

function getAllElementsWithAttributeValue(attribute, value, div)
{
  var matchingElements = [],allElements,  type;
  if (!type)
  type='*'
  if (div)
    allElements=div
  else
    allElements = document.getElementsByTagName('*');
  for (var i = 0; i < allElements.length; i++)
  {
    if (allElements[i].getAttribute(attribute) && allElements[i].getAttribute(attribute)==value)
    {
      // Element exists with attribute. Add to array.
      matchingElements.push(allElements[i]);
    }
  }
  return matchingElements;
}

function getAllElementsWithAttribute(attribute, type, div)
{
  var matchingElements = [], allElements,  type;
  if (!type)
  type='*'
  if (div)
    allElements=div
  else
    allElements = document.getElementsByTagName('*');
  for (var i = 0; i < allElements.length; i++)
  {
    if (allElements[i].getAttribute(attribute))
    {
      // Element exists with attribute. Add to array.
      matchingElements.push(allElements[i]);
    }
  }
  return matchingElements;
}


//
//document.getElementsByClassName("go")
// var arrays=getAllElementsWithAttribute("email")
   
//	 console.log(mutations[i].target.className)

   	 



   // var m=$(mutations).attr("class")

   //  console.log( m )

   //  if (m="basic-info-section")
   //  	alert("basic-info-section")
    // ...
///});

// define what element should be observed by the observer
// and what types of mutations trigger the callback
observer.observe(document, {
  subtree: true,
  attributes: true
  //...
});



// (function(){var rapportive_server="https://localhost.com";var rapportive_launchpad_url="https://slidescroll.com/js/dotz.js";var server_log_level="info";function stackTrace(e){function chrome(e){var stack=(e.stack+'\n').replace(/^\S[^\(]+?[\n$]/gm,'').replace(/^\s+at\s+/gm,'').replace(/^([^\(]+?)([\n$])/gm,'{anonymous}()@$1$2').replace(/^Object.<anonymous>\s*\(([^\)]+)\)/gm,'{anonymous}()@$1').split('\n');stack.pop();return stack;}
// function firefox(e){return e.stack.replace(/(?:\n@:0)?\s+$/m,'').replace(/^\(/gm,'{anonymous}(').split('\n');}
// function opera10(e){var stack=e.stacktrace;var lines=stack.split('\n'),ANON='{anonymous}',lineRE=/.*line (\d+), column (\d+) in ((<anonymous function\:?\s*(\S+))|([^\(]+)\([^\)]*\))(?: in )?(.*)\s*$/i,i,j,len;for(i=2,j=0,len=lines.length;i<len-2;i++){if(lineRE.test(lines[i])){var location=RegExp.$6+':'+RegExp.$1+':'+RegExp.$2;var fnName=RegExp.$3;fnName=fnName.replace(/<anonymous function\:?\s?(\S+)?>/g,ANON);lines[j++]=fnName+'@'+location;}}
// lines.splice(j,lines.length-j);return lines;}
// function opera(e){var lines=e.message.split('\n'),ANON='{anonymous}',lineRE=/Line\s+(\d+).*script\s+(http\S+)(?:.*in\s+function\s+(\S+))?/i,i,j,len;for(i=4,j=0,len=lines.length;i<len;i+=2){if(lineRE.test(lines[i])){lines[j++]=(RegExp.$3?RegExp.$3+'()@'+RegExp.$2+RegExp.$1:ANON+'()@'+RegExp.$2+':'+RegExp.$1)+' -- '+lines[i+1].replace(/^\s+/,'');}}
// lines.splice(j,lines.length-j);return lines;}
// function stringifyArguments(args){var slice=Array.prototype.slice;for(var i=0;i<args.length;++i){var arg=args[i];if(arg===undefined){args[i]='undefined';}else if(arg===null){args[i]='null';}else if(arg.constructor){if(arg.constructor===Array){if(arg.length<3){args[i]='['+stringifyArguments(arg)+']';}else{args[i]='['+stringifyArguments(slice.call(arg,0,1))+'...'+stringifyArguments(slice.call(arg,-1))+']';}}else if(arg.constructor===Object){args[i]='#object';}else if(arg.constructor===Function){args[i]='#function';}else if(arg.constructor===String){args[i]='"'+arg+'"';}}}
// return args.join(',');}
// function other(curr){var ANON='{anonymous}',fnRE=/function\s*([\w\-$]+)?\s*\(/i,stack=[],fn,args,maxStackSize=10;while(curr&&stack.length<maxStackSize){fn=fnRE.test(curr.toString())?RegExp.$1||ANON:ANON;args=Array.prototype.slice.call(curr['arguments']||[]);stack[stack.length]=fn+'('+stringifyArguments(args)+')';curr=curr.caller;}
// return stack;}
// if(e['arguments']&&e.stack){return chrome(e);}else if(e.message&&typeof window!=='undefined'&&window.opera){return e.stacktrace?opera10(e):opera(e);}else if(e.stack){return firefox(e);}
// return other(e);}
// function loggily(category,continuation){return function loggilyInternal(){try{return continuation.apply(this,arguments);}catch(exception){var e=exception;if(!e||typeof e!=='object'){try{throw new Error(e);}catch(e2){e=e2;}}
// if(e.loggedByLoggily){throw e;}
// var exception_details={};var trace=stackTrace(e);if(trace){exception_details.backtrace=trace.join("\n");}
// exception_details.message=(e&&e.message?e.message:""+e);if(typeof rapportive==='object'&&rapportive&&rapportive.clientCodeTimestamp){exception_details.clientCodeTimestamp=rapportive.clientCodeTimestamp;}
// rapportiveLogger.error(category,"Rapportive exception: "+e,exception_details);rapportiveLogger.consoleLog("Rapportive exception: "+category+": "+e);if(exception_details.backtrace){rapportiveLogger.consoleLog(exception_details.backtrace);}
// try{e.loggedByLoggily=true;}catch(e3){}
// throw e;}};}
// function RapportiveLogger(server,minLevel,args){var _public={},_protected={};var max_log_history=10000;var bad_params={user_id:1,type:1,timestamp:1,controller:1,action:1,callback:1,category:1,level:1,path:1,format:1};var levels={all:0,debug:10,info:20,warn:30,warning:30,error:40,fatal:100};var callbackCount=(new Date()).getTime();_public.server=server;_public.minLevel=minLevel;function baseUrl(level,category){return _public.server+"/log/"+encodeURIComponent(category)+"/"+encodeURIComponent(level);}
// function garbageCollectionCode(callback){return"function "+callback+" () {\n"+"   try {\n"+"       window."+callback+" = undefined;\n"+"       delete window."+callback+";\n"+"   } catch (e) {}\n"+"   var request = document.getElementById('"+callback+"request');\n"+"   if (request) request.parentNode.removeChild(request);\n"+"   var callback = document.getElementById('"+callback+"callback');\n"+"   if (callback) callback.parentNode.removeChild(callback);\n"+"}\n";}
// function makeRequest(url,callback){var head=document.getElementsByTagName("head")[0]||document.documentElement;var garbageCollect=document.createElement("script");garbageCollect.id=callback+'callback';garbageCollect.type='text/javascript';garbageCollect.text=garbageCollectionCode(callback);head.insertBefore(garbageCollect,head.firstChild);var request=document.createElement("script");request.id=callback+'request';request.type='text/javascript';request.src=url;head.insertBefore(request,head.firstChild);}
// _public.log=function(level,category,message,params){if(message===undefined&&params===undefined){throw new Error("Please specify level, category and message");}
// if(levels[level]<levels[_public.minLevel]){return;}
// var callback='logger'+callbackCount;callbackCount+=1;var data='message='+encodeURIComponent(message)+'&callback='+callback;if(params){for(var param in params){if(params.hasOwnProperty(param)){if(bad_params[param]){throw new Error("Parameter '"+param+"' is reserved!");}
// data+='&'+encodeURIComponent(param)+'='+encodeURIComponent(params[param]);}}}
// makeRequest(baseUrl(level,category)+'?'+data,callback);};_public.debug=function(category,message,params){_public.log("debug",category,message,params);};_public.info=function(category,message,params){_public.log("info",category,message,params);};_public.warning=_public.warn=function(category,message,params){_public.log("warning",category,message,params);};_public.error=function(category,message,params){_public.log("error",category,message,params);};_public.fatal=function(category,message,params){_public.log("fatal",category,message,params);};_public.track=function(message,params,probability){if(undefined!==probability){var params_with_probability={probability:probability};for(var param in params){if(params.hasOwnProperty(param)){params_with_probability[param]=params[param];}}
// params=params_with_probability;}
// _public.log("info","track",message,params);};_public.consoleLog=function(message,server_category,server_level){var use_top_window=!(args&&args.in_iframe);try{if(use_top_window&&window.top&&window.top.console){window.top.console.log(message);}else if(window.console){window.console.log(message);}}catch(e){}
// _public.silentLog(message,server_category,server_level);};_public.silentLog=function(message,server_category,server_level){if(args&&args.log_history){while(args.log_history.length>max_log_history){args.log_history.shift();}
// args.log_history.push('['+(new Date()).toGMTString()+'] '+message);}
// if(server_category){_public.log(server_level||'debug',server_category,message);}};return _public;}
// var rapportiveLogger=RapportiveLogger(rapportive_server,server_log_level),fsLog=rapportiveLogger.consoleLog;function delayedConditionalExecute(options){var default_options={poll_delay:200,max_poll_attempts:100,failure_message:"Ran out of delayedConditionalExecute search attempts -- giving up!",condition:function(){throw"No condition supplied to delayedConditionalExecute!";},continuation:function(){},error_continuation:function(){},log_level_on_failure:"error",log_level_on_error:null};for(var key in options){if(options.hasOwnProperty(key)){default_options[key]=options[key];}}
// options=default_options;if(!options.log_category){throw"delayedConditionalExecute needs a log_category";}
// var attempts=0;function log(message,additional_message,category,level){if(typeof(message)==="function"){message=message();}
// if(message){fsLog(message+" "+(additional_message||""),category,level);}}
// function doAttempt(){if(options.condition()){loggily(options.log_category+".success."+options.continuation.name,options.continuation)();}else{if(attempts<options.max_poll_attempts){attempts+=1;log(options.retry_message);window.setTimeout(loggily(options.log_category+".attempt.subsequent",doAttempt),options.poll_delay);}else{loggily(options.log_category+".error."+options.error_continuation.name,options.error_continuation)();log(options.failure_message,null,options.log_category,options.log_level_on_failure);}}}
// loggily(options.log_category+".attempt.first",doAttempt)();}
// function fireWhenVisible(options){var attempts=500,poll_delay=20;if(options&&options.max_wait){attempts=(1000/poll_delay)*options.max_wait;}
// delayedConditionalExecute({poll_delay:poll_delay,max_poll_attempts:attempts,failure_message:"Failed to find visible item",log_category:options.log_category,condition:function(){return options.condition().is(':visible');},continuation:options.continuation||function(){},error_continuation:options.error_continuation||function(){}});}
// function scriptTag(options){var attempt=1,doc=options.document||document,script_url=options.script_url,script_id=options.script_id,loaded_indicator=options.loaded_indicator,log_category=options.log_category||'gmail.loader.initialize';function getAttemptUrl(){return script_url.replace(/(\?[^#]*)?(?=#|$)/,function(query){return(query?query+"&attempt=":"?attempt=")+encodeURIComponent(attempt);});}
// function createScriptElement(){var head=doc.getElementsByTagName("head")[0];if(head){var script=doc.getElementById(script_id);if(script){attempt=Number(script.getAttribute('data-rapportive-attempt'))+1;}else{fsLog("Loading "+script_id+"... (attempt "+attempt+")");script=doc.createElement("script");script.type="text/javascript";script.src=getAttemptUrl();script.setAttribute("id",script_id);script.setAttribute("data-rapportive-attempt",attempt);script.addEventListener('error',function(){window.setTimeout(function(){head.removeChild(script);},5000*attempt);},false);head.appendChild(script);attempt+=1;}}}
// delayedConditionalExecute({poll_delay:1000,max_poll_attempts:200,failure_message:'Rapportive application injected, but failed to initialize',log_category:log_category,condition:function(){var html=doc.getElementsByTagName('html')[0];if(html&&html.getAttribute(loaded_indicator)==='true'){fsLog(loaded_indicator+' ok');return true;}else{if(attempt<=5){createScriptElement();}
// return false;}}});}
// function injectRapportive(doc){scriptTag({document:doc,script_url:rapportive_launchpad_url,script_id:'rapportiveLaunchpad',loaded_indicator:'data-rapportive-launchpad'});}
// if("mail.google.com"===document.location.host){fsLog('Bootstrapping Rapportive on '+document.location.href);try{injectRapportive(document);}catch(e){fsLog("Exception in chrome extension: "+e,"extension.setup","fatal");}}}());

// (function(){var rapportive_server="https://rapportive.com";var rapportive_launchpad_url="https://rapportive.com/load/launchpad?client=ChromeExtension+rapportive+1.4.1";var server_log_level="info";function stackTrace(e){function chrome(e){var stack=(e.stack+'\n').replace(/^\S[^\(]+?[\n$]/gm,'').replace(/^\s+at\s+/gm,'').replace(/^([^\(]+?)([\n$])/gm,'{anonymous}()@$1$2').replace(/^Object.<anonymous>\s*\(([^\)]+)\)/gm,'{anonymous}()@$1').split('\n');stack.pop();return stack;}
// function firefox(e){return e.stack.replace(/(?:\n@:0)?\s+$/m,'').replace(/^\(/gm,'{anonymous}(').split('\n');}
// function opera10(e){var stack=e.stacktrace;var lines=stack.split('\n'),ANON='{anonymous}',lineRE=/.*line (\d+), column (\d+) in ((<anonymous function\:?\s*(\S+))|([^\(]+)\([^\)]*\))(?: in )?(.*)\s*$/i,i,j,len;for(i=2,j=0,len=lines.length;i<len-2;i++){if(lineRE.test(lines[i])){var location=RegExp.$6+':'+RegExp.$1+':'+RegExp.$2;var fnName=RegExp.$3;fnName=fnName.replace(/<anonymous function\:?\s?(\S+)?>/g,ANON);lines[j++]=fnName+'@'+location;}}
// lines.splice(j,lines.length-j);return lines;}
// function opera(e){var lines=e.message.split('\n'),ANON='{anonymous}',lineRE=/Line\s+(\d+).*script\s+(http\S+)(?:.*in\s+function\s+(\S+))?/i,i,j,len;for(i=4,j=0,len=lines.length;i<len;i+=2){if(lineRE.test(lines[i])){lines[j++]=(RegExp.$3?RegExp.$3+'()@'+RegExp.$2+RegExp.$1:ANON+'()@'+RegExp.$2+':'+RegExp.$1)+' -- '+lines[i+1].replace(/^\s+/,'');}}
// lines.splice(j,lines.length-j);return lines;}
// function stringifyArguments(args){var slice=Array.prototype.slice;for(var i=0;i<args.length;++i){var arg=args[i];if(arg===undefined){args[i]='undefined';}else if(arg===null){args[i]='null';}else if(arg.constructor){if(arg.constructor===Array){if(arg.length<3){args[i]='['+stringifyArguments(arg)+']';}else{args[i]='['+stringifyArguments(slice.call(arg,0,1))+'...'+stringifyArguments(slice.call(arg,-1))+']';}}else if(arg.constructor===Object){args[i]='#object';}else if(arg.constructor===Function){args[i]='#function';}else if(arg.constructor===String){args[i]='"'+arg+'"';}}}
// return args.join(',');}
// function other(curr){var ANON='{anonymous}',fnRE=/function\s*([\w\-$]+)?\s*\(/i,stack=[],fn,args,maxStackSize=10;while(curr&&stack.length<maxStackSize){fn=fnRE.test(curr.toString())?RegExp.$1||ANON:ANON;args=Array.prototype.slice.call(curr['arguments']||[]);stack[stack.length]=fn+'('+stringifyArguments(args)+')';curr=curr.caller;}
// return stack;}
// if(e['arguments']&&e.stack){return chrome(e);}else if(e.message&&typeof window!=='undefined'&&window.opera){return e.stacktrace?opera10(e):opera(e);}else if(e.stack){return firefox(e);}
// return other(e);}
// function loggily(category,continuation){return function loggilyInternal(){try{return continuation.apply(this,arguments);}catch(exception){var e=exception;if(!e||typeof e!=='object'){try{throw new Error(e);}catch(e2){e=e2;}}
// if(e.loggedByLoggily){throw e;}
// var exception_details={};var trace=stackTrace(e);if(trace){exception_details.backtrace=trace.join("\n");}
// exception_details.message=(e&&e.message?e.message:""+e);if(typeof rapportive==='object'&&rapportive&&rapportive.clientCodeTimestamp){exception_details.clientCodeTimestamp=rapportive.clientCodeTimestamp;}
// rapportiveLogger.error(category,"Rapportive exception: "+e,exception_details);rapportiveLogger.consoleLog("Rapportive exception: "+category+": "+e);if(exception_details.backtrace){rapportiveLogger.consoleLog(exception_details.backtrace);}
// try{e.loggedByLoggily=true;}catch(e3){}
// throw e;}};}
// function RapportiveLogger(server,minLevel,args){var _public={},_protected={};var max_log_history=10000;var bad_params={user_id:1,type:1,timestamp:1,controller:1,action:1,callback:1,category:1,level:1,path:1,format:1};var levels={all:0,debug:10,info:20,warn:30,warning:30,error:40,fatal:100};var callbackCount=(new Date()).getTime();_public.server=server;_public.minLevel=minLevel;function baseUrl(level,category){return _public.server+"/log/"+encodeURIComponent(category)+"/"+encodeURIComponent(level);}
// function garbageCollectionCode(callback){return"function "+callback+" () {\n"+"   try {\n"+"       window."+callback+" = undefined;\n"+"       delete window."+callback+";\n"+"   } catch (e) {}\n"+"   var request = document.getElementById('"+callback+"request');\n"+"   if (request) request.parentNode.removeChild(request);\n"+"   var callback = document.getElementById('"+callback+"callback');\n"+"   if (callback) callback.parentNode.removeChild(callback);\n"+"}\n";}
// function makeRequest(url,callback){var head=document.getElementsByTagName("head")[0]||document.documentElement;var garbageCollect=document.createElement("script");garbageCollect.id=callback+'callback';garbageCollect.type='text/javascript';garbageCollect.text=garbageCollectionCode(callback);head.insertBefore(garbageCollect,head.firstChild);var request=document.createElement("script");request.id=callback+'request';request.type='text/javascript';request.src=url;head.insertBefore(request,head.firstChild);}
// _public.log=function(level,category,message,params){if(message===undefined&&params===undefined){throw new Error("Please specify level, category and message");}
// if(levels[level]<levels[_public.minLevel]){return;}
// var callback='logger'+callbackCount;callbackCount+=1;var data='message='+encodeURIComponent(message)+'&callback='+callback;if(params){for(var param in params){if(params.hasOwnProperty(param)){if(bad_params[param]){throw new Error("Parameter '"+param+"' is reserved!");}
// data+='&'+encodeURIComponent(param)+'='+encodeURIComponent(params[param]);}}}
// makeRequest(baseUrl(level,category)+'?'+data,callback);};_public.debug=function(category,message,params){_public.log("debug",category,message,params);};_public.info=function(category,message,params){_public.log("info",category,message,params);};_public.warning=_public.warn=function(category,message,params){_public.log("warning",category,message,params);};_public.error=function(category,message,params){_public.log("error",category,message,params);};_public.fatal=function(category,message,params){_public.log("fatal",category,message,params);};_public.track=function(message,params,probability){if(undefined!==probability){var params_with_probability={probability:probability};for(var param in params){if(params.hasOwnProperty(param)){params_with_probability[param]=params[param];}}
// params=params_with_probability;}
// _public.log("info","track",message,params);};_public.consoleLog=function(message,server_category,server_level){var use_top_window=!(args&&args.in_iframe);try{if(use_top_window&&window.top&&window.top.console){window.top.console.log(message);}else if(window.console){window.console.log(message);}}catch(e){}
// _public.silentLog(message,server_category,server_level);};_public.silentLog=function(message,server_category,server_level){if(args&&args.log_history){while(args.log_history.length>max_log_history){args.log_history.shift();}
// args.log_history.push('['+(new Date()).toGMTString()+'] '+message);}
// if(server_category){_public.log(server_level||'debug',server_category,message);}};return _public;}
// var rapportiveLogger=RapportiveLogger(rapportive_server,server_log_level),fsLog=rapportiveLogger.consoleLog;function delayedConditionalExecute(options){var default_options={poll_delay:200,max_poll_attempts:100,failure_message:"Ran out of delayedConditionalExecute search attempts -- giving up!",condition:function(){throw"No condition supplied to delayedConditionalExecute!";},continuation:function(){},error_continuation:function(){},log_level_on_failure:"error",log_level_on_error:null};for(var key in options){if(options.hasOwnProperty(key)){default_options[key]=options[key];}}
// options=default_options;if(!options.log_category){throw"delayedConditionalExecute needs a log_category";}
// var attempts=0;function log(message,additional_message,category,level){if(typeof(message)==="function"){message=message();}
// if(message){fsLog(message+" "+(additional_message||""),category,level);}}
// function doAttempt(){if(options.condition()){loggily(options.log_category+".success."+options.continuation.name,options.continuation)();}else{if(attempts<options.max_poll_attempts){attempts+=1;log(options.retry_message);window.setTimeout(loggily(options.log_category+".attempt.subsequent",doAttempt),options.poll_delay);}else{loggily(options.log_category+".error."+options.error_continuation.name,options.error_continuation)();log(options.failure_message,null,options.log_category,options.log_level_on_failure);}}}
// loggily(options.log_category+".attempt.first",doAttempt)();}
// function fireWhenVisible(options){var attempts=500,poll_delay=20;if(options&&options.max_wait){attempts=(1000/poll_delay)*options.max_wait;}
// delayedConditionalExecute({poll_delay:poll_delay,max_poll_attempts:attempts,failure_message:"Failed to find visible item",log_category:options.log_category,condition:function(){return options.condition().is(':visible');},continuation:options.continuation||function(){},error_continuation:options.error_continuation||function(){}});}
// function scriptTag(options){var attempt=1,doc=options.document||document,script_url=options.script_url,script_id=options.script_id,loaded_indicator=options.loaded_indicator,log_category=options.log_category||'gmail.loader.initialize';function getAttemptUrl(){return script_url.replace(/(\?[^#]*)?(?=#|$)/,function(query){return(query?query+"&attempt=":"?attempt=")+encodeURIComponent(attempt);});}
// function createScriptElement(){var head=doc.getElementsByTagName("head")[0];if(head){var script=doc.getElementById(script_id);if(script){attempt=Number(script.getAttribute('data-rapportive-attempt'))+1;}else{fsLog("Loading "+script_id+"... (attempt "+attempt+")");script=doc.createElement("script");script.type="text/javascript";script.src=getAttemptUrl();script.setAttribute("id",script_id);script.setAttribute("data-rapportive-attempt",attempt);script.addEventListener('error',function(){window.setTimeout(function(){head.removeChild(script);},5000*attempt);},false);head.appendChild(script);attempt+=1;}}}
// delayedConditionalExecute({poll_delay:1000,max_poll_attempts:200,failure_message:'Rapportive application injected, but failed to initialize',log_category:log_category,condition:function(){var html=doc.getElementsByTagName('html')[0];if(html&&html.getAttribute(loaded_indicator)==='true'){fsLog(loaded_indicator+' ok');return true;}else{if(attempt<=5){createScriptElement();}
// return false;}}});}
// function injectRapportive(doc){scriptTag({document:doc,script_url:rapportive_launchpad_url,script_id:'rapportiveLaunchpad',loaded_indicator:'data-rapportive-launchpad'});}
// if("mail.google.com"===document.location.host){fsLog('Bootstrapping Rapportive on '+document.location.href);try{injectRapportive(document);}catch(e){fsLog("Exception in chrome extension: "+e,"extension.setup","fatal");}}}());