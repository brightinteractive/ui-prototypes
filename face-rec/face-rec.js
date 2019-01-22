$('.js-modal-update-all').on('click', updateAllNames);
$('.js-modal-update-single').on('click', updateSingleName);
$('.js-modal-dismiss').on('click', cancelModal);

$('.js-removal-modal-dismiss').on('click', hideRemovalModal);
$('.js-removal-modal-confirm').on('click', removeFace);

const $modal = $('.js-modal');
const $removalModal = $('.js-removal-modal');

const $multiFace = $('.js-face--multi');
const $multiFaceNamer = $multiFace.find('.js-face-namer');
const $multiEditText = $multiFace.find('.js-face-edit-text');
const $multiInput = $multiFace.find('.js-face-input');

const $snackBar = $('.js-snackbar');
const $removalSnackBar = $('.js-removal-snackbar');

let $faceToRemove;

function faceHasInstances($container) {
    return getFaceInstances($container) > 0;
}

function getFaceInstances($container) {
    return $container.data('instances');
}

function applyNameChange($targetText, $targetNamer, $targetInput, value) {
    // Populate link
    $targetText.text(value);
    $targetInput.val(value);

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
    applyNameChange($multiEditText, $multiFace, $multiInput, newVal);

    $multiFace.data('original', newVal);
}

function cancelModal() {
    const newVal = $modal.find('.js-original').text();

    console.log(newVal);

    hideModal();

    applyNameChange($multiEditText, $multiFace, $multiInput, newVal);

    $multiFace.data('original', newVal);
}

function updateAllNames() {
    updateFromModal();
    showSnackbar($snackBar);
}

function updateSingleName() {
    updateFromModal();
    $multiFaceNamer.data('instances', 0);
}


// ------------------------------------------------------------------
//  Snackbar
// ------------------------------------------------------------------
function showSnackbar($bar) {
    $bar.removeClass('is-visible');

    setTimeout(() => {
        $bar.addClass('is-visible');
    }, 600);

    setTimeout(() => {
        $bar.removeClass('is-visible');
    }, 3000);
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


// ------------------------------------------------------------------
//  Removal modal
// ------------------------------------------------------------------

function showRemovalModal() {
    $removalModal.addClass('is-visible');
}

// ------------------------------------------------------------------
//  Face remover
// ------------------------------------------------------------------

function removeFace() {
    $faceToRemove.addClass('is-removed');
    hideRemovalModal();
    showSnackbar($removalSnackBar);
}

function hideRemovalModal() {
    $removalModal.removeClass('is-visible');
}

function populateModal(value, originalValue, instances) {
    $modal.find('.js-original').text(originalValue);
    $modal.find('.js-original-inline').text(originalValue);
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
    const $faceRemover = $this.find('.js-face-remover');

    $this.data('original', $input.val());
    let originalValue = $this.data('original');

    function attemptNameUpdate(newValue) {
        
        if (newValue === '') {
            applyNameChange($editText, $this, $input, newValue)
            $faceNamer.data('instances', 0);
            return;
        }

        if (faceHasInstances($faceNamer)) {
            originalValue = $this.data('original');
            // ask if we want to update all instances or just this one
            populateModal(newValue, originalValue, getFaceInstances($faceNamer));
            showModal();
        } else {
            applyNameChange($editText, $this, $input, newValue);
            $this.data('original', newValue);
            originalValue = $this.data('original');
        }
    }

    function handleFaceClick() {
        $input.select();
        enableEditMode();
    }

    function handleFaceHover(e) {
        if (e.type === 'mouseenter') {
            showNamer();
        }

        if (e.type === 'mouseleave') {
            hideNamer();
        }
    }

    function handleKeyUp(e) {
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

    function handleFaceRemoval() {
        $faceToRemove = $this;
        showRemovalModal();
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
    $input.on('keyup', handleKeyUp)
    $faceRemover.on('click', handleFaceRemoval);
    
});