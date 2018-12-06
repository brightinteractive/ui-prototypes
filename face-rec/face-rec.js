$('.js-modal-update-all').on('click', updateAllNames);
$('.js-modal-update-single').on('click', updateSingleName);
$('.js-modal-dismiss').on('click', hideModal);

const $modal = $('.js-modal');

const $multiFaceNamer = $('.js-face-namer--multi');
const $multiEditText = $('.js-face-edit-text--multi');

function faceHasInstances($container) {
    return getFaceInstances($container) > 0;
}

function getFaceInstances($container) {
    return $container.data('instances');
}

function enterLoadingState($faceNamer) {
    $faceNamer.addClass('is-loading');
}

function exitLoadingState($faceNamer) {
    $faceNamer.removeClass('is-loading');
    // show a tick for a second
    // ...    
}

function applyNameChange($targetText, $targetNamer, value) {
    // Populate link
    $targetText.text(value);

    if (value === '') {
        $targetNamer.removeClass('has-name');
    } else {
        // show loading state for a while
        enterLoadingState($targetNamer);
        setTimeout(() => {
            exitLoadingState($targetNamer);
            $targetNamer.addClass('has-name');
        }, 600);
    }
}

function updateFromModal() {
    const newVal = $modal.find('.js-new').text();

    hideModal();
    applyNameChange($multiEditText, $multiFaceNamer, newVal);
}

function updateAllNames() {
    updateFromModal();
}

function updateSingleName() {
    updateFromModal();
}


// ------------------------------------------------------------------
//  Modal
// ------------------------------------------------------------------

function showModal() {
    $modal.addClass('is-visible');
}

function hideModal() {
    $modal.removeClass('is-visible');
}

function populateModal(value, originalValue, instances) {
    $modal.find('.js-original').text(originalValue);
    $modal.find('.js-new').text(value);
    $modal.find('js-instances').text(instances);
}

$('.js-face').each(function(){
    const $this = $(this);
    const $input = $this.find('.js-face-input');
    const $editNamer = $this.find('.js-face-edit');
    const $editText = $this.find('.js-face-edit-text');
    const $faceNamer = $this.find('.js-face-namer');

    let originalValue = $input.val();

    function attemptNameUpdate(newValue) {
        if (newValue === originalValue) {
            $input.blur();
            return;
        }

        if (newValue === '') {
            applyNameChange($editText, $faceNamer, newValue)
            $faceNamer.data('instances', 0);
            return;
        }

        if (faceHasInstances($faceNamer)) {
            // ask if we want to update all instances or just this one
            populateModal(newValue, originalValue, getFaceInstances($faceNamer));
            showModal();
        } else {
            applyNameChange($editText, $faceNamer, newValue);
        }

        originalValue = newValue;
    }

    function handleKeydown(e) {
        let newValue = $input.val();

        if (e.keyCode === 13 | e.keyCode == 9) {
            attemptNameUpdate(newValue);
        }
    }

    function handleBlur() {
        let newValue = $input.val();

        removeEditMode();

        attemptNameUpdate(newValue);
    }

    // ------------------------------------------------------------------
    //  Edit mode
    // ------------------------------------------------------------------

    function enableEditMode() {
        $faceNamer.addClass('is-editing');    
        $input.select();
    }

    function removeEditMode() {
        $faceNamer.removeClass('is-editing');
    }


    // Bind events
    $editNamer.on('click', enableEditMode);
    $input.on('blur', handleBlur);
    $input.on('keydown', handleKeydown)
    
});




// ------------------------------------------------------------------
//  Init
// ------------------------------------------------------------------

// storeOriginalValue($multiFacesContainer.find('.js-face-edit-text').text());