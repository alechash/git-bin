var toggled = false

document.getElementById('toggle-view').addEventListener('click', function () {
    if (toggled == false) {
        document.getElementById('toggle-view').innerText = 'View Formatted'
        document.getElementById('paste-raw').classList.remove('hidden')
        document.querySelector('.CodeMirror.cm-s-default').classList.add('hidden')
        toggled = true
    } else {
        document.getElementById('toggle-view').innerText = 'View Raw'
        document.getElementById('paste-raw').classList.add('hidden')
        document.querySelector('.CodeMirror.cm-s-default').classList.remove('hidden')
        toggled = false
    }
})