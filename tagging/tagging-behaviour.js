
var tagInput = new Taggle('tagInput', {
    tags: ['Landscape', 'Trees', 'Pine'],
    preserveCase: true,
    additionalTagClasses: 'js-tag tag',
    focusInputOnContainerClick: false,
    tagFormatter: constructTagElementToDisplay
});

$('body').on('click', function(evt) {
    if(!$(evt.target).parents('js-edit-form')) {
        stopEditingAllTags($(evt.target).parents('.js-tags'));
    }  
});

$('.js-tags').on('click', function(evt) {
    
    if($(evt.target).hasClass('js-tag-text')) {
        var $tag = getParentTag(evt.target);
        startEditingTag($tag);
    }       

});

$('.js-tag-edit-form').on('submit', function(evt) {
    evt.preventDefault();
    var $tag = getParentTag(evt.target);
    var newValue = $(evt.target).find('.js-tag-edit-input').val();
    updateTagValue($tag, newValue);
    $tag.removeClass('is-editing');
});

function getEditFormHTML() {
    return $('<form class="tag__edit js-tag-edit-form"><input type="text" class="tag__edit-input js-tag-edit-input"><button class="tag-edit__btn">Y</button></form> ');
}

function constructTagElementToDisplay(tagElement) {
    //Get rid of the hidden input field
    $(tagElement).find('input[type="hidden"]').remove();

    // Add some BEM classnames for our custom styling
    $(tagElement).find('button').addClass('tag__delete');
    $(tagElement).find('.taggle_text').addClass('tag__text js-tag-text');

    //Add the initially hidden edit form to the tag
    $(tagElement).append(getEditFormHTML());

    return tagElement;
}

function getParentTag(childElem) {
    return $(event.target).parents('.js-tag');
}

function updateTagValue($tag, newValue) {
    $tag.find('.js-tag-text').text(newValue);
}

function getTagValue($tag) {
    return $tag.find('.js-tag-text').text();
}

function startEditingTag($tag) {
    $tag.addClass('is-editing');
    $tag.find('.js-tag-edit-input')
        .val(getTagValue($tag))
        .select();
}

function stopEditingTag($tag) {
    $tag.removeClass('is-editing');
}

function stopEditingAllTags($container) {
    $container.find('js-tag').forEach(function() {
        stopEditingTag(this);
    });
}