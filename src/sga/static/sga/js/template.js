let canvas;


class CanvasHandler
{
    constructor(state, canv_obj)
    {
        this.canv_obj = canv_obj;
        this.state = state;
        this.undo = [];
        this.redo = [];
    }
}

function save(index_local){
    canvas.redo = [];
    $('#redo').prop('disabled', true);
    if (canvas.state){
        canvas.undo.push(canvas.state);
        $('#undo').prop('disabled', false);
    }
    canvas.state = JSON.stringify(canvas.canv_obj);
    if ( window.localStorage.getItem(index_local)){
        window.localStorage.removeItem(index_local)
        window.localStorage.setItem(index_local, canvas.canv_obj)
    }
    else{
        window.localStorage.setItem(index_local, canvas.canv_obj)
    }

}
function replay(playStack, saveStack, buttonsOn, buttonsOff, index){
    if(saveStack =='redo'){
        canvas.redo.push(canvas.state);
        if(canvas.undo.length >= 2)
        {
            canvas.state = canvas.undo.pop();
        }

    }
    else if (saveStack == 'undo'){
        canvas.undo.push(canvas.state);
        if(canvas.redo.length >= 1)
        {
            canvas.state = canvas.redo.pop();
        }
    }
    let on = $(buttonsOn);
    let off = $(buttonsOff);
    on.prop('disabled', true);
    off.prop('disabled', true);

    canvas.canv_obj.clear();
    canvas.canv_obj.loadFromJSON(JSON.parse(canvas.state), function(){
        canvas.canv_obj.renderAll();
        on.prop('disabled', false);
        if(playStack == 'undo'){
            if (canvas.undo.length>=1){
                off.prop('disabled',false);
            }
        }
        else{
            if (canvas.redo.length>=1){
                off.prop('disabled',false);
            }
        }
    });

}

$(document).ready(function () {
    let formdata = $("#sgaform").serializeArray();

    $(".templatepreview").each(function(index, element){
        $.post(element.dataset.href,formdata,function(data, status){
            let json_object = {};
            let newcanvas = new fabric.Canvas(element.id);

            $(".img").each((i,e)=>{
             fabric.Image.fromURL(e.value, function (img) {
             img.scaleToWidth(100);
             img.scaleToHeight(100);
             img.set("top", 0);
             img.set("left", 0);
             img.set("centeredScaling", true);
             newcanvas.add(img);
         });
         });
            newcanvas.renderAll();

             canvas = new CanvasHandler(JSON.stringify(newcanvas), newcanvas);


           /* if( window.localStorage.getItem(element.id)){
                temp = window.localStorage.getItem(element.id);
                json_object = JSON.parse(temp)
            }
            else{*/
            json_object = data.object;
           // }
            canvas.canv_obj.loadFromJSON(data.object, function() {
                let view= $(".canvas-container-preview");
                //printdata();
                upWidth();
                //setTop();
                 // setWidth();
                  //discard();
                canvas.canv_obj.item(0).selectable = false;
                canvas.canv_obj['panning'] = false;
                canvas.canv_obj['onselected'] = false;
                canvas.canv_obj.on('mouse:wheel', function (opt) {
                    let delta = opt.e.deltaY;
                    let zoom = canvas.canv_obj.getZoom();
                    zoom = zoom + delta / 200;
                    if (zoom > 20) zoom = 20;
                    if (zoom < 0.01) zoom = 0.01;
                    canvas.canv_obj.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
                    opt.e.preventDefault();
                    opt.e.stopPropagation();
                 });
                canvas.canv_obj.on('mouse:up', function () {
                     canvas.canv_obj['panning'] = false;
                 });
                canvas.canv_obj.on('mouse:dblclick', function () {
                     if (!canvas.canv_obj['onselected']) {
                         canvas.canv_obj['panning'] = true;
                     }
                 });
                canvas.canv_obj.on('mouse:move', function (e) {
                     if (canvas.canv_obj['panning'] && e && e.e && !canvas.canv_obj['onselected']) {
                             var delta = new fabric.Point(e.e.movementX, e.e.movementY);
                             canvas.canv_obj.relativePan(delta);
                     }
                 });
                canvas.canv_obj.on('object:selected', function () {
                     canvas.canv_obj['onselected'] = true;
                 });
                canvas.canv_obj.on('before:selection:cleared', function () {
                     canvas.canv_obj['onselected'] = false;
                 });
                canvas.canv_obj.on('object:modified', function (e) {
                       save(element.id);
                 });

                let height = view.height();
                if (height < 400){
                    height = 400;
                }
                let width = view.width();
                console.log(width)
                if(width < 400 ){
                    width = 400;
                }
                canvas.canv_obj.setWidth(width);
                canvas.canv_obj.setHeight(height);
                canvas.canv_obj.renderAll();

                save(element.id);
            });
          });
    });
});

