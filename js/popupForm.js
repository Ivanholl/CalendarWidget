$(document).ready(function() {
    $("#form-container").load("../templates/popupForm.html", function() {
        // alert( "Load was performed." );
        var form = $(this);
        var currentFullDateForExport;
        debugger

        $('#calendar-container .days-container .day .plus').click(e => {
            currentFullDateForExport = calendar.currentFullDateForExport;
            debugger
            $('.form-popup').show();
        })

        $('.close-form').click(function() {
            $('.form-popup').hide();
        });

        $('.form-popup .send-form').click(e => {
            debugger
            let sendParams = {
                title: $('.form-popup #title').val(),
                date: currentFullDateForExport || "",
                participants: $('.form-popup #participants').val(),
                details: $('.form-popup #details').val(),
            }
            if (sendParams.title && sendParams.date && sendParams.participants && sendParams.details) {
                localStorage.setItem('event_' + currentFullDateForExport, JSON.stringify(sendParams));

                $('.success-message').show();

                setTimeout(function() {
                    $('.success-message').hide()
                }, 1500);
            }
        })

        $(document).mouseup(function(e) {
            var container = $(".form-wrapper");
            var form = $(".form-popup");

            if (!container.is(e.target) && container.has(e.target).length === 0) {
                form.hide();
            }
        });
    });
})
