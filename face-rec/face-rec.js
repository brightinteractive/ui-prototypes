
$('.js-face-input').on('keydown', handleKeydown);
$('.js-face-input').on('keydown', handleKeydown);
$('.js-modal-dismiss').on('click', hideModal);
$('.js-face-edit').on('click', enableEditMode);

const $modal = $('.js-modal');

function handleKeydown(evt) {
    let $container = getContainerElementFromEvent(evt);
    let newValue = getinputValueFromEvent(evt);
    if (evt.keyCode === 13 | evt.keyCode == 9) {
        if (faceHasInstances($container)) {
            populateModal(newValue, getFaceInstances($container));
            showModal();
        } else {
            // populate link
            $container.find('.js-face-edit-text').text(newValue);
            
            // show loading state for a while
            enterLoadingState($container);
            setTimeout(() => {
                exitLoadingState($container);
                $container.addClass('has-name');
            }, 600);
        }
    }
}

function enableEditMode(evt) {
    let $container = getContainerElementFromEvent(evt);

    $container.addClass('is-editing');    
    $container.find('.js-face-input').select();
}

function faceHasInstances($container) {
    return getFaceInstances($container) > 0;
}

function getFaceInstances($container) {
    return $container.data('instances');
}

function showModal() {
    $modal.addClass('is-visible');
}

function hideModal() {
    $modal.removeClass('is-visible');
}

function populateModal(value, instances) {
    $modal.find('.js-new').text(value);
    $modal.find('js-instances').text(instances);
}

function enterLoadingState($faceNamer) {
    $faceNamer.addClass('is-loading');
}

function exitLoadingState($faceNamer) {
    $faceNamer.removeClass('is-loading');
}

function getinputValueFromEvent(evt) {
    return $(evt.target).val();
}

function getContainerElementFromEvent(evt) {
    return $(evt.target).parents('.js-face-namer');
}