function printdata(){
    for(x in canvas.canv_obj.getObjects()){
        console.log(canvas.canv_obj.getObjects()[x].top);
    }
}
function upWidth(){
       for(let x in canvas.canv_obj.getObjects()){
               if(canvas.canv_obj.getObjects()[x].type=='textbox'){
                       let aux=canvas.canv_obj.getObjects()[x];
                       aux.width*=1.5;
                       let c=aux.left+aux.width-(1400);
                       aux.width-=(aux.left+aux.width)>=1450?c:0;
                       canvas.canv_obj.getObjects()[x].width=aux.width

                }
                }
	}
	function setWidth(){
    let i=0;
       for(let x in canvas.canv_obj.getObjects()){
        let canva=canvas.canv_obj.getObjects()[x];
         for(let y in canvas.canv_obj.getObjects()){
            let res=canvas.canv_obj.getObjects()[y];
             if(canva.left<res.left&&x!=y && (canva.width+canva.left)>res.left && (res.top+res.height>canva.top) && (canva.width+canva.left)<1200){
                       console.log(canva.width,''+canva.left,canva.text)
                       console.log(res)
                       canva.width-=(canva.width+canva.left)-res.left;
                       canvas.canv_obj.getObjects()[x].width=canva.width
                        x++;
                }
                }
	}
	}

function discard(){
       for(let x in canvas.canv_obj.getObjects()){
        let a=canvas.canv_obj.getObjects()[x];
         for(let y in canvas.canv_obj.getObjects()){
            let b=canvas.canv_obj.getObjects()[y];
             if(a.type=="textbox" && x!=y && a.width+a.left>b.left && b.top+b.height>a.top&& (a.width+a.left<1200)){
                canvas.canv_obj.getObjects()[x].width*=0.9;
        }
        }
}
}

function setTop(){
    let i=1;
    for(let x in canvas.canv_obj.getObjects()){
        canva=canvas.canv_obj.getObjects()[x]

        other=canvas.canv_obj.getObjects()[i]

        if(canva.top+canva.height< other.top && (canva.left<other.left||canva.left>other.left)){
            canvas.canv_obj.getObjects()[i].top=canva.top+canva.heigth;
    }
        i++;
        if(i>=canvas.canv_obj.getObjects().length){
        break;
        }
        }
}
function updateTop(){
       for(let x in canvas.canv_obj.getObjects()){
        let a=canvas.canv_obj.getObjects()[x];
         for(let y in canvas.canv_obj.getObjects()){
            let b=canvas.canv_obj.getObjects()[y];
             if(a.type=="textbox" && x!=y && a.width+a.left>b.left && b.top+b.height>a.top&& (a.width+a.left<1200)){
                canvas.canv_obj.getObjects()[x].width*=0.9;
        }
        }
}
}

function undoFunction(ele){
    replay('undo','redo','#redo','#undo', ele.dataset.order);
}

function redoFunction(ele){
    replay('redo','undo','#undo','#redo', ele.dataset.order );
}

$(document).ready(function(){
    $(".canvaspng").on('click', function(){
         let canva =  canvas;
         this.href=canva.toDataURL({ format: 'png', quality: 0.8});
    });
});

function get_canvas(pk){
        let id = canvas.canv_obj.lowerCanvasEl.id;
        if (id === "preview_" + pk.toString())
            return canvas.canv_obj;
     }


function get_as_pdf(pk){
    const canvas = get_canvas(pk);
    const json_data = JSON.stringify(canvas);

    $('#json_data').attr('value',json_data);
    $('#template_sga_pk').attr('value',pk)

    document.download_pdf.submit();
}

