/**
 * Created by raphael on 11/21/16.
 */
var scorm = pipwerks.SCORM;
scorm.version = "1.2";
scorm.connection.initialize();

window.onunload = function()
{
    try{
        if(scorm.connection.isActive)
        {
            pipwerks.UTILS.trace("Finalizando conexão no Unload");
            resumeSCORM();
            scorm.save();
            scorm.quit();
        }
    }catch(err) {
        console.log("Scorm does not start");
    }

};



function resumeSCORM(){
    try {
        if (typeof(scorm) != "undefined" && scorm.connection.isActive) {
            if (scorm.data.get("cmi.core.lesson_location") == "") {
                scorm.data.set("cmi.core.lesson_location", 0);
                scorm.data.set("cmi.score.min", 7);
                scorm.data.set("cmi.score.max", 10);
                scorm.data.set("cmi.core.score.raw", 0);

            }
            $('.carousel').carousel(parseInt(scorm.data.get("cmi.core.lesson_location")) + 1);
        }else {
            $('.carousel').carousel(0);
        }
    }catch(err){
        console.log('Scorm does not work'+err);
    }
};