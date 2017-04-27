/**
 * Created by Daniel on 22/04/2017.
 */

function showError(text) {
    $("#result_div").append(text + "</br>")
}

var drag = false;
var rect = {};
var moved = false;


$("#submit_multi").click(function () {
        var resultdiv = $("#result_div");
        resultdiv.empty();
        var images = Array.from(document.getElementById('images').files);

        if (images.length === 0) {
            resultdiv.append("<h3>Please select 1 or more images</h3>");
        }

        images.forEach(function callback(file, index, array) {


            var reader = new FileReader();
            var image = new Image();

            image.onload = function () {
                var canvas = $('<canvas style="float:left;position:absolute;top:0;left:0;z-index:1"/>');
                var canvas2 = $('<canvas style="float:left;position:absolute;top:0;left:0;z-index:2"/>');
                var width = this.width;
                var height = this.height;
                var scale = 1000 / width;

                canvas[0].height = canvas2[0].height = height * scale;
                canvas[0].width = canvas2[0].width = 1000;

                var ctx = canvas[0].getContext("2d");
                var ctx2 = canvas2[0].getContext("2d");
                ctx.drawImage(this, 0, 0, 1000, height * scale);
                // ctx2.drawImage(this, 0, 0, 1000, height*scale);

                var newdiv = $('<div style="width: 100%;position: relative;height:' + canvas[0].height + 'px"/>');
                var coords = $("<p></br></p>");
                var color = $("<p></br></p>");

                newdiv.append(canvas);
                newdiv.append(canvas2);
                resultdiv.append(newdiv);
                resultdiv.append(coords);
                resultdiv.append(color);

                canvas2.mousedown(function (e) {
                    mouseDown(e, canvas2[0]);
                });

                canvas2.mousemove(function (e) {
                    mouseMove(e, ctx2, canvas2[0]);
                });


                canvas2.mouseup(function (e) {
                    mouseUp(ctx2, canvas2[0]);
                    coords.empty();
                    color.empty();

                    var top, left, right, bottom;
                    top = rect.startY;
                    left = rect.startX;
                    if (rect.w > 0) {
                        right = rect.startX + rect.w;
                    } else {
                        right = rect.startX;
                        left = rect.startX + rect.w;
                    }
                    if (rect.h > 0) {
                        bottom = rect.startY + rect.h;
                    } else {
                        bottom = rect.startY;
                        top = rect.startY + rect.h;
                    }

                    var inverse = 1 / scale;
                    if (moved) {
                        coords.append("(" + parseInt(left * inverse) + "," + parseInt(top * inverse) + "," + parseInt(right * inverse) + "," + parseInt(bottom * inverse) + ")</br>");

                        var textarea1 = $('<textarea/>');
                        textarea1[0].innerText = coords[0].innerText;
                        resultdiv.append(textarea1);
                        textarea1[0].select();
                        document.execCommand("copy");
                        textarea1.remove();
                    } else {
                        var pixel = ctx.getImageData(rect.startX, rect.startY, 1, 1).data;
                        color.append("(" + pixel[0] + "," + pixel[1] + "," + pixel[2] + ")</br>");

                        var textarea = $('<textarea/>');
                        textarea[0].innerText = color[0].innerText;
                        resultdiv.append(textarea);
                        textarea[0].select();
                        document.execCommand("copy");
                        textarea.remove();
                    }


                    moved = false;
                });

            };

            reader.onload = function (event) {
                image.src = event.target.result;
            };

            reader.readAsDataURL(file);


        });

        function mouseDown(e, canvas) {
            rect.startX = e.pageX - canvas.parentElement.offsetLeft;
            rect.startY = e.pageY - canvas.parentElement.offsetTop;
            drag = true;
        }

        function mouseUp(ctx, canvas) {
            drag = false;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

        }

        function mouseMove(e, ctx, canvas) {
            if (drag) {
                moved = true;
                rect.w = (e.pageX - canvas.parentElement.offsetLeft) - rect.startX;

                rect.h = (e.pageY - canvas.parentElement.offsetTop) - rect.startY;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                draw(ctx);
            }
        }

        function draw(ctx) {

            ctx.fillStyle = 'rgba(66, 170, 244, 0.5)';
            ctx.fillRect(rect.startX, rect.startY, rect.w, rect.h);
        }

    }
);
