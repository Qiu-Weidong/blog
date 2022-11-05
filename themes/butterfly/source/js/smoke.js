(function () {
    const container = document.getElementById('poem-container');
    const texts = container.getElementsByTagName('p');

    for (let i = 0; i < texts.length; i++) {
        let text = texts[i];
        console.log('html', text.innerHTML);
        text.innerHTML = text.innerHTML.replace(/[^a-z<>\\]/g, "<span>$&</span>");
        const letters = text.querySelectorAll("span");
        for (let i = 0; i < letters.length; i++) {
            letters[i].addEventListener('mouseover', function () {
                letters[i].classList.add('active')
            })
        }
    }

})();