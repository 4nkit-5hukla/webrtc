let connection = new RTCMultiConnection();
let myuserid = connection.userid;
let display_name, user_avatar;
let audioJoined = false;
let videoShared = false;
let screenShared = false;
const videosContainer = $('#videos-container');
const usersMe = $('#users_me');
const usersJoined = $('#users_joined');
connection.socketURL = 'https://webrtc.inovmercury.com/';
const join_audio = () => {
  connection.sdpConstraints.mandatory = {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: true
  };
  connection.mediaConstraints = {
    audio: true,
    video: false,
    screen: false
  };
  connection.extra.userData = {
    display_name: display_name,
    user_avatar: user_avatar,
  };
  connection.openOrJoin('demo-room');
  audioJoined = true;
  $.notify({
    icon: 'fa fa-microphone-alt',
    message: 'Microphone Started.',
  }, {
    type: 'success',
    delay: 5000,
    allow_dismiss: true,
    newest_on_top: false,
    showProgressbar: true,
    animate: {
      enter: 'animated bounceIn',
      exit: 'animated bounceOut',
    },
  });
  $("#join-audio").addClass("btn-primary").removeClass("btn-outline-light");
  $("#join-audio")
    .find(".icon")
    .addClass("fa-microphone-alt")
    .removeClass("fa-microphone-alt-slash");
};
const unmute_audio = () => {
  connection.attachStreams[0].unmute('audio');
  $.notify({
    icon: 'fa fa-microphone-alt',
    message: 'Audio is Unmuted.',
  }, {
    type: 'success',
    delay: 5000,
    allow_dismiss: true,
    newest_on_top: false,
    showProgressbar: true,
    animate: {
      enter: 'animated bounceIn',
      exit: 'animated bounceOut',
    },
  });
};
const mute_audio = () => {
  connection.attachStreams[0].mute('audio');
  $.notify({
    icon: 'fa fa-microphone-alt',
    message: 'Audio is Muted.',
  }, {
    type: 'danger',
    delay: 5000,
    allow_dismiss: true,
    newest_on_top: false,
    showProgressbar: true,
    animate: {
      enter: 'animated bounceIn',
      exit: 'animated bounceOut',
    },
  });
};
const share_video = () => {
  connection.mediaConstraints = {
    audio: true,
    video: true,
    screen: false
  };
  connection.addStream({
    video: true
  });
  videoShared = true;
  $.notify({
    title: 'Video',
    message: 'Video Started.',
    type: 'success',
    delay: 5000,
  });
};
const resume_video = () => {
  connection.attachStreams[0].unmute('video');
  $.notify({
    title: 'Video',
    message: 'Video is Started.',
    type: 'success',
    delay: 5000,
  });
};
const stop_video = () => {
  connection.attachStreams[0].mute('video');
  $.notify({
    title: 'Video',
    message: 'Video is Stopped.',
    type: 'danger',
    delay: 5000,
  });
};
const share_screen = () => {
  connection.mediaConstraints = {
    audio: true,
    video: false,
    screen: true
  };
  connection.addStream({
    screen: true
  });
  screenShared = true;
  $.notify({
    title: 'Screen',
    message: 'Screen Sharing Started.',
    type: 'success',
    delay: 5000,
  });
};
const resume_screen = () => {
  $.notify({
    title: 'Screen',
    message: 'Screen Sharing Resumed.',
    type: 'success',
    delay: 5000,
  });
};
const stop_screen = () => {
  $.notify({
    title: 'Screen',
    message: 'Screen Sharing Stopped.',
    type: 'danger',
    delay: 5000,
  });
};
const sendJoinNotification = (event) => {
  $.notify({
    icon: 'fa fa-user',
    message: `${event.extra.userData.display_name} Joined.`,
  }, {
    type: 'success',
    delay: 5000,
    allow_dismiss: true,
    newest_on_top: false,
    showProgressbar: true,
    animate: {
      enter: 'animated bounceIn',
      exit: 'animated bounceOut',
    },
  });
};
const sendLeaveNotification = (event) => {
  $.notify({
    icon: 'fa fa-user',
    message: `${event.extra.userData.display_name} Left.`,
  }, {
    type: 'info',
    delay: 5000,
    allow_dismiss: true,
    newest_on_top: false,
    showProgressbar: true,
    animate: {
      enter: 'animated bounceIn',
      exit: 'animated bounceOut',
    },
  });
};
const sendStreamEndNotification = (event) => {
  $.notify({
    icon: 'fa fa-user',
    message: `${event.extra.userData.display_name} Ended Streaming.`,
  }, {
    type: 'danger',
    delay: 5000,
    allow_dismiss: true,
    newest_on_top: false,
    showProgressbar: true,
    animate: {
      enter: 'animated bounceIn',
      exit: 'animated bounceOut',
    },
  });
};
const updateUserCount = (event, type) => {
  let participants = [myuserid, ...connection.getAllParticipants()];
  if (type === 'leave' && participants.includes(event.userid)) {
    $('#users_count').html(`(${participants.length - 1})`);
  } else {
    $('#users_count').html(`(${participants.length})`);
  }
};
const renderUser = (event) => {
  let newUser = $('<div />', {
    id: `user-${event.userid}`,
    class: 'user list-group-item p-2 mb-2'
  }).appendTo(usersJoined);
  let newUserFlex = $('<div />', {
    class: 'd-flex'
  }).appendTo(newUser);
  let newUserAvatarWrap = $('<div />', {
    class: 'flex-shrink-0'
  }).appendTo(newUserFlex);
  let newUserAvatar = $('<img />', {
    class: 'img-fluid',
    src: event.extra.userData.user_avatar
  }).appendTo(newUserAvatarWrap);
  let newUserNameWrap = $('<div />', {
    class: 'pl-2 flex-grow-1 my-auto'
  }).appendTo(newUserFlex);
  let newUserName = $('<label />', {
    class: 'mb-0',
    text: event.extra.userData.display_name
  }).appendTo(newUserNameWrap);
};
const renderUserMedia = (event) => {
  event.mediaElement.controls = false;
  let newCol = $('<div />', {
    class: 'col-4 px-2',
    id: event.userid
  }).appendTo(videosContainer);
  let newCard = $('<div />', {
    class: 'card rounded-0 border-0 bg-transparent'
  }).appendTo(newCol);
  let cardBody = $('<div />', {
    class: 'card-body p-0'
  }).appendTo(newCard);
  let cardFooter = $('<div />', {
    class: 'card-footer bg-transparent border-0 d-flex p-0 justify-content-center'
  }).appendTo(newCard);
  let userBadge = $('<div />', {
    class: 'badge badge-pill badge-primary',
    text: event.extra.userData.display_name
  }).appendTo(cardFooter);
  $(event.mediaElement).appendTo(cardBody);
};
const removeUserElements = (event) => {
  $(`#${event.userid}, #user-${event.userid}`).remove();
}
connection.onstream = (event) => {
  sendJoinNotification(event);
  renderUser(event);
  renderUserMedia(event);
  updateUserCount(event, 'stream');
};
connection.onleave = (event) => {
  sendLeaveNotification(event);
  removeUserElements(event);
  updateUserCount(event, 'leave');
};
connection.onstreamended = (event) => {
  sendStreamEndNotification(event);
  $(`#${event.userid}`).remove();
};
(($) => {
  $('[data-toggle="tooltip"]').tooltip();
  $(document).ready(($) => {
    if (typeof Storage !== "undefined") {
      if (localStorage.getItem('display_name')) {
        display_name = localStorage.getItem("display_name");
        user_avatar = localStorage.getItem("user_avatar");
      } else {
        let path = location.pathname.replace('room', 'index');
        location.href = `${location.origin}${path}`;
      }
    }
    if (!audioJoined) {
      $.notify({
        icon: 'fa fa-microphone-alt',
        message: 'Allow app to use microphone.',
      }, {
        type: 'info',
        delay: 5000,
        allow_dismiss: true,
        newest_on_top: false,
        showProgressbar: true,
        animate: {
          enter: 'animated bounceIn',
          exit: 'animated bounceOut',
        },
      });
      join_audio();
    }
    $('#join-audio').click((e) => {
      if ($(e.currentTarget).hasClass('btn-outline-light')) {
        unmute_audio();
        $(e.currentTarget)
          .addClass('btn-primary')
          .removeClass('btn-outline-light');
        $(e.currentTarget)
          .find('.icon')
          .addClass('fa-microphone-alt')
          .removeClass('fa-microphone-alt-slash');
      } else {
        mute_audio();
        $(e.currentTarget)
          .addClass('btn-outline-light')
          .removeClass('btn-primary');
        $(e.currentTarget)
          .find('.icon')
          .addClass('fa-microphone-alt-slash')
          .removeClass('fa-microphone-alt');
      }
    });
    $('#share-video').click((e) => {
      if ($(e.currentTarget).hasClass('btn-outline-light')) {
        if (!videoShared) {
          $.notify({
            title: 'Video',
            message: 'Allow app to use Web Camera.',
            type: 'info',
            delay: 5000,
          });
          share_video();
        } else {
          resume_video();
        }
        $(e.currentTarget)
          .addClass('btn-primary')
          .removeClass('btn-outline-light');
        $(e.currentTarget)
          .find('.icon')
          .addClass('fa-webcam')
          .removeClass('fa-webcam-slash');
      } else {
        stop_video();
        $(e.currentTarget)
          .addClass('btn-outline-light')
          .removeClass('btn-primary');
        $(e.currentTarget)
          .find('.icon')
          .addClass('fa-webcam-slash')
          .removeClass('fa-webcam');
      }
    });
    $('#share-screen').click((e) => {
      if ($(e.currentTarget).hasClass('btn-outline-light')) {
        if (!screenShared) {
          $.notify({
            title: 'Screen',
            message: 'Allow app to record Screen.',
            type: 'info',
            delay: 5000,
          });
          share_screen();
        } else {
          resume_screen();
        }
        $(e.currentTarget)
          .addClass('btn-primary')
          .removeClass('btn-outline-light');
        $(e.currentTarget)
          .find('.icon')
          .addClass('fa-parking')
          .removeClass('fa-parking-slash');
      } else {
        stop_screen();
        $(e.currentTarget)
          .addClass('btn-outline-light')
          .removeClass('btn-primary');
        $(e.currentTarget)
          .find('.icon')
          .addClass('fa-parking-slash')
          .removeClass('fa-parking');
      }
    });
  });
})(jQuery);