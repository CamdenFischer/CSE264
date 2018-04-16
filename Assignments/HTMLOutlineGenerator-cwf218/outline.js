var head;

$(document).ready(function () {

    var head = $("link").first("*");
    appendOne(head);

    $("body").append("<ul>");

    $("*").each(function(){

        $(this).each(function() {

            $("body").append("<li>");

            $("body").append($(this).prop("tagName"));

            $.each(this.attributes, function() {
                if (this.specified){        
                    $("body").append(this.name + ": " + this.value);
                    $("body").append("</li>");
                }
            });
        });
    });

    $("body").append("</ul>");
   

 });

function appendOne(node){
    var str = '*';
    $.each(node.attriutes, function(){
        str += this.name + ': ' + this.value + ', ';
    })
}