/* Go back to Top */
window.onscroll = function () {
    scrollFunction()
};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("goTopBtn").style.transform = "scale(1)";
    } else {
        document.getElementById("goTopBtn").style.transform = "scale(0)";
    }
}

function topFunction() {
    const interval = setInterval(() => {
        if (document.body.scrollTop <= 0 && document.documentElement.scrollTop <= 0) clearInterval(interval);
        else {
            document.body.scrollTop /= 1.2;
            document.documentElement.scrollTop /= 1.2;
        }
    }, 1);
}
/* ------------- */