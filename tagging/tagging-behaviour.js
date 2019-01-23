
var tagInput = new Taggle('tagInput', {
    tags: ['Landscape', 'Trees', 'Pine'],
    preserveCase: true,
    additionalTagClasses: 'js-tag tag',
    focusInputOnContainerClick: true,
    tagFormatter: constructTagElementToDisplay,
    onTagAdd: clearTheInput,
    duplicateTagClass: 'is-duplicate',
    onBeforeTagAdd: removeDuplicateClasses
});


function clearTheInput() {
    tagInput.getInput().value = "";
}

$('body').on('click', function(evt) {
    var clickIsFromATag = $(evt.target).parents('.js-tag-edit-form').length | $(evt.target).hasClass('js-tag-text');
    if(!clickIsFromATag) {
        stopEditingAllTags();
    }
});

$('.js-tags').on('click', function(evt) {
    if($(evt.target).hasClass('js-tag-text')) {
        var $tag = getParentTag(evt.target);
        startEditingTag($tag);
    }       
});

$('.js-tags').on('input', '.taggle_input', function(evt) {
    removeDuplicateClasses();
});

$('.js-tags').on('blur', '.taggle_input', function(evt) {
    removeDuplicateClasses();
});

var availableTags = [
    'apple', 
    'banana', 
    'orange', 
    'pear', 
    'strawberry', 
    'peach',
    'cranberry',
    'melon',
    'plum',
    'grape' 
  ];

$('.js-tags').on('submit',' .js-tag-edit-form', function(evt) {
    evt.preventDefault();
    var $tag = getParentTag(evt.target);
    var newValue = $(evt.target).find('.js-tag-edit-input').text();
    updateTagValue($tag, newValue);
    $tag.removeClass('is-editing');
});



var container = tagInput.getContainer();


$(tagInput.getInput()).autocomplete({
    source: availableTags,
    open: function() {
        $("ul.ui-menu").width( $(this).parents('.js-tags').innerWidth() );
    },
    position: { my: "left top", at: "left bottom", collision: "none", of: container },
    select: function( event, data ) {
        
        event.preventDefault();
        
        //Add the tag if user clicks
        if (event.which === 1) {
            tagInput.add(data.item.label);
        }
    }

});


function getEditFormHTML() {
    return $('<form class="tag__edit js-tag-edit-form">' + 
            '<span class="tag__edit__input js-tag-edit-input" contenteditable></span>' +
            '<button class="tag__edit__btn"><img src="tick.svg" alt="Save" /></button>' +
        '</form> ');
}

function constructTagElementToDisplay(tagElement) {
    //Get rid of the hidden input field
    $(tagElement).find('input[type="hidden"]').remove();

    // Add some BEM classnames for our custom styling
    $(tagElement).find('button').addClass('tag__delete');
    $(tagElement).find('.taggle_text').addClass('tag__text js-tag-text');

    //Add the initially hidden edit form to the tag
    $(tagElement).append(getEditFormHTML());

    // Prevent clicks on the edit form from giving focus to the new tag input.
    $(tagElement).find('.js-tag-edit-input').on('click', function(evt) {
        evt.stopPropagation();
    });

    return tagElement;
}

function getParentTag(childElem) {
    return $(childElem).parents('.js-tag');
}

function updateTagValue($tag, newValue) {
    $tag.find('.js-tag-text').text(newValue);
}

function getTagValue($tag) {
    return $tag.find('.js-tag-text').text();
}

function startEditingTag($tag) {
    var $tagInput = $tag.find('.js-tag-edit-input');

    $tagInput.on('keydown', function(evt) {
        // User hits enter during an edit
        if (evt.keyCode == 13) {
            $tag.find('.js-tag-edit-form').submit();
        }
        // User Hitting escape
        if (evt.keyCode == 27) {
            stopEditingTag($tag);
        }
    });
    
    $tag.addClass('is-editing');
    $tagInput.text(getTagValue($tag));
    selectElementContents($tagInput[0]);
    $tagInput[0].focus();
}

function stopEditingTag($tag) {
    $tag.removeClass('is-editing');
}

function stopEditingAllTags() {
    $('.js-tag').each(function() {
        stopEditingTag($(this));
    });
}

function selectElementContents(el) {
    var range = document.createRange();
    range.selectNodeContents(el);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}

function removeDuplicateClasses() {
    $('.js-tag').each(function() {
        $(this).removeClass('is-duplicate');
    });
}