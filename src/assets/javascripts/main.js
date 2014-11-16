var $ = require('jquery');
jQuery = $;
window.$ = $;
var validate = require('./vendor/validate');

$(function() {
  $('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 700, 'swing');
        return false;
      }
    }
  });
});

$('article img').removeAttr('width').removeAttr('height');

// Contact Form

$('#slide-toggle').on('click', function(e) {
  e.preventDefault();
  $(this).toggleClass('is-active');
  $('.inquiry-options').toggleClass('is-open');
});

// Gross.. needs refactor
$('.inquiry-options__item').on('click', function(e) {
  $('.inquiry-options__item').not(this).find('input').prop('checked', false);
  $('.trigger .replace').addClass('darken').text($(this).find('span').text());
  $('#slide-toggle').removeClass('is-active');
  $('.inquiry-options').removeClass('is-open');
});

$("#contact_submit").on('click', function() {
  if (validateForm()) {

    var subjectValue = "default";
    $.each($('.inquiry-options__item'), function() {
      var input = $(this).find('input');
      if (input.is(':checked')) {
        subjectValue = input.data("route");
        console.log(subjectValue);
      }
    });

    var mailerUrl = "/mailer.php";
    var fromEmailValue = $("#input_email").val();
    var fromNameValue = $("#input_name").val();
    var messageValue = $("#textarea_message").val();

    var mailerData = {
      fromEmail: fromEmailValue,
      fromName: fromNameValue,
      subject: subjectValue,
      message: messageValue,
    };

    setContactFormEnabled(false);
    setContactFormSubmitTitle("Sending...");

    $.ajax( {
      url: mailerUrl,
      type: 'GET',
      data: mailerData,
      dataType: "JSON",
      error: function () {
        showError();
      },
      success: function (data, textStatus, jqXHR) {
        if (data.success === true) {
          resetForm();
          window.location.href = "http://blackpixel.com/thanks/";
        } else {
          var message = null;
          if (data.message.length > 0)
            message = data.message;
            showError(message);
          }
        }
      });
    }
    return false;
  });

setContactFormEnabled = function(isEnabled) {
  if (isEnabled === true) {
    $('#contact_form :input').removeAttr('disabled');
  } else {
    $('#contact_form :input').attr('disabled', true);
  }
};

setContactFormSubmitTitle = function(title) {
  $("#contact_submit").html(title);
};

setContactSubmitMessage = function(message) {
  $("#contact_submit_message").html(message);
};

validateForm = function() {
  var requiredFields = [];
  var namePattern = /[^\s]+/; // one or more non-whitespace
  var emailPattern = /.+\@.+/; // one or more chars, an @, one or more chars.
  var messagePattern = /[^\s]+/; // one or more non-whitespace

  var nameValue = $("#input_name").val();
  var nameValueMatch = nameValue.match(namePattern);

  var emailValue = $("#input_email").val();
  var emailValueMatch = emailValue.match(emailPattern);

  var messageValue = $("#textarea_message").val();
  var messageValueMatch = messageValue.match(messagePattern);

  if (nameValueMatch === null) {
    requiredFields.push("Name");
  }

  if (emailValueMatch === null) {
    requiredFields.push("Email");
  }

  if (messageValueMatch === null) {
    requiredFields.push("Message");
  }

  if (requiredFields.length > 0) {
    var message = "";
    if (requiredFields.length == 1)
      message = requiredFields[0] + " is a required field";
    else
      message = requiredFields.join(", ") + " are required fields";

    showError(message);
    return false;
  }

  return true;
};

clearForm = function() {
  $('#contact_form :input').val('');
};

resetForm = function() {
  clearForm();
  setContactSubmitMessage("");
  setContactFormEnabled(true);
  setContactFormSubmitTitle("Send");
  $('#contact_form').fadeOut();
};

showError = function(message) {
  if (message === null)
    message = "Oops. Failed to send message. Try again.";
  setContactFormSubmitTitle("Send");
  setContactSubmitMessage(message);
  setContactFormEnabled(true);
};
