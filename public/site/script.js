'use strict';

var flash, results, hypermark, header, sidebar, addLinkModal, bookmarkletModal, newListModal, modalOverlay, flash;

//CHANNELS
var modesChan = new airwaves.Channel(),
  dataChan = new airwaves.Channel();



//MIXINS
function modal($el) {  
  $el.on('click', function () {    
    modesChan.broadcast('exit');  
  });

    
  $el.on('click', '.modal-window', function (e) {   
    e.stopPropagation();
  });

    
  $el.on('click', '.js-close', function () {
    modesChan.broadcast('exit');
  });

  modesChan.subscribe('exit', function () {
    $el.removeClass('-active');
  });
}



//AREAS
results = function ($el) {
  $el.on('click', '.js-add-to-list', function () {
    var $hypermark = $(this).parents('.hypermark'),
      bookmark_id = $hypermark.attr('data-_id');  
    $(this).addClass('-active');
    $hypermark.addClass('top');    
    modesChan.broadcast('add-to-list', bookmark_id);  
  });

  $el.on('click', '.js-add-link', function () {
    modesChan.broadcast('add-link');
  })

     //Subscriptions
     modesChan.subscribe('exit', function () {
    $el.find('.js-add-to-list').removeClass('-active');
    $el.find('.hypermark').removeClass('top');
  })

};



hypermark = function ($el) {
  var _id = $el.attr('data-_id');

  $el.on('click', '.js-delete', function () {
    $.post('/_api/hypermarksRemove', {
      _id: _id
    }, function () {
      window.location.reload();
    })
  });
}



header = function ($el) {
  $el.on('click', '.js-dropdown', function () {
    $(this).toggleClass('-active');
  });

  $el.on('click', '.js-bookmarklet', function (e) {
    modesChan.broadcast('bookmarklet')
    e.preventDefault;
  })
};



sidebar = function ($el) {  
  $el.on('click', '.js-new-list', function () {    
    modesChan.broadcast('new-list');  
  });

     //Subscriptions
    
  modesChan.subscribe('add-to-list', function (bookmark_id) {
    $el.addClass('top');
    $el.find('.js-fave-lists').addClass('-hoverable');

      
    $el.on('click.temp', '.js-list', function (e) {
      e.preventDefault();
      var block_id = $("a", this).data("block");
      $.post('/_api/blocks', {
        bookmark_id: bookmark_id,
        block_id: block_id
      }, function () {
        window.location.reload();
      });
      presentational.flash($(this), '-added', 1000);
      modesChan.broadcast('exit');
    });
  });

    
  dataChan.subscribe('favorite_lists', function (data) {
    var el = sidebarTmpl({
      favorite_blocks: data
    });
    $el.html($('*:first', el).unwrap());
  });
  modesChan.subscribe('exit', function () {
    $el.off('.temp');
    $el.find('.js-fave-lists').removeClass('-hoverable');
  });
};



addLinkModal = function ($el) {
  modal($el);
  var cb = function (e) {
    if (e.type === "keypress" && e.keyCode !== 13) {
      return
    }; //bonk out the keypress is not enter;
      
    $.post('/_api/hypermarks', {
      url: $('input[name="url"]').val(),
      block: block
    }, function () {    
      window.location.reload();
    });    
    modesChan.broadcast('exit');
  };

  $("input", $el).on('keypress', cb);

  var block = pageVars.block ? pageVars.block : null;
  $el.on('click', '.js-add-link', cb)

  modesChan.subscribe('add-link', function () {
    $el.addClass('-active');
  });

    
  modesChan.subscribe('exit', function () {
    $el.removeClass('-active');
  });
}



newListModal = function ($el) {
  modal($el);
  var list_name = $('#page-title').text(),
    cb = function (e) {
      var list_name = $('.js-name').val();
      if (e.type === "keypress" && e.keyCode !== 13) {
        return
      }; //bonk out the keypress is not enter;

        
      $.post('/_api/users/favorites', {
        block_id: list_name
      }, function (data) {
        dataChan.broadcast('favorite_lists', data);
      });
      modesChan.broadcast('exit');
    };
  $el.find('.js-add-current').text(list_name)

  $el.on('click', '.js-add-current', function () {
    $('.js-name').val(list_name);
  });

  $el.on('click', '.js-submit', cb);
   
  $("input", $el).on('keypress', cb);

  modesChan.subscribe('new-list', function () {
    $el.addClass('-active');
  });

  modesChan.subscribe('exit', function () {
    $el.removeClass('-active');
  });
};



bookmarkletModal = function($el) {
  modal($el);

  modesChan.subscribe('bookmarklet', function () {
    $el.addClass('-active');
  });
  
  modesChan.subscribe('exit', function () {
    $el.removeClass('-active');
  });
};



modalOverlay = function ($el) {
  $el.on('click', function () {
    modesChan.broadcast('exit');
  });
  modesChan.subscribe('new-list, add-to-list, add-link', function () {
    $el.addClass('-active');
  });

    
  modesChan.subscribe('exit', function () {
    $el.removeClass('-active');
  });
};



flash = function ($this, flashClass, time) {
  if (!$this.hasClass(flashClass)) {
  $this.addClass(flashClass);
  setTimeout( function(){
    $this.removeClass(flashClass);
  }, time);
  }
};



modalOverlay($('#modal-overlay'));
newListModal($('#new-list-modal'));
addLinkModal($('#add-link-modal'));
bookmarkletModal($('#bookmarklet-modal'));
sidebar($('#sidebar'));
results($('#results'));
header($('#header'));
hypermark($('.hypermark'));
