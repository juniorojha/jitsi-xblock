/* Javascript for JitsiX. */
function JitsiX(runtime, element) {

    // function updateCount(result) {
    //     $('.count', element).text(result.count);
    // }

    // var handlerUrl = runtime.handlerUrl(element, 'increment_count');

    // $('p', element).click(function(eventObject) {
    //     $.ajax({
    //         type: "POST",
    //         url: handlerUrl,
    //         data: JSON.stringify({"hello": "world"}),
    //         success: updateCount
    //     });
    // });

//    $(function ($) {
        /*
        Use `gettext` provided by django-statici18n for static translations

        var gettext = JitsiXi18n.gettext;
        */

        /* Here's where you'd do things on page load. */

//   });

    function base64url(source) {
        // Encode in classical base64
        encodedSource = CryptoJS.enc.Base64.stringify(source);

        // Remove padding equal characters
        encodedSource = encodedSource.replace(/=+$/, '');

        // Replace characters according to base64url specifications
        encodedSource = encodedSource.replace(/\+/g, '-');
        encodedSource = encodedSource.replace(/\//g, '_');

        return encodedSource;
    }

    function loadJitsi() {
        var JitsiDomain = "conf.edu.afdal.life";

        var courseInfo = $('.bookmark-button').data('bookmark-id');
        // Now uInfo contains username and block ID. To make the session wider, i.e. covering more blocks, we can strip specific info from uInfo[1] while providing to roomName argument.
        var uInfo = courseInfo.split(',');
        var courseIDInfo = uInfo[1].split(':')[1].replace(/\-/g, "").replace(/\+/g, "").replace(/\@/g, "").replace(/\_/g, "");

        var subject = $('.course-name').text() + ': Meeting Room';
        var avatarUrl = $('.user-image-frame').prop('src');

        var userMetaData = JSON.parse($('#user-metadata').text());

        var isModerator = userMetaData.partition_groups.has_staff_access;

        var header = {
          "alg": "HS256",
          "typ": "JWT"
        };

        var data = {
          "context": {
            "user": {
              "avatar": avatarUrl,
              "name": userMetaData.username,
              "email": userMetaData.email,
              "id": userMetaData.user_id
            },
          },
          "aud": "jitsi",
          "iss": "edx",
          "sub": JitsiDomain,
          "room": courseIDInfo,
          "moderator": isModerator
        }

        var secret = "edx";

        var stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
        var encodedHeader = base64url(stringifiedHeader);

        var stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(data));
        var encodedData = base64url(stringifiedData);

        var token = encodedHeader + "." + encodedData;
        signature = CryptoJS.HmacSHA256(token, secret);
        signature = base64url(signature);
        var signedToken = token + "." + signature;

        var JitsiOptions = {
            roomName: courseIDInfo,
            width: 800,
            height: 600,
            noSSL: false,
            parentNode: document.querySelector('.vert-mod'),
            userInfo: {
                displayName: userMetaData.username,
            },
            jwt: signedToken
        }

        var JitsiApi = new JitsiMeetExternalAPI(JitsiDomain, JitsiOptions);

        JitsiApi.executeCommands({
            subject: subject,
            displayName: userMetaData.username,
            avatarUrl: avatarUrl,
            email: userMetaData.email
        });
    }

    function fireWhenReady() {
        if (typeof JitsiMeetExternalAPI != 'undefined' && typeof CryptoJS != 'undefined') {
            loadJitsi();
        }
        else {
            setTimeout(fireWhenReady, 100);
        }
    }

    $(document).ready(fireWhenReady);

    // Remove the conference object
    document.onunload = function(){
        JitsiApi.dispose();
    };

}
