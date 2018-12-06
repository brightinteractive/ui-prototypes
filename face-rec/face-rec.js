$('.js-modal-update-all').on('click', updateAllNames);
$('.js-modal-update-single').on('click', updateSingleName);
$('.js-modal-dismiss').on('click', hideModal);

const $modal = $('.js-modal');

const $multiFace = $('.js-face--multi');
const $multiEditText = $('.js-face-edit-text--multi');

function faceHasInstances($container) {
    return getFaceInstances($container) > 0;
}

function getFaceInstances($container) {
    return $container.data('instances');
}

function applyNameChange($targetText, $targetNamer, value) {
    // Populate link
    $targetText.text(value);

    if (value === '') {
        $targetNamer.removeClass('has-name');
    } else {
        // show loading state for a while
        $targetNamer.addClass('is-loading');
        $targetNamer.addClass('is-applying');
    
        setTimeout(() => {
            $targetNamer.removeClass('is-loading');
            $targetNamer.addClass('has-name');

            setTimeout(() => {
                $targetNamer.removeClass('is-applying');
            }, 1000);
        }, 600);
    }
}

function updateFromModal() {
    const newVal = $modal.find('.js-new').text();

    hideModal();
    applyNameChange($multiEditText, $multiFace, newVal);
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
    $modal.find('.js-instances').text(instances);
}

$('.js-face').each(function(){
    const $this = $(this);
    const $face = $this.find('.js-face-click-zone');
    const $input = $this.find('.js-face-input');
    const $editNamer = $this.find('.js-face-edit');
    const $editText = $this.find('.js-face-edit-text');
    const $faceNamer = $this.find('.js-face-namer');

    let originalValue = $input.val();

    function attemptNameUpdate(newValue) {
        if (newValue === '') {
            applyNameChange($editText, $this, newValue)
            $faceNamer.data('instances', 0);
            return;
        }

        if (faceHasInstances($faceNamer)) {
            // ask if we want to update all instances or just this one
            populateModal(newValue, originalValue, getFaceInstances($faceNamer));
            showModal();
        } else {
            applyNameChange($editText, $this, newValue);
        }

        originalValue = newValue;
    }

    function handleFaceClick() {
        console.log('face clicked');
        $input.select();
        enableEditMode();
    }

    function handleFaceHover(e) {
        console.log('hover');
        if (e.type === 'mouseenter') {
            showNamer();
        }

        if (e.type === 'mouseleave') {
            hideNamer();
        }
    }

    function handleKeydown(e) {
        let newValue = $input.val();

        if (e.keyCode === 13 | e.keyCode == 9) {
            if (newValue === originalValue) {
                $input.blur();
                
                return;
            }

            attemptNameUpdate(newValue);
        }
    }

    function handleBlur() {
        let newValue = $input.val();

        removeEditMode();

        if (newValue !== originalValue) {
            attemptNameUpdate(newValue);
        }
    }

    // ------------------------------------------------------------------
    //  Namer visibility
    // ------------------------------------------------------------------

    function showNamer() {
        $this.addClass('show-namer');    
    }

    function hideNamer() {
        $this.removeClass('show-namer');    
    }

    // ------------------------------------------------------------------
    //  Edit mode
    // ------------------------------------------------------------------

    function enableEditMode() {
        $this.addClass('is-editing');    
        $input.select();
    }

    function removeEditMode() {
        $this.removeClass('is-editing');
    }


    // ------------------------------------------------------------------
    //  Bind
    // ------------------------------------------------------------------

    $face.on('click', handleFaceClick);
    $this.on('mouseenter mouseleave', handleFaceHover);

    $editNamer.on('click', enableEditMode);
    $input.on('click', enableEditMode);
    $input.on('blur', handleBlur);
    $input.on('keydown', handleKeydown)
    
});




// ------------------------------------------------------------------
//  Init
// ------------------------------------------------------------------

// storeOriginalValue($multiFacesContainer.find('.js-face-edit-text').text());