/**
 * Created by raphael on 11/9/16.
 */

$(document).ready(function (){

   var tries = 0;

   var contNav = 0;

   var _class_ = "visible-";

   var totalPoints = 0;

   var arrayTries = [];

   $('.navleft').addClass('hideElement');

   setClass();
   clearJson();

   function setClass(){

       if($(window).width() < 768 ){
           _class_ +='xs';
           if($(window).height() >= 660){
               _class_ += ' xs-special';
           }
       }else if( $(window).width() <= 991){
          _class_ +='sm';
           if($(window).height() <= 600){
               _class_ += ' sm-special';
           }
       }else if( $(window).width() <= 1199){
          _class_ +='md';
       }else{
          _class_ +='lg';
       }

       if(_class_  != 'visible-lg'){

           $('.body-question').css('height',$(window).height() - 162.5+'px');

       }

   }

   var listHtml = '';
   var contentQuestionHtml = '';
   for(var i = 0; i < lo.question.length; i++) {
       var numQuestion = '00';
       var classPageActive = '';
       arrayTries[i] = lo.question[i].num_tries;
       if (i + 1 < 10) {
           numQuestion = '0' + (i + 1);
       } else {
           numQuestion = i + 1;
       }

       if (i + 1 == 1) {
           classPageActive = 'active'
       }
       listHtml += "<div data-slide-to="+(i)+" data-target='#carousel' class='listQuestion '><p> Questão " +
           numQuestion + "</p></div>";

       var contentAlternative = '';

       for (var n = 0; n < lo.question[i].alternativas.length; n++) {
             var k = n + Math.floor(Math.random() * (lo.question[i].alternativas.length - n));
             var temp = lo.question[i].alternativas[k];
             lo.question[i].alternativas[k] = lo.question[i].alternativas[n];
             lo.question[i].alternativas[n] = temp;
       }

       for(var j = 0; j < lo.question[i].alternativas.length; j++){

            contentAlternative += "<div class='pull-left option'>" +
            "<div class='btnRdExe'><input name='radioQuest' type='radio' value='"+
                lo.question[i].alternativas[j].correta+"' id='radioQuest-"+j+"'>"+
                "<label for='radioQuest-"+j+"'></label></div>"+
            "<div class='alternative' id='alt"+j+"' data-radio-select='"+j+"'>"+
                removeTag(lo.question[i].alternativas[j].resposta)+"</div>"+
            "<input type='hidden' value='0' id='page-"+i+"-tries'/> </div>";
       }



       contentQuestionHtml = "<div class='item "+classPageActive+"' id='page-"+i+"' >"+
           "<div class='question' id='question-"+numQuestion+
           "'>"+removeTag(lo.question[i].enunciado)+"</div>"+contentAlternative+"</div>";

       $('.carousel-inner').append(contentQuestionHtml);
   }

   var _html_ = "<div>"+listHtml+"</div>";

   $('[data-toggle="popover"]').popover({
       template: '<div class="popover " role="tooltip"><div class="silverarrow"></div>'+
                 '<div class="popover-content" style=""></div>'+
                 '</div>',
       content: _html_,
       viewport:'.row-header',
       html: true
   });



   $('[data-toggle="popover"]').on('shown.bs.popover',function(){

        $('.popover').css('left',parseInt($('.popover').css('left'))-32);
        $('.listQuestion').on('click',function () {
            removeActiveMenuPopover();

            $(this).addClass('active');
            contNav = parseInt($(this).attr('data-slide-to'));
            changeTitleQuest();
            changePage();
        });

        changeClassPopoverMenu();
   });

   $('[data-toggle="popover"]').on('hide.bs.popover',function(){

        $('.listQuestion').off('click');
   });


   $('#index-question').text('Questão 0'+(contNav+1));

   $(".navButton").on("click",function(){

       if(!$(this).hasClass('hideElement')){

            if($(this).hasClass('navleft')){
                contNav--;
            }else{
                contNav++;
            }

            if(contNav < 0){
                contNav = 0;
                //$(this).addClass('hideElement');
            }else if(contNav > lo.question.length-1){
                contNav = lo.question.length-1;
                //$(this).addClass('hideElement');
            }

            changeTitleQuest();
            changePage();

            if(contNav == lo.question.length-1){
                //completeQuest();
            }

            $('.carousel').carousel(contNav);
            $('.carousel').carousel('pause');
       }


   });

   $('.alternative').click(function(){
        $('#page-'+contNav+' input[name=radioQuest]').eq($(this).attr('data-radio-select')).trigger("click");
   });

   $('input[name=radioQuest]').change(function () {

       $('.resultAnswer').css('opacity','1');
       $('.result').css('display','block');
       $('.returnFalse').css('display','none');
       $('.returnTrue').css('display','none');
       $('.resultAnswer').off('click');
       $(this).attr("data-checked",true);

       $('p.tries').text(tries + '/' + arrayTries[parseInt(contNav)]);
       $('#page-' + parseInt(contNav)).find('input[name=radioQuest]').each(function(){
          var background = $(this).css('background-position-x');
          if(background == '-73px' || background == '-109px'){
              $(this).attr('checked', false);
              $(this).parent().removeClass('correct');
              $(this).parent().removeClass('wrong');
          }
       });

       var _thisInput_ = $(this);

       $('.resultAnswer').on('click',function(){

           if($(this).css('opacity') == 1) {
               tries++;
               // page-"+i+"-tries

               if ($('#page-' + parseInt(contNav)).find('input[name=radioQuest]:checked').val() == "true") {
                   $('.result').css('display', 'none');
                   $('.returnFalse').css('display', 'none');
                   $('.returnTrue').css('display', 'block');
                   _thisInput_.parent().addClass('correct');
                   $('#page-' + parseInt(contNav)).find('input[name=radioQuest]').attr("disabled", true);
                   $('#page-' + parseInt(contNav) + '-tries').attr('value',arrayTries[contNav]);
                   totalPoints++;
               } else {
                   $('.result').css('display', 'none');
                   $('.returnFalse').css('display', 'block');
                   $('.returnTrue').css('display', 'none');
                   $('#page-' + parseInt(contNav) + '-tries').attr('value',tries);
                   if (tries < arrayTries[contNav]) {
                       $('#phraseAux').text('Tente mais uma vez.');
                       _thisInput_.parent().addClass('wrong');
                   } else {
                       $('#phraseAux').text('Mais sorte na próxima.');
                       _thisInput_.parent().addClass('wrong');
                       $('#page-' + parseInt(contNav)).find('input[name=radioQuest]').each(function () {
                           if ($(this).val() == "true") {
                               $(this).parent().addClass('correct');
                           }
                       });
                       $('#page-' + parseInt(contNav)).find('input[name=radioQuest]').attr("disabled", true);
                   }
               }
               //verificar se o popover estiver aberto e atualizar ele.
               if($('.popover').is(':visible')){
                  changeClassPopoverMenu();
               }
               isFinish();
           }

       });
   });

   $('.alternative').each(function(){
       if($(this).width() < 262.390625){
          $(this).children('p').css("width", "262.390625");
          $(this).children('p').css("margin-top", "10px");
       }

   });

   $(window).resize(function(){
       //location.reload();
       $('.body-question').css('height',$(window).height() - 162.5+'px');
        $('.alternative').each(function(){

           if($(this).width() < 262.390625){
               $(this).children('p').css("width", "262.390625");
               $(this).children('p').css("margin-top", "10px");
           }

        });
   });

   function changeTitleQuest(){

       if(contNav+1 < 10){
           $('#index-question').text('Questão 0'+(contNav+1));
       }else if(contNav+1 >= 10){
           $('#index-question').text('Questão '+(contNav+1));
       }
   }

   $('.carousel').carousel('pause');

   function changePage(){

        tries = $('#page-' + contNav + '-tries').attr('value');
        var block = false;
        $('#page-' + parseInt(contNav)).find('input[name=radioQuest]').each(function () {
            if($(this).is(':checked')){
                block = true;
            }
        });

        if(block == false){
            $('.resultAnswer').css('opacity','0.5');
        }else{
            $('.resultAnswer').css('opacity','1');
        }

        if(tries == arrayTries[contNav]){
            var contChangeBackground = 0;
            $('#page-' + parseInt(contNav)).find('input[name=radioQuest]').each(function(){

                  var background = $(this).css('background-position-x');
                  if(background == '-73px' || background == '-109px'){
                        contChangeBackground++;
                  }

            });

            if(contChangeBackground == 2){
                $('.returnFalse').css('display','block');
                $('.returnTrue').css('display','none');
            }else if(contChangeBackground == 1){
                $('.returnFalse').css('display','none');
                $('.returnTrue').css('display','block');
            }
            $('.result').css('display','none');

        }else{
            $('.result').css('display','block');
            $('.returnFalse').css('display','none');
            $('.returnTrue').css('display','none');
            $('p.tries').text(tries + '/' + arrayTries[contNav]);
        }

        if($('.popover').is(':visible')){
            removeActiveMenuPopover();
            $('.listQuestion[data-slide-to="'+contNav+'"]').addClass('active');
        }

        if(contNav > 0){
            $('.navButton').removeClass('hideElement');
        }
        if(contNav < lo.question.length-1){
            $('.navButton').removeClass('hideElement');
        }
        if(contNav == 0){
            $('.navleft').addClass('hideElement');
        }else if(contNav == lo.question.length-1){
            $('.navright').addClass('hideElement');
        }

   }

   function changeClassPopoverMenu(){

       var contItem = 0;

       removeActiveMenuPopover();
       $('.listQuestion[data-slide-to="'+contNav+'"]').addClass('active');
       $('.item').each(function(){
           if($('#page-' + parseInt(contItem) + '-tries').attr('value') == arrayTries[contItem]){
               console.log('Completei a quest');
               var contChangeBackground = 0;
               $(this).find('input[name=radioQuest]').each(function(){

                  var background = $(this).css('background-position-x');
                  if(background == '-73px' || background == '-109px'){
                        contChangeBackground++;
                  }

               });

               if(contChangeBackground == 2){
                   $('.listQuestion[data-slide-to="'+contItem+'"]').addClass('wrong');
               }else if(contChangeBackground == 1){

                   $('.listQuestion[data-slide-to="'+contItem+'"]').addClass('correct');
               }

           }
           contItem++;
       });
   }

   function removeActiveMenuPopover() {
       $('.listQuestion').each(function(){
          if($(this).hasClass('active')){
               $(this).removeClass('active');
          }
       });
   }


    function isFinish() {

        try{

           var contCheckAllAnswer = 0;
           $('.item').each(function(){
	       
	       var _item_10 = $(this).attr('id');
               var contChangeBackground = 0;
               $(this).find('input[name=radioQuest]').each(function(){

                  var background = $(this).css('background-position-x');
                  if(background == '-73px' || background == '-109px'){
                        contChangeBackground++;
                  }
		  if(_item_10 == 'page-9'){
			console.log(background);
		  }	

               });

               if(contChangeBackground == 2 || contChangeBackground == 1 ){
                    contCheckAllAnswer++;
               }else{
                   console.log('dont answer yet');
               }

           });

           if(contCheckAllAnswer == lo.question.length){

                var totalPointsSetPoint = Math.floor((totalPoints * 100)/lo.question.length);
                scorm.data.set("cmi.core.score.raw",totalPointsSetPoint);
                if(totalPoints >= 7){
                    scorm.data.set("cmi.core.status","passed");
                    scorm.data.set("cmi.core.lesson_status","passed" );
                }else{
                    scorm.data.set("cmi.core.lesson_status","failed");
                }
                scorm.data.set("cmi.core.lesson_location",0);
           }

        }catch(err){
            alert('Scorm does not work'+err);
        }

    }

    function removeTag(_param){

        if(_param.match(/[A-z]\)\S*(?=<\/td>)/)){
             _param = _param.replace(/[A-z]\)\S*(?=<\/td>)/,'');
        }else if(_param.match(/[A-z]\)\s/)){
            _param = _param.replace(/[A-z]\)\s/,'');
        }

        if(_param.match(/(pre>)/)){
            return _param.replace(/(pre>)/g,'p>');
        }else{
            return _param;
        }
    }
    
    function clearJson(){

        for(var i =0; i < lo.question.length; i++){
            if(lo.question[i].enunciado == null){
                lo.question.splice(i,1);
            }
        }

    }

});

