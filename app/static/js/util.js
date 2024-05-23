export function removeInvalidClassAfterDelay() {
    setTimeout(function() {
        document.querySelectorAll('.is-invalid').forEach(function(element) {
            element.classList.remove('is-invalid');
        });
    }, 5000);
}