
// better names :)

request = superagent
o = $

/**
 * Overlay.
 */

o(function(){
  overlay = o('#overlay');
});

/**
 * Dialog singleton.
 */

o(function(){
  dialog = View('dialog')
    .close('hide')
    .ok('hide')
    .hide()
    .center()
    .appendTo('body')
    .on('show', function(){
      overlay.show();
      dialog.center();
    })
    .on('hide', function(){
      overlay.hide();
    });
});
