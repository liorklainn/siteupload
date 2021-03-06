$(document).ready(function(){
    clearFinishStatus();
});

function clearFinishStatus()
{
    $('#successMsg').hide();
    $('#fileSizeToBigMsg').hide();
    $('#emailMustBeFilledMsg').hide();
}

$('.upload-btn').on('click', function (){
    clearFinishStatus();

    if (!$("#ownerEmailInput").val())
    {
        $('#emailMustBeFilledMsg').show();
        return;
    }

    $('#upload-input').click();
    $('.progress-bar').text('0%');
    $('.progress-bar').width('0%');
});

$('#ownerEmailInput').on('keyup', function(){

    if ($("#ownerEmailInput").val())
    {
        $('#emailMustBeFilledMsg').hide();
    }
});


$('#upload-input').on('change', function(){
    var files = $(this).get(0).files;

    if (files.length > 0){
        // create a FormData object which will be sent as the data payload in the
        // AJAX request
        var formData = new FormData();

        // get first file only
        var file = files[0];

        if (file.size < 100000000)
        {
            // add the file to formData object for the data payload
            formData.append('uploads[]', file, file.name);
        }
        else
        {
            $('#fileSizeToBigMsg').show();
            return;
        }



        var ownerEmail = $("#ownerEmailInput").val();

        $.ajax({
            url: '/upload',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,

            success: function(data){
                console.log('upload successful!\n' + data);


                $.ajax({
                    url: '/saveSiteOwner?siteId=' + data + '&ownerEmail=' + ownerEmail,
                    type: 'GET',
                    contentType:'application/json',
                    success: function(data) {
                        console.log('save site owner success');

                    },
                    error: function(data) { console.error('save site owner failed');}
                });

            },
            xhr: function() {
                // create an XMLHttpRequest
                var xhr = new XMLHttpRequest();

                // listen to the 'progress' event
                xhr.upload.addEventListener('progress', function(evt) {

                    if (evt.lengthComputable) {
                        // calculate the percentage of upload completed
                        var percentComplete = evt.loaded / evt.total;
                        percentComplete = parseInt(percentComplete * 100);

                        // update the Bootstrap progress bar with the new percentage
                        $('.progress-bar').text(percentComplete + '%');
                        $('.progress-bar').width(percentComplete + '%');

                        // once the upload reaches 100%, set the progress bar text to done
                        if (percentComplete === 100) {
                            $('.progress-bar').html('Done');
                            $('#successMsg').show();
                            // clear email box
                            $("#ownerEmailInput").val('');
                        }
                    }

                }, false);

                return xhr;
            }
        });

    }
});