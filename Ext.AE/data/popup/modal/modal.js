var modal = {
  "confirm": function (text, ok, notok) {
    ok = ok ? ok : function () {};
    notok = notok ? notok : function () {};
    /*  */
    var content = document.querySelector('#content');
    var confirm = document.querySelector('#modal-confirm');
    var okbutton = document.querySelector('#modal-confirm .ok');
    var nobutton = document.querySelector('#modal-confirm .notok');
    var message = document.querySelector('#modal-confirm .modal-message');
    /*  */
    message.textContent = text;
    confirm.style.display = "block";
    content.style["-webkit-filter"] = "blur(2px)";
    okbutton.onclick = function () {
      confirm.style.display = 'none';
      content.style['-webkit-filter'] = '';
      ok();
    };
    /*  */
    nobutton.onclick = function () {
      confirm.style.display = "none";
      content.style["-webkit-filter"] = '';
      notok();
    };
  },
  "prompt": function (text, ok, notok) {
    ok = ok ? ok : function () {};
    notok = notok ? notok : function () {};
    /*  */
    var content = document.querySelector('#content');
    var prompt = document.querySelector('#modal-prompt');
    var input = document.querySelector('#modal-prompt .input');
    var okbutton = document.querySelector('#modal-prompt .ok');
    var nobutton = document.querySelector('#modal-prompt .notok');
    var message = document.querySelector('#modal-prompt .modal-message');
    /*  */
    input.focus();
    input.value = '';
    message.textContent = text;
    prompt.style.display = "block";
    content.style["-webkit-filter"] = "blur(2px)";
    okbutton.onclick = function () {
      prompt.style.display = 'none';
      content.style['-webkit-filter'] = '';
      ok(input.value);
    };
    /*  */
    nobutton.onclick = function () {
      prompt.style.display = 'none';
      content.style['-webkit-filter'] = '';
      notok();
    };
  }
};
