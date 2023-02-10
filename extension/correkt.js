window.onload = function() {

    const backgroundColor = JSON.stringify(document.body.style.backgroundColor);
    if(backgroundColor == '"rgb(255, 255, 255)"') {
        const popups = document.querySelectorAll(".popup");
        for (const popup in popups) {
            popup.className = "popup popup-lightMode";
        }

    } else {
        alert("dark mode");
    }
    const documentObserver = new MutationObserver(mutations => {
        // mutations.forEach(function(record) { //more efficient but also more complicated
        //     for (let i = 0; i < record.addedNodes.length; i++) {
        //         alert(record.addedNodes[i]);
        //         // if (record.addedNodes[i]) {
        //         //     alert("tru");
        //         // }
        //     }
        //     addNew();
        // });
        if (document.querySelector('[data-testid="cellInnerDiv"]')) {
            addNew();
        }
    });

    documentObserver.observe(document.documentElement || document.body, {
        childList: true,
        subtree: true
    });
 
    var observer = new IntersectionObserver(function(entries) {
        if(entries[0].isIntersecting === true) {
            if (entries[0].target.parentElement.getBoundingClientRect().height < 5) {
                entries[0].target.remove();
            }
            // alert(entries[0].target.querySelector(".center"));
            // entries[0].target.querySelector(".center").className += " expand";
            entries[0].target.querySelector(".center").className.baseVal += " expand";
            // entries[0].target.querySelector(".loading").className.baseVal += " invisible";
            entries[0].target.className = "logo-container unselectable red";
            // entries[0].target.className += " expand";
        }
    }, { threshold: [1] });
 

    function addNew() {
        const tweets = document.querySelectorAll('[data-testid="cellInnerDiv"]');
        const progressBar = document.querySelector('[role="progressbar"]');
        if(progressBar != null) {
            progressBar.parentElement.parentElement.style.zIndex = 0;
        }
    
        tweets.forEach(function(tweet) {
            const text = tweet.querySelector('[data-testid="tweetText"]');
            if (!tweet.hasAttribute('data-correkt') && tweet.offsetHeight > 12 && text != null) {
                tweet.setAttribute('data-correkt', 'correkt');

                let imageNode = document.createElement('div');
                imageNode.style.top = (window.scrollY + text.getBoundingClientRect().top) - (window.scrollY + tweet.getBoundingClientRect().top) + (text.clientHeight / 2 - 10) + 'px';
                imageNode.className = "logo-container unselectable gray";
                imageNode.innerHTML = '<svg class="logo" version="1.1" viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg"><g transform="translate(4.2145)" enable-background="new"><clipPath><path d="m0 0h1200v1200h-1200z"/></clipPath><path class="center" d="m530.16 784.65c2.0148-1.0239 3.8976-2.3782 5.549-4.0297l298.93-298.93c8.4887-8.4887 8.4887-22.229 0.033-30.685l-15.359-15.359c-8.4227-8.4226-22.163-8.4226-30.652 0.033l-268.3 268.3-118.78-118.78c-8.4887-8.5217-22.196-8.4887-30.652-0.033l-15.359 15.359c-8.4557 8.4226-8.4557 22.196 0.033 30.652l149.4 149.4c6.8372 6.8703 17.043 8.1914 25.169 4.0627zm-354.38-181.87c0-233.49 189.23-422.78 422.78-422.78 233.49 0 422.78 189.23 422.78 422.78 0 233.49-189.23 422.78-422.78 422.78-233.49 0-422.78-189.23-422.78-422.78z" fill-rule="evenodd" style="stroke-width:8.456"/><path class="loading" d="m981.71 217.25c-69.09-69.428-154.98-118.28-248.16-142.59-44.427-11.591-90.509-17.603-137.21-17.606-144.2-4.9e-5 -282.5 57.284-384.47 159.25-101.97 101.97-159.25 240.26-159.25 384.47-5.3e-5 144.2 57.284 282.5 159.25 384.47 101.97 101.97 240.26 159.25 384.47 159.25 143.03-0.066 280.28-56.491 382-157.05" style="fill:none;stroke-width:110;stroke:#000"/><circle cx="261.93" cy="247.79" r=".092404" style="fill:#808000;stroke-width:.75;stroke:#000"/><circle cx="1113.6" cy="89.939" r=".092404" style="fill:#808000;stroke-width:.75;stroke:#000"/><circle cx="1111.8" cy="88.103" r=".092404" style="fill:#808000;stroke-width:.75;stroke:#000"/><circle cx="1033" cy="69.512" r=".15"/></g></svg>';
                tweet.appendChild(imageNode);
                observer.observe(imageNode);

                let popupNode = document.createElement('div');
                popupNode.style.top = -200 + parseInt(imageNode.style.top.replace('px', '')) + 10 + 'px';
                // popupNode.style.top = "-100px";
                if(backgroundColor == '"rgb(255, 255, 255)"') {
                    popupNode.className = "popup popup-lightMode";
                } else {
                    popupNode.className = "popup";
                }
                popupNode.innerHTML = "<b>Correkt</b>";
                // const logoimg = document.createElement('img');
                // logoimg.className = "popup";
                // logoimg.src = "{% static 'firstapp/images/logowhite.svg' %}";
                // tweet.appendChild(logoimg);
                tweet.appendChild(popupNode);
                
                let firstDiv = document.createElement('div');
                firstDiv.className = "popupLogo";
                firstDiv.innerHTML = "20%";
                popupNode.appendChild(firstDiv);

                let secondDiv = document.createElement('div'); 
                secondDiv.className = "popupExit"; 
                popupNode.appendChild(secondDiv); 

                let popupButton = document.createElement('button'); 
                popupButton.className = "popupButton"; 
                popupButton.innerHTML = "OK, THANKS";
                popupButton.addEventListener('click', function() {
                    popup.style.display = 'none';
                });
                secondDiv.appendChild(popupButton); 

            } 
        });
    }

    var visible = null;

    //When truth, expand center green circle with checkmark and shrink to nothing
    //When misinformation, expand center red circle with x mark.

    document.addEventListener("click", function(e) {
        const target = e.target.closest(".logo-container").nextSibling;
        if (target != visible && visible) {
            visible.style.display = "none";
        }
        if(target) {
            if(target.style.display == "block") {
                fade(target);
            } else {
                unfade(target);
                visible = target;
            }
        }
    })

    function fade(element) {
        var op = 1;  // initial opacity
        var timer = setInterval(function () {
            if (op <= 0.1) {
                clearInterval(timer);
                element.style.display = 'none';
            }
            element.style.opacity = op;
            element.style.filter = 'alpha(opacity=' + op * 100 + ")";
            op -= op * 0.5;
        }, 10);
    }

    function unfade(element) {
        element.style.opacity = 0;
        var op = 0.1;  // initial opacity
        element.style.display = 'block';
        var timer = setInterval(function () {
            if (op >= 1){
                clearInterval(timer);
            }
            element.style.opacity = op;
            element.style.filter = 'alpha(opacity=' + op * 100 + ")";
            op += op * 0.5;
        }, 10);
    }
}

// `document.querySelector` may return null if the selector doesn't match anything.
// if (article) {
//   const text = article.textContent;
//   /**
//    * Regular expression to find all "words" in a string.
//    *
//    * Here, a "word" is a sequence of one or more non-whitespace characters in a row. We don't use the
//    * regular expression character class "\w" to match against "word characters" because it only
//    * matches against the Latin alphabet. Instead, we match against any sequence of characters that
//    * *are not* a whitespace characters. See the below link for more information.
//    * 
//    * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
//    */
//   const wordMatchRegExp = /[^\s]+/g;
//   const words = text.matchAll(wordMatchRegExp);
//   // matchAll returns an iterator, convert to array to get word count
//   const wordCount = [...words].length;
//   const readingTime = Math.round(wordCount / 200);
//   const badge = document.createElement("p");
//   // Use the same styling as the publish information in an article's header
//   badge.classList.add("color-secondary-text", "type--caption");
//   badge.textContent = `⏱️ ${readingTime} min read`;

//   // Support for API reference docs
//   const heading = article.querySelector("h1");
//   // Support for article docs with date
//   const date = article.querySelector("time")?.parentNode;

//   // https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentElement
//   (date ?? heading).insertAdjacentElement("afterend", badge);
// }